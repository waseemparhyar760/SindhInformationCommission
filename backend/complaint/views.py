from rest_framework import viewsets, generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Complaint, Hearing
from .serializers import ComplaintSerializer, HearingSerializer
from django.utils import timezone

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['complaint_number', 'full_name', 'cnic', 'department', 'public_body_name', 'subject', 'pio_name']
    filterset_fields = ['hearings__procedural_status']

    def get_queryset(self):
        if self.request.method == 'GET':
            return Complaint.objects.filter(is_approved=True).distinct().order_by('-created_at')
        return super().get_queryset()

class HearingViewSet(viewsets.ModelViewSet):
    serializer_class = HearingSerializer

    def get_queryset(self):
        return Hearing.objects.select_related('complaint').filter(hearing_date__gte=timezone.now().date()).order_by('hearing_date', 'hearing_time')