import random
from django.core.mail import send_mail
from django.conf import settings

from datetime import datetime, timedelta
import pytz

import jwt

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

IST = pytz.timezone('Asia/Kolkata')

def generate_access_token(user):
    now = datetime.now(IST)
    access_token_payload = {
        'company_id': user['company_id'],
        'exp': now + timedelta(minutes=1),
        'iat': now
    }
    access_token = jwt.encode(access_token_payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return access_token

def generate_refresh_token(user):
    now = datetime.now(IST)
    refresh_token_payload = {
        'company_id': user['company_id'],
        'exp': now + timedelta(weeks=4),
        'iat': now
    }
    refresh_token = jwt.encode(refresh_token_payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return refresh_token