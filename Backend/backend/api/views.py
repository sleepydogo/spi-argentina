from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import validate_email
from django.core.cache import cache
from django.conf import settings
from django.http import HttpResponseNotFound, HttpResponse
from django.contrib.auth.hashers import make_password
from django.utils.timezone import now,  timedelta, localtime
from django.db.models import Q, Sum, Count
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse

from rest_framework import generics, permissions, viewsets, status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Reestablecimiento de contrasenia
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .permissions import EsPropietarioOAdmin

# Utils
from .utils.email_handler import sendOTPEmail
from .utils import FCMManager as fcm 
from .utils.redis_handler import redisHandler, redsDrivers

# Models
from .models import *
from .serializers import *

from random import sample 
from phonenumbers import PhoneNumberFormat
from decouple import config
import phonenumbers, re, requests, datetime, jwt, os, json, random, base64, calendar


class SignUpView(generics.CreateAPIView):
    def get_serializer_class(self):
        # Determine qué clase de serializador usar basado en is_conductor
        is_conductor = self.request.data.get('is_conductor', 'False')
        if is_conductor == 'True':
            return ConductorSerializer
        return UserSerializer
    
    def create(self, request, *args, **kwargs):
        # Copia de los datos y manejo de is_conductor
        try:
            is_conductor = request.data.get('is_conductor', 'False')
        except:
            return Response({'error': 'bad request'}, status=status.HTTP_400_BAD_REQUEST)
        
        data_copy = request.data.copy()
        data_copy.pop('is_conductor', None)
        
        # Utiliza el serializador correspondiente usando get_serializer()
        serializer = self.get_serializer(data=data_copy)
        
        # Valida y guarda el usuario
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'account created succesfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class LogInView(TokenObtainPairView):
    serializer_class = LogInSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

