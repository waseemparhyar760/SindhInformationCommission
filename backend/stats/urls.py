from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardStatViewSet

router = DefaultRouter()
router.register(r'summary', DashboardStatViewSet, basename='dashboard-stat')

urlpatterns = [
    path('', include(router.urls)),
]