from django.contrib import admin
from .models import Organogram

@admin.register(Organogram)
class OrganogramAdmin(admin.ModelAdmin):
    """
    Admin interface for the Organogram model.
    """
    list_display = ('title_en', 'is_active', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('title_en', 'title_ur', 'title_sd')
    readonly_fields = ('updated_at',)
    fieldsets = (
        (None, {
            'fields': (('title_en', 'title_ur', 'title_sd'), 'image', 'is_active')
        }),
        ('Metadata', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )