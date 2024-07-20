import json

import pandas as pd

from datetime import datetime
import pytz

from django.conf import settings

from pymongo import MongoClient

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.api.authentication import JWTAuthentication

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
        file = request.FILES.get('file')

        if not file or not file.name.endswith('.csv'):
            return Response({"error": "File format not supported. Please upload a CSV file."}, status=status.HTTP_400_BAD_REQUEST)

        # Read CSV file into a DataFrame
        try:
            data = pd.read_csv(file)
        except Exception as e:
            return Response({"error": f"Error reading CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Convert DataFrame to JSON
        data_json = data.to_json(orient='records')

        # Create a document with a timestamp and the JSON data
        IST = pytz.timezone('Asia/Kolkata')
        document = {
            "timestamp": datetime.now(IST),
            "filename": file.name
        }
        try:
            file_id = settings.FS.put(
                data_json.encode('utf-8'),
                filename=file.name,
                content_type='application/json'
            )
            
            # Add the GridFS file ID to the document
            document["file_id"] = file_id

            # Insert the document into the sales collection
            sales_collection = db[f"{request.user.company_id}_sales"]
            result = sales_collection.insert_one(document)

            return Response({
                "message": "File processed and data stored successfully.",
                "document_id": str(result.inserted_id),
                "file_id": str(file_id)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Error storing data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class SalesListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        salesCollection = db[f"{request.user.company_id}_sales"]
        fs = settings.FS

        try:
            # Retrieve all documents from the sales collection
            all_documents = list(salesCollection.find())

            all_data = []

            for document in all_documents:
                file_id = document.get('file_id')
                if file_id:
                    grid_out = fs.get(file_id)
                    
                    # Read and parse the JSON data
                    json_data = grid_out.read().decode('utf-8')
                    data = json.loads(json_data)
                    
                    # Add this data to our list
                    all_data.extend(data)

            # Convert the combined data to a DataFrame
            df = pd.DataFrame(all_data)
            df = df.drop_duplicates()
            # Convert the final DataFrame back to JSON
            final_json = df.to_json(orient='records')

            return Response(json.loads(final_json), status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": {str(e)}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)