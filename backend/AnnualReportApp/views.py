from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import AnnualReport
from .serializers import AnnualReportSerializer

class AnnualReportListView(generics.ListAPIView):
    queryset = AnnualReport.objects.all()
    serializer_class = AnnualReportSerializer
    permission_classes = [AllowAny]