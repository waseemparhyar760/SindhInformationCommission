from django.contrib import admin
from .models import DashboardStat

@admin.register(DashboardStat)
class DashboardStatAdmin(admin.ModelAdmin):
    list_display = ('updated_at', 'requests_trend', 'annual_report')
    
    # Make these fields read-only to indicate they are auto-calculated (or ignored)
    readonly_fields = ('total_requests', 'appeals_filed', 'resolved_cases', 'avg_response_time')
    
    fieldsets = (
        ('Trends & Report', {
            'fields': ('requests_trend', 'appeals_trend', 'resolved_trend', 'annual_report'),
            'description': 'Enter manual trends and upload the annual report here.'
        }),
        ('Auto-Calculated Metrics (Read-Only)', {
            'fields': ('total_requests', 'appeals_filed', 'resolved_cases', 'avg_response_time'),
            'classes': ('collapse',),
            'description': 'These values are calculated automatically from live data.'
        })
    )
    
    def has_add_permission(self, request):
        # Only allow adding if no instance exists
        if DashboardStat.objects.exists():
            return False
        return True
