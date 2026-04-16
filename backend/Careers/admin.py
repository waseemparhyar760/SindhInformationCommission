from django.contrib import admin
from .models import Career

@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'department', 'deadline', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at', 'deadline')
    search_fields = ('title_en', 'title_ur', 'title_sd', 'department')
    fieldsets = (
        ('Job Details', {'fields': ('title_en', 'title_ur', 'title_sd', 'description_en', 'description_ur', 'description_sd', 'department', 'location', 'deadline')}),
        ('Attachments & Settings', {'fields': ('file', 'link', 'is_active')}),
    )