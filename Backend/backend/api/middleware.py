# middleware.py

from django.http import HttpResponseForbidden

class Hide404Middleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if response.status_code == 404:
            response.content = b'Not Found'
            response['Content-Type'] = 'text/plain'

        return response
    
class EnabledFeaturesMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not getattr(request, 'user', None) or not request.user.is_staff:
            # Solo aplicar restricciones a usuarios administradores
            return self.get_response(request)

        if not getattr(request, 'enable_features', True):
            # Si las funcionalidades están deshabilitadas, devuelve una respuesta 403 Forbidden
            return HttpResponseForbidden("Funcionalidades deshabilitadas por el administrador.")

        return self.get_response(request)
