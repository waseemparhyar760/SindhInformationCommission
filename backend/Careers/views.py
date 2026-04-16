from rest_framework import viewsets
from .models import Career
from .serializers import CareerSerializer

class CareerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Career.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = CareerSerializer
    pagination_class = None