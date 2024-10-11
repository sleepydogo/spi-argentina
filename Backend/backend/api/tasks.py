# api/tasks.py

from celery import shared_task
from django.utils import timezone
from .models import ReservaViaje
import pytz

@shared_task
def check_reservas():
    # Obtener la zona horaria de Colombia
    colombia_tz = pytz.timezone('America/Bogota')
    
    # Obtener la hora actual en la zona horaria de Colombia
    now = timezone.now().astimezone(colombia_tz)
    current_time = now.time().replace(second=0, microsecond=0)  # Ignorar segundos y microsegundos
    print(now.date())
    print(current_time)
    reservas = ReservaViaje.objects.filter(
        fecha=now.date(),
        hora__range=(current_time.replace(second=0, microsecond=0),
                    current_time.replace(second=59, microsecond=999999)),
        viaje__status='Reservado'
    )
    print(reservas)
    for reserva in reservas:
        reserva.viaje.status = 'En curso'
        reserva.viaje.save()
