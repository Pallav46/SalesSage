from django.urls import path
from .views import ItemsView, SalesFileView, SalesListView, FuturePredictionView

urlpatterns = [
    path('items/',ItemsView.as_view(), name='items'),
    path('upload-sales-file/',SalesFileView.as_view(), name='upload-sales-file'), #post
    path('view-files/',SalesFileView.as_view(), name='view-files'), #get
    path('delete-file/<str:file_id>/', SalesFileView.as_view(), name='sales-delete'), #delete
    path('view-sales/',SalesListView.as_view(), name='sales'),
    path('predict-sales/',FuturePredictionView.as_view(), name='predict-sales'),
]