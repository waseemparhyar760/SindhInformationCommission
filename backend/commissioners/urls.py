from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommissionerViewSet

router = DefaultRouter()
router.register(r'list', CommissionerViewSet, basename='commissioner')

urlpatterns = [
    path('', include(router.urls)),
]