import random
from django.core.mail import send_mail
from django.conf import settings

def generate_otp():
    return str(random.randint(100000, 999999))

SENDER_EMAIL = settings.EMAIL_HOST_USER

def send_otp_email(email, otp):
    send_mail(
        "Welcome to SalesSage",
        f"To get started, here is your OTP: {otp}",
        SENDER_EMAIL,
        [email],
        fail_silently=False,
    )
