import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser, User
from django.shortcuts import reverse
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    # Already has username, first_name, last_name, email, password, is_staff, is_active, date_joined    
    class Role(models.TextChoices):
        ADMINISTRADOR = 'Administrador'
        MODERADOR = 'Moderador'
        CONDUCTOR = 'Conductor'
        PASAJERO = 'Pasajero'
    AbstractUser.username = None
    rol = models.CharField(max_length=13, choices=Role.choices, default=Role.PASAJERO)
    phone_number = models.CharField(max_length=15, blank=True, verbose_name='Teléfono')
    is_verified = models.BooleanField(default=False, verbose_name='Cuenta Verificada')
    is_active = models.BooleanField(default=True, verbose_name='Cuenta Activa')
    push_token = models.CharField(max_length=255, blank=True, null=True)
    def __str__(self):
        return f'user: {self.id} - {self.first_name} - {self.last_name}'
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

class Problema(models.Model):    
    class Estado(models.TextChoices):
        PENDIENTE = 'Pendiente'
        RESUELTO = 'Resuelto'

    user = models.CharField(max_length=100, null=True, verbose_name='Usuario')
    comentarios = models.CharField(max_length=500, verbose_name='Comentarios')
    estado = models.CharField(max_length=50, choices=Estado.choices, default=Estado.PENDIENTE)

    class Meta: 
        verbose_name = 'Problema'
        verbose_name_plural = 'Problemas'

class Horario(models.Model):
    hora_inicio = models.TimeField(default="22:00:00")
    hora_fin = models.TimeField(default="06:00:00")
    

class Contacto(models.Model):
    telefono_transito = models.CharField(max_length=15, verbose_name="Teléfono Secretaria de transito")
    telefono_policia = models.CharField(max_length=15, blank=True, null=True, verbose_name="Teléfono Policia metropolitana")
    telefono_departamental = models.CharField(max_length=15, blank=True, null=True, verbose_name="Teléfono Secretaria departamental")
    telefono_alcaldia = models.CharField(max_length=15, blank=True, null=True, verbose_name="Teléfono Alcaldia")

    def __str__(self):
        return f"Contacto {self.id}"

    class Meta:
        verbose_name = "Contacto"
        verbose_name_plural = "Contactos"
