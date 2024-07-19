import jwt

from datetime import datetime, timedelta
import pytz

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from pymongo import MongoClient

from accounts.api.authentication import JWTAuthentication
from .utils import generate_otp, send_otp_email, generate_access_token, generate_refresh_token

client = MongoClient(settings.CONNECTION_STRING)
db = client[settings.MONGODB_NAME]
users_collection = db['company_user']
otp_collection = db['otp_records']

class SendOTP(APIView):
    def post(self, request):
        email = request.data.get('email')

        if users_collection.find_one({'email': email}):
            return Response({'error': 'Email already registered'}, status=status.HTTP_409_CONFLICT)
        
        existing_otp = otp_collection.find_one({'email': email})
        otp = generate_otp()
        expiry_time = datetime.now() + timedelta(minutes=5)

        if existing_otp:
            otp_collection.update_one(
                {'email': email},
                {'$set': {'otp': otp, 'expiry_time': expiry_time}}
            )
        else:
            otp_collection.insert_one({
                'email': email,
                'otp': otp,
                'expiry_time': expiry_time
            })
        try:
            send_otp_email(email, otp)
        except:
            otp_collection.delete_one({'email': email})
            return Response({"error": "Failed to send OTP"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
    
class VerifyOTP(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp_entered = request.data.get('otp')

        otp_record = otp_collection.find_one({'email': email, 'otp': otp_entered})

        if otp_record and otp_record['expiry_time'] > datetime.now():
            otp_collection.delete_one({'email': email, 'otp': otp_entered})

            users_collection.insert_one({
                'email': email
            })

            return Response({"message": "User created successfully with email"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Invalid OTP or OTP expired"}, status=status.HTTP_400_BAD_REQUEST)
        
class CompanyIDAvailable(APIView):
    def get(self, request):
        company_id = request.query_params.get('company_id')
        if not company_id:
            return Response({'error': 'Company_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if users_collection.find_one({'company_id': company_id}):
            return Response({'error': 'Company_id is not available'}, status=status.HTTP_409_CONFLICT)
        
        return Response({'message': 'Company_id is available'}, status=status.HTTP_200_OK)

class RegisterCompany(APIView):
    def post(self, request):
        email = request.data.get('email')
        company_name = request.data.get('company_name')
        company_id = request.data.get('company_id')
        password = request.data.get('password')

        user = users_collection.find_one({'email': email})

        if not user:
            return Response({"error": "Email modified or not found"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not company_name or not company_id or not password:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if users_collection.find_one({'company_id': company_id}):
            return Response({"error": "Company ID already taken"}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 8 or not any(char in '!@#$%^&*()_+' for char in password):
            return Response({"error": "Password should be at least 8 characters long including special characters"}, status=status.HTTP_400_BAD_REQUEST)

        users_collection.update_one(
            {'email': email},
            {'$set': {
                'company_name': company_name,
                'company_id': company_id,
                'password': make_password(password),
                'created_at': datetime.now(pytz.UTC) + timedelta(hours=5, minutes=30),
                'tier': 1
            }}
        )

        sales_collection_name = f"{company_id}_sales"
        item_collection_name = f"{company_id}_items"
        db.create_collection(item_collection_name)
        db.create_collection(sales_collection_name)

        user = users_collection.find_one({'company_id': company_id})
        access_token = generate_access_token(user)
        refresh_token = generate_refresh_token(user)

        fields_to_remove = ['_id', 'password', 'email', 'created_at']
        for field in fields_to_remove:
            user.pop(field, None)

        return Response({
            'access_token': access_token,
            'access_token_exp': 1,
            'refresh_token': refresh_token,
            'user': user
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        data = request.data
        user = users_collection.find_one({'company_id': data.get('company_id')})
        if user and check_password(data.get('password'), user['password']):
            access_token = generate_access_token(user)
            refresh_token = generate_refresh_token(user)

            fields_to_remove = ['_id', 'password', 'email', 'created_at']
            for field in fields_to_remove:
                user.pop(field, None)
            
            return Response({
                'access_token': access_token,
                'access_token_exp': 1,
                'refresh_token': refresh_token,
                'user': user
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
class RefreshTokenView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token is None:
            return Response({'error': 'Please provide a refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Refresh token expired'}, status=status.HTTP_403_FORBIDDEN)
        
        user = users_collection.find_one({'company_id': payload['company_id']})
        if user is None:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        
        access_token = generate_access_token(user)

        fields_to_remove = ['_id', 'password', 'email', 'created_at']
        for field in fields_to_remove:
            user.pop(field, None)
            
        return Response({
            'access_token': access_token,
            'access_token_exp': 1,
            'user': user
            }, status=status.HTTP_200_OK)
    
class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        return Response({"success": "Successfully logged out."}, status=status.HTTP_200_OK)

class UserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user.__dict__
        fields_to_remove = ['_id', 'password', 'created_at']
        for field in fields_to_remove:
            user.pop(field, None)
        return Response(user, status=status.HTTP_200_OK)