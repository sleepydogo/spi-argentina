from django.contrib import admin
from django.urls import path
from django.utils.translation import gettext_lazy as _
from .models import *

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'is_verified', 'date_joined')
    search_fields = ('username', 'first_name', 'last_name')
    list_filter = ('rol',)
    ordering = ('date_joined',)
    readonly_fields = ('id', 'username', 'email', 'phone_number', 'is_verified', 'date_joined', 'last_login', )
    exclude = ('password', 'user_permissions', 'is_staff', 'groups', 'is_superuser')

    def has_add_permission(self, request):
        # Deshabilita la opción de agregar un objeto
        return False
        
@admin.register(Problema)
class ProblemasAdmin(admin.ModelAdmin):
    list_display = ('user', 'comentarios', 'estado')
    readonly_fields = ('user', 'comentarios')
    def has_add_permission(self, request):
        # Deshabilita la opción de agregar un objeto
        return False

@admin.register(Horario)
class HorarioAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Horario._meta.fields]

@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Contacto._meta.fields]
    
