from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplaintViewSet, HearingViewSet

router = DefaultRouter()
router.register(r'submit', ComplaintViewSet, basename='complaint')
router.register(r'hearings', HearingViewSet, basename='hearing')

urlpatterns = [
    path('', include(router.urls)),
]