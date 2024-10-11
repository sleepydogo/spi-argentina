
from django.db.models.signals import post_save
from django.dispatch import receiver
from api.models import Solicitud

@receiver(post_save, sender=Solicitud)
def actualizar_autos_asociados(sender, instance, **kwargs):
    # Verifica si la solicitud ha sido aceptada
    if instance.estado == 'Aprobada':
        # Asocia el auto al conductor
        instance.conductor.vehiculos_asociados.add(instance.vehiculo)
    elif instance.estado == 'Rechazada':
        instance.conductor.vehiculos_asociados.remove(instance.vehiculo)
