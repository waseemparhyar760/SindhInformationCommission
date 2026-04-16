from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffMemberViewSet

router = DefaultRouter()
router.register(r'list', StaffMemberViewSet, basename='staffmember')

urlpatterns = [
    path('', include(router.urls)),
]