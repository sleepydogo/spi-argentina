
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api.views import *

from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('e87a518c-5a69-4ccb-877a-1201d113ceaf/f376de17-130c-408f-8f9b-f7e81ee8ea6a', admin.site.urls),
    
    path('api/', include('api.urls')),

    path('api/sign-up', SignUpView.as_view(), name='sign_up'),
    
    path('api/log-in', LogInView.as_view(), name='log_in'),
    
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/get-verif-code', GenerateVerificationCode.as_view(), name='get_verification_password_reset'),
    
    path('api/verify-account', VerifyAccountView.as_view(), name='verify_account'),

    path('api/get-psw-rst-token', VerifyCodeView.as_view(), name='get_token_password_reset'),
    
    path('api/change-psw', ResetPasswordView.as_view(), name='reset_password'),
    
    path('api/change-psw/i', InnerResetPasswordView.as_view(), name='inner_reset_password'),
    
    path('api/problemas', ProblemasView.as_view(), name='problemas'),

    path('api/modificar-perfil', ModificarPerfilView.as_view(), name='modificar_perfil'),

    path('api/get-profile', PerfilView.as_view(), name='get_profile'),

    path('api/eliminar-cuenta', EliminarCuentaView.as_view(), name='eliminar-cuenta'),
  
    path('api/push-token', PushTokenAPIView.as_view(), name='push_token'),
    
    path('api/get-app-current-version', AppVersionView.as_view(), name='get-app-current-version'),

    path('api/emergency-contacts', ContactoView.as_view(), name='emergency_contacts'),
]
