"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
import firebase_admin
from firebase_admin import credentials
from django.conf import settings
from django.core.wsgi import get_wsgi_application

print("Iniciando configuración de la aplicación...")

# Establecer la configuración del módulo de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Inicializar la aplicación WSGI de Django
try:
    print("Inicializando la aplicación WSGI de Django...")
    application = get_wsgi_application()
    print("Aplicación WSGI de Django inicializada correctamente.")
except Exception as e:
    print(f"Error al inicializar la aplicación WSGI de Django: {e}")
    raise
