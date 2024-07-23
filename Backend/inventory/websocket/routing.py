from django.urls import path
from .consumers import ModelTrainingConsumer

websocket_urlpatterns = [
    path('ws/training_status/<str:company_id>/', ModelTrainingConsumer.as_asgi()),
]