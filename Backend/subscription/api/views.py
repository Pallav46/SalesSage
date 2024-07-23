import hashlib
import hmac
from datetime import datetime, timedelta

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

import pytz
import razorpay
from pymongo import MongoClient

from django.conf import settings
from django.shortcuts import redirect

from accounts.api.authentication import JWTAuthentication
from inventory.tasks import async_start_training

client = MongoClient(settings.CONNECTION_STRING)
db = client[settings.MONGODB_NAME]
users_collection = db['company_user']
payments_collection = db['user_payments']
IST = pytz.timezone('Asia/Kolkata')

class PurchaseSubscriptionView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        tier = request.data.get('tier')

        if not tier or tier not in [2, 3]:
            return Response({'error': 'Invalid Tier'}, status=status.HTTP_400_BAD_REQUEST)

        if tier == 2:
            amount = 49900
        elif tier == 3:
            amount = 99900

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        data = {
            "amount": amount,
            "currency": "INR",
            "receipt": f"receipt_{user.company_id}_{tier}",
            "payment_capture": 1
        }
        order = client.order.create(data=data)

        return Response({
            "key": settings.RAZORPAY_KEY_ID,
            "order_id": order['id'],
            "amount": order['amount'],
            "currency": order['currency'],
            "tier": tier
        })

class PaymentCallbackView(APIView):
    def post(self, request):
        razorpay_payment_id = request.POST.get('razorpay_payment_id')
        razorpay_order_id = request.POST.get('razorpay_order_id')
        razorpay_signature = request.POST.get('razorpay_signature')

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        order = client.order.fetch(razorpay_order_id)
        receipt = order['receipt']

        company_id = receipt.split('_')[-2]
        tier = receipt.split('_')[-1]
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
        }
        message = '|'.join(params_dict.values())
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            msg=message.encode(),
            digestmod=hashlib.sha256
        ).hexdigest()

        if generated_signature == razorpay_signature:
            payment_data = {
                'company_id': company_id,
                'payment_time': datetime.now(IST),
                'payment_id': razorpay_payment_id,
                'order_id': razorpay_order_id,
                'signature': razorpay_signature
            }
            payments_collection.insert_one(payment_data)

            users_collection.update_one(
                {'company_id': company_id},
                {'$set': {
                    'tier': int(tier),
                    'expiry_date': datetime.now(IST) + timedelta(weeks=24)
                }}
            )
            
            user = users_collection.find_one({'company_id': company_id})

            fields_to_remove = ['_id', 'password', 'email', 'created_at']
            for field in fields_to_remove:
                user.pop(field, None)

            async_start_training.delay(company_id)

            return redirect(f'http://localhost:5173/me')

        return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)
