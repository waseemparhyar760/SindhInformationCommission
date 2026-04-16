from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Act
from .serializers import ActSerializer

class ActListView(generics.ListAPIView):
    queryset = Act.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ActSerializer
    permission_classes = [AllowAny]