from rest_framework import permissions

class EsPropietarioOAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user and (request.user.rol == 'Administrador' or request.user.rol == 'Moderador'):
            return True
        
        # Permitir acceso si el objeto es None (para listas, por ejemplo)
        if obj is None:
            return True
        
        # Permitir al propietario del viaje ver su propio viaje
        return obj.usuario == request.user
class EsModeradorPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Verifica si el usuario es un moderador
        return request.user and request.user.is_moderador