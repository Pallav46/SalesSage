from django.urls import path
from .views import ItemsView, SalesFileView, SalesListView, CreatePredictionView, ForecastView

urlpatterns = [
    path('items/',ItemsView.as_view(), name='items'),
    path('upload-sales-file/',SalesFileView.as_view(), name='upload-sales-file'), #post
    path('view-files/',SalesFileView.as_view(), name='view-files'), #get
    path('delete-file/<str:file_id>/', SalesFileView.as_view(), name='sales-delete'), #delete
    path('view-sales/',SalesListView.as_view(), name='sales'),
    path('create-predictions/',CreatePredictionView.as_view(), name='predict-sales'),
    path('get-forecast/',ForecastView.as_view(), name='forecast'),
]