import random
from django.core.mail import send_mail
from django.conf import settings

from datetime import datetime, timedelta
import pytz

import jwt

from pymongo import MongoClient

def generate_otp():
    return str(random.randint(100000, 999999))

SENDER_EMAIL = settings.EMAIL_HOST_USER

def send_otp_email(email, otp, subject, message):
    send_mail(
        subject,
        f"{message}, here is your OTP: {otp}",
        SENDER_EMAIL,
        [email],
        fail_silently=False,
    )

IST = pytz.timezone('Asia/Kolkata')

def generate_access_token(user):
    now = datetime.now(IST)
    access_token_payload = {
        'company_id': user['company_id'],
        'exp': now + timedelta(hours=3),
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


client = MongoClient(settings.CONNECTION_STRING)
db = client[settings.MONGODB_NAME]
def data_available(user):
    salesCollection = db[f"{user['company_id']}_sales"]
    predictionsCollection = db[f"{user['company_id']}_predictions"]

    # returns (file available, predictions available) 
    return salesCollection.count_documents({}) > 0, predictionsCollection.count_documents({}) > 0