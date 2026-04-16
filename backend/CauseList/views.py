from rest_framework import generics
from .models import CauseList
from .serializers import CauseListSerializer

class CauseListListView(generics.ListAPIView):
    queryset = CauseList.objects.filter(is_approved=True).prefetch_related('hearings', 'hearings__complaint')
    serializer_class = CauseListSerializer