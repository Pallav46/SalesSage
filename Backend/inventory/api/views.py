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

from inventory.api.ML.dataPreprocessing import DataPreprocessing
import pandas as pd
client = MongoClient(settings.CONNECTION_STRING)
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

        if not file.name.endswith('.csv'):
            return Response({"error": "File format not supported. Please upload a CSV file."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = pd.read_csv(file)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
        data_preprocessor = DataPreprocessing()
        processed_data = data_preprocessor.process_data(data)
        data_dict = processed_data.to_dict('records')

        salesCollection = db[f"{request.user.company_id}_sales"]

        try:
            salesCollection.insert_many(data_dict)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "File processed and data stored successfully."}, status=status.HTTP_200_OK)
    
class SalesListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request,format=None):
        salesCollection = db[f"{request.user.company_id}_sales"]
    
        sales_data = list(salesCollection.find({}))

        serializer = SalesSerializer(sales_data, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)