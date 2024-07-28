import json
from bson import json_util
from django.core.cache import cache
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import datetime
from django.conf import settings
from celery import shared_task
import logging
import pandas as pd
from inventory.api.ML.dataPreprocessing import DataPreprocessing
from inventory.api.ML.getPredictions import GetPredictions
logger = logging.getLogger(__name__)
import time

@shared_task
def async_start_training(company_id):
    channel_layer = get_channel_layer()
    try:
        time.sleep(10)
        async_to_sync(channel_layer.group_send)(
            f'training_status_{company_id}',
            {
                'type': 'training_status',
                'status': 'Model running'
            }
        )
        logger.info("Async training started for company_id: %s", company_id)
<<<<<<< HEAD
        # Your existing training code here
        db = settings.DB
        sales_collection = db[f"{company_id}_sales"]
        fs = settings.FS

        all_documents = list(sales_collection.find())
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
        logger.info("Prediction will start now for company_id: %s", company_id)
        gp = GetPredictions(df,tier=3)
        all_predictions = gp.predictions()

        predictions_collection = db[f"{company_id}_predictions"]
        predictions_collection.delete_many({})

        prediction_document = {
            "date": datetime.now(),
            "predictions": all_predictions
        }
        predictions_collection.insert_one(prediction_document)

        cache_key = f"forecast_{company_id}"
        forecast_json = json.loads(json_util.dumps(all_predictions))
        cache.set(cache_key, json.dumps(forecast_json), timeout=3600)
=======
>>>>>>> 8887402404ac8f448da071445824d0a46db03ee4
        
        # Your existing training code here
        # db = settings.DB
        # sales_collection = db[f"{company_id}_sales"]
        # fs = settings.FS

        # all_documents = list(sales_collection.find())
        # all_data = []

        # for document in all_documents:
        #     file_id = document.get('file_id')
        #     if file_id:
        #         grid_out = fs.get(file_id)
        #         json_data = grid_out.read().decode('utf-8')
        #         data = json.loads(json_data)
        #         all_data.extend(data)

        # df = pd.DataFrame(all_data)
        # df = df.drop_duplicates()

        # dp = DataPreprocessing()
        # df = dp.process_data(df)
        # logger.info("Prediction will start now for company_id: %s", company_id)
        # gp = GetPredictions(df)
        # all_predictions = gp.predictions()

        # predictions_collection = db[f"{company_id}_predictions"]
        # predictions_collection.delete_many({})

        # prediction_document = {
        #     "date": datetime.now(),
        #     "predictions": all_predictions
        # }
        # predictions_collection.insert_one(prediction_document)

        # cache_key = f"forecast_{company_id}"
        # forecast_json = json.loads(json_util.dumps(all_predictions))
        # cache.set(cache_key, json.dumps(forecast_json), timeout=3600)
        
        time.sleep(10)
        async_to_sync(channel_layer.group_send)(
            f'training_status_{company_id}',
            {
                'type': 'training_status',
                'status': 'success'
            }
        )
        logger.info("Training completed for company_id: %s", company_id)

    except Exception as e:
        async_to_sync(channel_layer.group_send)(
            f'training_status_{company_id}',
            {
                'type': 'training_status',
                'status': f'failed: {str(e)}'
            }
        )
        logger.error("Training failed for company_id: %s with error: %s", company_id, str(e))