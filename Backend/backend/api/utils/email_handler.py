

from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings
import random

def sendOTPEmail(email):
    try:
        # Generar un código de verificación de 6 dígitos
        verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        # Enviar el código de verificación por correo electrónico
        print(email)
        print(verification_code)
#        try:
#            send_mail(
#                'Código de verificación OTP',
#                f'Tu código de verificación es: {verification_code}',
#                settings.EMAIL_HOST_USER,
#                [email],
#                fail_silently=False,
#            )
#        except Exception as e: 
#            print(e)
#        # Almacenar el código de verificación en la base de datos o en una caché temporal si es necesario
        cache_key = f'verification_code_{email}'
        if cache.get(cache_key):
            cache.delete(cache_key)
        cache.set(cache_key, verification_code, timeout=600)  # Timeout de 10 minutos
    except Exception as e:
        print(e)