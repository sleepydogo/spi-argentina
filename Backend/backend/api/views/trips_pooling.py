## Funcion para que los conductores descarguen los viajes solicitados
from rest_framework.views import APIView
from rest_framework import generics, permissions, viewsets, status
from models import *
from serializers import *
from utils.geo_clasifier import 

def retornar_viaje(self, request): 
    latitud = request.data['latitude']
    longitude = request.data['longitude']
    
    viajes_esperando = Viaje.objects.filter(status='Esperando').first()
    serializer = TripSerializer(viajes_esperando, context={'request': request})
    data = serializer.data
    
def retornar_viaje_sin_parada(self, request): 
    latitud = request.data['latitude']
    longitude = request.data['longitude']
    
    viajes_esperando = Viaje.objects.filter(status='Esperando').first()
    serializer = TripSerializer(viajes_esperando, context={'request': request})
    data = serializer.data

class GetTripsPoolingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        # Verifica si el usuario autenticado es un conductor
        if request.user.rol != 'Conductor':
            return Response({'error': 'El usuario no tiene permisos para acceder.'}, status=status.HTTP_403_FORBIDDEN)

        # Filtra los viajes en estado "esperando"
        switch_state, created = SwitchState.objects.get_or_create(id=1)
        sistema_paradas, _ = SistemaDeParadas.objects.get_or_create(id=1)
        
        if switch_state.current_object == 1:
            if (sistema_paradas):
                retornar_viaje(self, request)
            else: 
                retornar_viaje_sin_paradas(self, request)
            next_object = 2
        else: 
            viajes_esperando = ViajeManual.objects.filter(status='Esperando').first()
            serializer = ViajeManualSerializer(viajes_esperando, context={'request': request})
            data = serializer.data
            data['manual'] = True
            next_object = 1
        switch_state.current_object = next_object
        switch_state.save()
        return Response(data, status=status.HTTP_200_OK)
        

    ## Marcar viajes como "en curso"
    def post(self, request):
        user = request.user

        # Verificar si el usuario es un conductor
        try:
            conductor = User.objects.get(username=user.username)
        except Conductor.DoesNotExist:
            return Response({'error': 'Solo accesible para conductores'}, status=status.HTTP_403_FORBIDDEN)
        
        # Si el conductor tiene un viaje activo se descarta la peticion
        if Viaje.objects.filter(driver=conductor, status='En curso').exists():
            return Response({"error": f"{conductor.username} ya tiene un viaje activo"})
        
        # Obtener el ID del viaje desde la solicitud POST
        viaje_id = request.data.get('viaje_id')

        try:
            # Obtener el viaje
            viaje = Viaje.objects.get(id=viaje_id, status='Esperando')
            # Asigno el conductor
            viaje.driver = conductor
            # Viaje name driver
            viaje.name_driver = conductor.first_name + " " + conductor.last_name
            # Estado del viaje
            viaje.status = 'En curso'
            # Asigno el auto al viaje
            viaje.car = Vehiculo.objects.filter(conductor_actual=conductor).first()
            # Cargo el rating del viaje
            viaje.driver_rating = Conductor.objects.get(id=conductor.id).rating
            # Guardo el viaje 
            viaje.save()
            
            conductor = Conductor.objects.get(username=request.user.username)
            conductor.con_viaje = True
            conductor.save()
            
            usuario = viaje.rider
            # TODO: Activar notificaciones
            #fcm.sendPush(f"{usuario.first_name}, tu viaje ha sido aceptado!", f"El conductor {conductor.first_name} {conductor.last_name} esta en camino.", [usuario.push_token])

            return Response({
                "id": f"{viaje.id}",
                "driver": f"{viaje.driver}",
                "status": f"{viaje.status}",
                }, status=status.HTTP_200_OK)
        except Viaje.DoesNotExist:
            return Response({'error': 'El viaje no existe o no está en estado "esperando".'}, status=status.HTTP_400_BAD_REQUEST)
