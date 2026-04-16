from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResourceDocumentViewSet

router = DefaultRouter()
router.register(r'list', ResourceDocumentViewSet, basename='resource')

urlpatterns = [
    path('', include(router.urls)),
]