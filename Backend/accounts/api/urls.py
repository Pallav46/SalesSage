from django.urls import path
from .views import SendOTP, VerifyOTP, CompanyIDAvailable, RegisterCompany, LoginView, LogoutView, RefreshTokenView

urlpatterns = [
    path('send-otp/',SendOTP.as_view(), name='send-otp'),
    path('verify-otp/',VerifyOTP.as_view(), name='verify-otp'),
    path('is-companyID-available/',CompanyIDAvailable.as_view(), name='is-companyID-available'),
    path('register/',RegisterCompany.as_view(), name='register'),
    path('login/',LoginView.as_view(), name='login'),
    path('logout/',LogoutView.as_view(), name='logout'),
    path('refresh-token/',RefreshTokenView.as_view(), name='refresh-token'),
]