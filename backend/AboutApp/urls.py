from django.urls import path
from .views import ActiveOrganogramListView

app_name = 'AboutApp'

urlpatterns = [
    path('organogram/', ActiveOrganogramListView.as_view(), name='active-organogram'),
]