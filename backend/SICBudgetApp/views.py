from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Budget
from .serializers import BudgetSerializer

class BudgetListView(generics.ListAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Budget.objects.filter(is_approved=True).order_by('-created_at')
        year = self.request.query_params.get('year')
        search = self.request.query_params.get('search')
        
        if year:
            queryset = queryset.filter(created_at__year=year)
        
        if search:
            queryset = queryset.filter(
                Q(title_en__icontains=search) | 
                Q(title_ur__icontains=search) | 
                Q(title_sd__icontains=search)
            )
        return queryset