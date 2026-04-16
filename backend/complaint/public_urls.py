from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .public_views import PublicComplaintViewSet

router = DefaultRouter()
router.register(r'search', PublicComplaintViewSet, basename='public-complaint')

urlpatterns = [
    path('', include(router.urls)),
]
