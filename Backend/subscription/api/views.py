import json
from datetime import datetime, timedelta

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

import pytz
import razorpay  # type: ignore
from pymongo import MongoClient

from django.conf import settings

from accounts.api.authentication import JWTAuthentication

client = MongoClient(settings.CONNECTION_STRING)
db = client[settings.MONGODB_NAME]
users_collection = db['company_user']

class PurchaseSubscriptionView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        tier = request.query_params.get('tier')

        try:
            tier = int(tier)
            if tier not in [2, 3]:
                raise ValueError
        except (TypeError, ValueError):
            return Response({'error': 'Invalid Tier'}, status=status.HTTP_400_BAD_REQUEST)
        
        if tier == 2:
            amount = 100  # ₹1
        elif tier == 3:
            amount = 200  # ₹2

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        data = {
            "amount": amount,
            "currency": "INR",
            "receipt": f"receipt_{user.company_id}",
            "payment_capture": 1
        }
        order = client.order.create(data=data)

        return Response({
            "order_id": order['id'],
            "amount": order['amount'],
            "currency": order['currency'],
            "tier": tier
        })

class PaymentCallbackView(APIView):
    def post(self, request):
        payload = request.data
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        razorpay_signature = request.headers.get('X-Razorpay-Signature')
        try:
            client.utility.verify_webhook_signature(json.dumps(payload), razorpay_signature, settings.RAZORPAY_WEBHOOK_SECRET)
        except razorpay.errors.SignatureVerificationError as e:
            return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)

        status = payload.get('payload')['payment']['entity']['status']

        if status == 'captured':
            email = payload.get('payload')['payment']['entity']['notes']['email']
            tier = int(payload.get('payload')['payment']['entity']['notes']['tier'])
            purchased_on = datetime.now(pytz.UTC)
            expiry = purchased_on + timedelta(years=1)

            users_collection.update_one(
                {'email': email},
                {'$set': {
                    'tier': tier,
                    'purchased_on': purchased_on,
                    'expiry': expiry
                }}
            )
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        
        return Response({"error": "Payment failed"}, status=status.HTTP_400_BAD_REQUEST)
