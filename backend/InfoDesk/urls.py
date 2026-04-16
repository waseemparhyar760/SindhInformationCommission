from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InfoDeskDocumentViewSet

router = DefaultRouter()
router.register(r'list', InfoDeskDocumentViewSet, basename='infodesk-doc')

urlpatterns = [
    path('', include(router.urls)),
]