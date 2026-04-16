from django.urls import path
from .views import ActiveLogoView

app_name = 'WebsiteSettingsApp'

urlpatterns = [
    path('logo/', ActiveLogoView.as_view(), name='active-logo'),
]