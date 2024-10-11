from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status
from django.core.exceptions import ObjectDoesNotExist
from api.models import *

class ConfigSettingsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        admin = request.user
        if admin.rol == ('Conductor' or 'Pasajero'): 
            return Response({'error': 'El usuario no tiene permisos para acceder.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            setting = request.data.get('habilitar_paradas')
            if setting == None:
                return Response({'Error': 'Disculpe, no se detecto el campo "habilitar_paradas"'}, status=status.HTTP_400_BAD_REQUEST)
            config = SistemaDeParadas.objects.get_or_create()
            config.is_active = setting 
            return Response({"mensaje": f"El sistema de paradas fue actualizado exitosamente"})
        except ObjectDoesNotExist:
            return Response({"error": "No se pudo procesar su solicitud en este momento"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
