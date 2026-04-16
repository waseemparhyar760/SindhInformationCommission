from django.urls import path
from .views import ActListView

urlpatterns = [
    path('list/', ActListView.as_view(), name='act-list'),
]