## Generar codigo OTP
class GenerateVerificationCode(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        user = User.objects.filter(email=email).first()
        if email and user:
            twilioHandler.send_code(user.phone_number)
            print('Se envio el codigo de reestablecimiento de cuenta')
            # Devolver una respuesta exitosa
            return Response({'message': 'Se ha enviado un código de verificación por correo electrónico.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Ha habido un error!'}, status=status.HTTP_400_BAD_REQUEST)


# Verificacion de cuenta
class VerifyAccountView(APIView):
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('verification_code')
        user = User.objects.filter(email=email).first()

        if not (email and code and user):
            return Response({'error': 'Código inválido!'})

        if twilioHandler.verify_code(user.phone_number, code):
            # Si el código de verificación es correcto, verifico la cuenta
            user = User.objects.filter(email=email).first()
            user.is_verified = True
            user.is_active = True
            user.save()

            return Response({'data': 'el usuario se verifico exitosamente'})
        else:
            return Response({'error': 'Código de verificación incorrecto.'})


## Codigo de verificacion para reestablecer contrasenia
class VerifyCodeView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        verification_code = request.data.get('verification_code', None)
        user = User.objects.filter(email=email).first()

        if not (email and verification_code and user):
            return Response({'error': 'Se requieren un correo electrónico y un código de verificación para verificar.'}, status=status.HTTP_400_BAD_REQUEST)

        if user:
            attempts_cache_key = f'verification_attempts_{user.id}'
            attempts = cache.get(attempts_cache_key, 0)
            # Limitar a 5 intentos
            print(f"intentos de verificacion: {attempts}")
            cache.set(attempts_cache_key, attempts + 1)
            if attempts >= 5:
                return Response({'error': 'Número máximo de intentos alcanzado. Inténtelo más tarde.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
            # Obtener el código de verificación almacenado en la caché
            if twilioHandler.verify_code(user.phone_number, verification_code):
                # Si el código de verificación es correcto, generar un token para cambiar la contraseña
                token = generate_reset_password_token(user.id)
                return Response({'token': token}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Código de verificación incorrecto.'})
        else:
            return Response({'error': 'No se encontró un usuario con este correo electrónico.'}, status=status.HTTP_404_NOT_FOUND)

def generate_reset_password_token(user_id):
    # Generar un token con información del usuario y una fecha de expiración
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

class ResetPasswordView(APIView):
    def post(self, request):
        token = request.data.get('token', None)
        new_password1 = request.data.get('new_password1', None)
        new_password2 = request.data.get('new_password2', None)

        if token and new_password1 and new_password2:
            if new_password1 != new_password2:
                return Response({'error': 'Las contraseñas deben coincidir!'})
            try:
                # Decodificar el token para obtener el ID del usuario
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = decoded_token['user_id']

                # Obtener el usuario
                user = User.objects.get(pk=user_id)

                # Cambiar la contraseña del usuario
                user.password = make_password(new_password1)
                user.save()

                return Response({'message': 'La contraseña se ha cambiado exitosamente.'}, status=status.HTTP_200_OK)

            except jwt.ExpiredSignatureError:
                return Response({'error': 'El token ha expirado.'}, status=status.HTTP_400_BAD_REQUEST)
            except jwt.InvalidTokenError:
                return Response({'error': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({'error': 'No se encontró un usuario válido.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Se requiere un token y una nueva contraseña para cambiar la contraseña.'}, status=status.HTTP_400_BAD_REQUEST)

class InnerResetPasswordView(APIView):
    permissions_classes = [permissions.IsAuthenticated]

    def post(self, request):
        requester = self.request.user
        new_password1 = request.data.get('new_password1', None)
        new_password2 = request.data.get('new_password2', None)

        if new_password1 and new_password2:
            if new_password1 != new_password2:
                return Response({'error': 'Las contraseñas deben coincidir!'})
            try:
                # Obtener el usuario
                if requester.rol == 'Conductor':
                    user = Conductor.objects.get(pk=requester)
                elif requester.rol == 'Pasajero':
                    user = User.objects.get(id=requester.id)

                # Cambiar la contraseña del usuario
                user.password = make_password(new_password1)
                user.save()

                return Response({'message': 'La contraseña se ha cambiado exitosamente.'}, status=status.HTTP_200_OK)

            except jwt.ExpiredSignatureError:
                return Response({'error': 'El token ha expirado.'}, status=status.HTTP_400_BAD_REQUEST)
            except jwt.InvalidTokenError:
                return Response({'error': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({'error': 'No se encontró un usuario válido.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Se requiere un token y una nueva contraseña para cambiar la contraseña.'}, status=status.HTTP_400_BAD_REQUEST)


class ProblemasView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):   
        try: 
            Problema.objects.create(user=request.user.username, comentarios=request.data.get('comentarios'))
            return Response({"success": "su queja se ha registrado con exito!"})
        except Exception as e :
            print(e)
            return Response({"error": "ha habido un error al registrar su queja"})

class ModificarPerfilView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = User.objects.get(username=request.user.username)
        error = []
        # Verificar si el email esta en uso 
        if (request.data.get('email')):
            if not User.objects.filter(email=request.data.get('email')).exists():
                try:
                    user.email = request.data.get('email')
                except Exception as e :
                    print(e)
                    error.append("El email ingresado es inconsistente.")
            else:
                error.append("Email ya en uso!")
        # Verificar si el número de teléfono ya está en uso
        if (request.data.get('phone_number')):
            if not User.objects.filter(phone_number=request.data.get('phone_number')).exists():
                try:
                    phone_number = phonenumbers.parse(request.data.get('phone_number'), "CO")  # Especificamos el código de país para Argentina
                    if not phonenumbers.is_valid_number(phone_number):
                        error.append("El telefono ingresado es inconsistente.")
                    else: 
                        # Continuar con el resto de la lógica de tu vista si la validación es exitosa
                        user.phone_number = phonenumbers.format_number(phone_number, PhoneNumberFormat.E164)
                except:
                    error.append("El telefono ingresado es inconsistente.")
            else:
                error.append("Telefono ya en uso!")
        if (request.data.get('first_name')):
            user.first_name = request.data.get('first_name')
        
        if (request.data.get('last_name')):
            user.last_name = request.data.get('last_name')  
        
        if (request.data.get('address')):
            user.address = request.data.get('address')

        print(request.data)
        
        user.save()

        if (error == []):
            return Response({"success": "se ha modificado el perfil con exito!"})
        else:
            return Response({"error": error})

class PerfilView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = self.request.user
        perfil_data = {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
        }
           
        elif user.rol == 'Administrador':
            # Si es Moderador o Administrador, puedes incluir los campos de User directamente
            perfil_data["username"] = user.username
            perfil_data["is_staff"] = user.is_staff
            perfil_data["is_superuser"] = user.is_superuser
            # Añadir más campos según sea necesario
        
        return Response(perfil_data, status=status.HTTP_200_OK)

   
class EliminarCuentaView(APIView):
    permissions_classes = [permissions.IsAuthenticated]

    def get(self, request):
        usuario = request.user
        try:
            usuario = User.objects.get(pk=usuario.pk)
            usuario.delete()
            return Response({"mensaje": "Cuenta de usuario eliminada exitosamente"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "El usuario no existe"}, status=status.HTTP_404_NOT_FOUND)
        

class PushTokenAPIView(APIView):    
    permissions_classes = [permissions.IsAuthenticated]
    def post(self, request):
        token = request.data.get('push_token')
        if token:
            # Guardar el token en el usuario actual
            user = request.user
            user.push_token = token
            user.save()
            return Response({"message": "Push token saved successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Push token not provided."}, status=status.HTTP_400_BAD_REQUEST)


class AppVersionView(APIView):
    def get(self, request):
        ios_app_version = config('IOS_APP_VERSION')
        ios_update_url = config('IOS_UPDATE_URL')
        ios_app_driver_version = config('IOS_APP_DRIVER_VERSION')
        ios_update_driver_url = config('IOS_UPDATE_DRIVER_URL')
        android_app_version = config('ANDROID_APP_VERSION')
        android_update_url = config('ANDROID_UPDATE_URL')
        android_app_driver_version = config('ANDROID_APP_DRIVER_VERSION')
        android_update_driver_url = config('ANDROID_UPDATE_DRIVER_URL')
        return Response(
            {
                "androidVersion": android_app_version,
                "iosVersion": ios_app_version,
                
                "androidDriverVersion": android_app_driver_version,
                "iosDriverVersion": ios_app_driver_version,
                
                "androidUpdateURL": android_update_url,
                "iosUpdateURL": ios_update_url,
                
                "androidDriverUpdateURL": android_update_driver_url,
                "iosUpdateDriverURL": ios_update_driver_url
            })
    

class ContactoView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if self.request.user.rol != 'Conductor' and self.request.user.rol != 'Pasajero':
            return Response({'error': 'no posees los permisos para acceder a esta ruta'}, status=status.HTTP_403_FORBIDDEN)
        contacto = Contacto.objects.get(pk=1)
        serializer = ContactoSerializer(contacto)    
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        if  self.request.user.rol != 'Conductor':
            return Response({'error': 'no posees los permisos para acceder a esta ruta'}, status=status.HTTP_403_FORBIDDEN)
        print(request.data.get('contact'))
        return Response({'exito': 'su mensaje se ha enviado satisfactoriamente'}, status=status.HTTP_200_OK)

