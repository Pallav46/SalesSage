import json
from bson import json_util

import pandas as pd

from datetime import datetime
import pytz

from django.conf import settings

from pymongo import MongoClient
from bson import ObjectId

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.api.authentication import JWTAuthentication

from .ML.lstmModel import SalesPredictionModel
from .ML.dataPreprocessing import DataPreprocessing
from .ML.getPredictions import GetPredictions

client = MongoClient(settings.CONNECTION_STRING)
db = client[settings.MONGODB_NAME]
collection = db['inventory_items']
IST = pytz.timezone('Asia/Kolkata')

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
    
class SalesFileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        sales_collection = db[f"{request.user.company_id}_sales"]

        files = sales_collection.find()

        response_data = []
        for file in files:
            response_data.append({
                "filename": file['filename'],
                "uploaded_at": file['timestamp'],
                "file_id": str(file['file_id']),
                "document_id": str(file['_id'])
            })

        return Response(response_data, status=status.HTTP_200_OK)

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
        
    def delete(self, request, file_id, format=None):
        try:
            file_id = ObjectId(file_id)
        except Exception as e:
            return Response({"error": "Invalid file_id format."}, status=status.HTTP_400_BAD_REQUEST)

        sales_collection = db[f"{request.user.company_id}_sales"]

        file_doc = sales_collection.find_one({"file_id": file_id})
        if not file_doc:
            return Response({"error": "File not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            settings.FS.delete(file_id)
            sales_collection.delete_one({"file_id": file_id})

            return Response({"message": "File deleted successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
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
        
class CreatePredictionView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        salesCollection = db[f"{request.user.company_id}_sales"]
        fs = settings.FS

        try:
            all_documents = list(salesCollection.find())
            
            if(not all_documents):
                return Response({"error": "No sales data found fore prediction"}, status=status.HTTP_404_NOT_FOUND)
            
            predictionsCollection = db[f"{request.user.company_id}_predictions"]
            all_data = []

            for document in all_documents:
                file_id = document.get('file_id')
                if file_id:
                    grid_out = fs.get(file_id)

                    json_data = grid_out.read().decode('utf-8')
                    data = json.loads(json_data)
                    
                    all_data.extend(data)

            df = pd.DataFrame(all_data)
            df = df.drop_duplicates()

            dp = DataPreprocessing()
            df = dp.process_data(df) 

            gp = GetPredictions(df)
            all_predictions = gp.predictions()

            predictionsCollection.delete_many({})

            prediction_document = {
                "date": datetime.now(IST),
                "predictions": all_predictions
            }
            predictionsCollection.insert_one(prediction_document)

            return Response({"message": "Prediction stored successfully"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": "behenchod"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ForecastView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        db = settings.DB
        predictionsCollection = db[f"{request.user.company_id}_predictions"]

        try:
            latest_prediction = predictionsCollection.find_one(sort=[("date", -1)])

            if not latest_prediction:
                return Response({"error": "No predictions found"}, status=status.HTTP_404_NOT_FOUND)

            forecast_json = json.loads(json_util.dumps(latest_prediction['predictions']))

            return Response({"forecast": forecast_json}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            