from django.urls import path
from .views import ActiveCommissionOverviewView

urlpatterns = [
    path('active/', ActiveCommissionOverviewView.as_view(), name='active-overview'),
]