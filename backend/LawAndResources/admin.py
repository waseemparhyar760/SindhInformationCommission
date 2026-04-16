from django.contrib import admin
from .models import ResourceDocument

@admin.register(ResourceDocument)
class ResourceDocumentAdmin(admin.ModelAdmin):
    list_display = ('resource_type', 'title', 'updated_at')
    list_filter = ('resource_type',)
    fieldsets = (
        ('Document Info', {'fields': ('resource_type', 'title')}),
        ('Files', {'fields': ('file_en', 'file_ur', 'file_sd')}),
    )