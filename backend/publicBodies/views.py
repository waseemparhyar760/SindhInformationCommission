from rest_framework import viewsets, filters
from django.db.models import Count, OuterRef, Subquery, Value, IntegerField
from django.db.models.functions import Coalesce
from .models import PublicBody
from .serializers import PublicBodySerializer
from complaint.models import Complaint

class PublicBodyViewSet(viewsets.ModelViewSet):
    serializer_class = PublicBodySerializer
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ['name_en', 'name_ur', 'name_sd', 'pio_name_en', 'department__hod_name_en']

    def get_queryset(self):
        # Optimization: Annotate complaint count to avoid N+1 queries in serializer
        complaints_qs = Complaint.objects.filter(
            department__iexact=OuterRef('name_en')
        ).values('department').annotate(
            cnt=Count('id')
        ).values('cnt')

        return PublicBody.objects.annotate(
            complaint_count_annotated=Coalesce(
                Subquery(complaints_qs, output_field=IntegerField()), 
                Value(0)
            )
        ).select_related('department').order_by('name_en')
