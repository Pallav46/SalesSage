import csv
from datetime import datetime

from django.conf import settings

from pymongo import MongoClient

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.api.authentication import JWTAuthentication
from .serializers import SalesSerializer
from inventory.models import Sales
client = MongoClient(settings.MONGODB_HOST, settings.MONGODB_PORT)
db = client[settings.MONGODB_NAME]
collection = db['inventory_items']

class ItemsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        result = collection.insert_one(data)
        data['_id'] = str(result.inserted_id)
        return Response(data, status=status.HTTP_201_CREATED)

    def get(self, request):
        items = list(collection.find())
        for item in items:
            item['_id'] = str(item['_id'])
        return Response(items, status=status.HTTP_200_OK)
    
class SalesUploadView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        file = request.FILES['file']
        data = csv.DictReader(file.read().decode('utf-8').splitlines())
        
        salesCollection = db[f"{request.user.company_id}_sales"]
        
        for row in data:
            date_str = row['date']
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            
            salesCollection.insert_one({
                'date': date_obj,
                'product_id': row['product_id'],
                'sales_quantity': int(row['sales_quantity']),
                'price_per_unit': float(row['price_per_unit']),
                'cost_per_unit': float(row['cost_per_unit'])
            })
        
        return Response({"message": "CSV data uploaded successfully"}, status=status.HTTP_201_CREATED)
    
class SalesListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request,format=None):
        salesCollection = db[f"{request.user.company_id}_sales"]
    
        sales_data = list(salesCollection.find({}))

        serializer = SalesSerializer(sales_data, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)