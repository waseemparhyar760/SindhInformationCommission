from rest_framework import viewsets
from .models import Commissioner
from .serializers import CommissionerSerializer

class CommissionerViewSet(viewsets.ModelViewSet):
    queryset = Commissioner.objects.all()
    serializer_class = CommissionerSerializer