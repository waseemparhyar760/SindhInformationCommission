from rest_framework import viewsets, filters
from .models import Complaint
from .serializers import PublicComplaintSerializer

class ComplaintSearchFilter(filters.SearchFilter):
    def filter_queryset(self, request, queryset, view):
        search_value = request.query_params.get(self.search_param, '')
        
        # Handle "Number/Year" format (e.g. "123/2024")
        if '/' in search_value:
            parts = search_value.split('/')
            if len(parts) == 2:
                number = parts[0].strip()
                year = parts[1].strip()
                if number and year:
                    # Check for exact match on number + year
                    exact_match = queryset.filter(complaint_number=number, complaint_year=year)
                    if exact_match.exists():
                        return exact_match
        
        return super().filter_queryset(request, queryset, view)

class PublicComplaintViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Complaint.objects.filter(is_approved=True).order_by('-created_at')
    serializer_class = PublicComplaintSerializer
    filter_backends = [ComplaintSearchFilter]
    # Search by Complaint No, Complainant Name, Department (Public Body), or PIO/HOD names (Respondents)
    search_fields = ['complaint_number', 'complaint_year', 'full_name', 'department', 'custom_department', 'public_body_name', 'pio_name', 'hod_name', 'hearings__respondent_name']
