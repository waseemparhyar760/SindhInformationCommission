from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import CommissionOverview
from .serializers import CommissionOverviewSerializer

class ActiveCommissionOverviewView(generics.ListAPIView):
    queryset = CommissionOverview.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = CommissionOverviewSerializer
    permission_classes = [AllowAny]