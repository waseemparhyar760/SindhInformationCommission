from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'notification_type', 'event_date', 'is_active', 'created_at')
    list_filter = ('notification_type', 'is_active', 'created_at')
    search_fields = ('title_en', 'title_ur', 'title_sd')
    fieldsets = (
        ('Content', {'fields': ('notification_type', 'title_en', 'title_ur', 'title_sd', 'description_en', 'description_ur', 'description_sd')}),
        ('Event Details', {'fields': ('event_date',)}),
        ('Attachments & Settings', {'fields': ('file', 'link', 'is_active')}),
    )