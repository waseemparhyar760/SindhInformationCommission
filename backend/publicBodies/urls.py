from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicBodyViewSet

app_name = 'publicBodies'

router = DefaultRouter()
router.register(r'list', PublicBodyViewSet, basename='publicbody')

urlpatterns = [
    path('', include(router.urls)),
]