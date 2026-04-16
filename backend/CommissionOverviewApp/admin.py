from django.contrib import admin
from .models import CommissionOverview

@admin.register(CommissionOverview)
class CommissionOverviewAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('title_en', 'description_en', 'title_ur', 'description_ur', 'title_sd', 'description_sd')