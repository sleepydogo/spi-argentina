from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework.response import Response

import phonenumbers
from phonenumbers import PhoneNumberFormat

from .models import *

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    
    def validate(self, data):
        for field in ['email', 'phone_number', 'first_name', 'last_name', 'password1', 'password2']:
            if not data.get(field):
                raise serializers.ValidationError({field: [f'El campo {field} es obligatorio.']})
        
        # Verificar si el correo electrónico ya está en uso
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': ['Este correo electrónico ya está en uso.']})

        # Verificar si el número de teléfono ya está en uso
        if User.objects.filter(phone_number=data['phone_number']).exists():
            raise serializers.ValidationError({'phone_number': ['Este número de teléfono ya está en uso.']})
        
        data['password'] = data['password1']
        
        new_dict = {}
        new_dict['username'] = data['email']
        new_dict['phone_number'] = data['phone_number']
        new_dict.update(data)
        new_dict.pop('password1', None)
        new_dict.pop('password2', None)

        return new_dict

    def create(self, validated_data):
        try:
            # Utiliza create en lugar de get_or_create
            user = User.objects.create_user(**validated_data)
            return user
        except IntegrityError:
            raise serializers.ValidationError({'email': ['Error al crear el usuario.']})

    class Meta:
        model = User
        fields = ['email', 'phone_number', 'first_name', 'last_name', 'phone_number', 'password1', 'password2']


class LogInSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data = UserSerializer(user).data
        print(user_data)
        for key, value in user_data.items():
            if key != 'id':
                token[key] = value
        return token
    

class ProblemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problema
        fields = (
            '__all__'
        )


class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = ['hora_inicio', 'hora_fin']


class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = '__all__'  # Incluye todos los campos del modelo
