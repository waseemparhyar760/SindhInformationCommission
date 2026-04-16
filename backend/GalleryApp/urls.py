from django.urls import path
from .views import EventListView

urlpatterns = [
    path('list/', EventListView.as_view(), name='event-list'),
]