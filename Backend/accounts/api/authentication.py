import jwt

from django.conf import settings

from mongoengine import DoesNotExist
from pymongo import MongoClient

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

client = MongoClient(settings.CONNECTION_STRING)
db = client[settings.MONGODB_NAME]
users_collection = db['company_user']

class User:
    def __init__(self, user_data):
        for key, value in user_data.items():
            setattr(self, key, value)

    @property
    def is_authenticated(self):
        return True

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            company_id = payload.get('company_id')

            if not company_id:
                raise AuthenticationFailed('Invalid token')
            
            try:
                company_user = users_collection.find_one({'company_id': company_id})
            except DoesNotExist:
                raise AuthenticationFailed('User not found')

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        return (User(company_user), None)