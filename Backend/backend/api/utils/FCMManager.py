from firebase_admin import messaging

def sendPush(title, msg, registration_codes, dataObject=None):
    try:
        # Mensajes de depuración para verificar los datos entrantes
        print(f"Enviando notificación push...\nTítulo: {title}\nMensaje: {msg}")
        print(f"Tokens de registro: {registration_codes}")
        if dataObject:
            print(f"Datos adicionales: {dataObject}")
        
        # Recorrer cada token y enviar el mensaje individualmente
        for token in registration_codes:
            # Construcción del mensaje
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=msg,
                ),
                data=dataObject if dataObject else {},  # Asegúrate de que dataObject no sea None
                token=token,
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(sound='default')
                    ),
                    headers={
                        'apns-priority': '10'  # Establece la prioridad 10
                    },
                ),
            )
            
            # Envío del mensaje
            response = messaging.send(message)
            
            # Mensajes de depuración para verificar el estado del envío
            print(f"Mensaje enviado exitosamente al token {token}: {response}")

    except Exception as e:
        # Manejo de errores con detalle de la excepción
        print(f"Error al enviar la notificación: {e}")
        return None
