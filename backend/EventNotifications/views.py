from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Notification.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = NotificationSerializer
    pagination_class = None