from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title_en', 'title_ur', 'title_sd')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Content', {
            'fields': (
                ('title_en', 'title_ur', 'title_sd'),
                ('description_en', 'description_ur', 'description_sd')
            )
        }),
        ('Attachments', {
            'fields': ('file', 'link')
        }),
        ('Status', {
            'fields': ('is_active', 'created_at', 'updated_at')
        }),
    )
