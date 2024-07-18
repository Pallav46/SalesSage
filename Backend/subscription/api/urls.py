from django.urls import path
from .views import PurchaseSubscriptionView, PaymentCallbackView

urlpatterns = [
    path('purchase/', PurchaseSubscriptionView.as_view(), name='purchase'),
    path('callback/', PaymentCallbackView.as_view(), name='callback'),
]