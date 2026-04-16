from django.contrib import admin
from .models import WebsiteLogo
from django.utils.html import format_html

@admin.register(WebsiteLogo)
class WebsiteLogoAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'logo_preview', 'uploaded_at')
    list_filter = ('is_active',)
    search_fields = ('name',)
    readonly_fields = ('logo_preview', 'uploaded_at')

    fieldsets = (
        (None, {
            'fields': ('name', 'logo_image', 'is_active')
        }),
        ('Preview', {
            'fields': ('logo_preview',)
        }),
        ('Metadata', {
            'fields': ('uploaded_at',),
            'classes': ('collapse',)
        }),
    )

    def logo_preview(self, obj):
        if obj.logo_image:
            return format_html('<img src="{}" style="max-height: 50px; background: #f0f0f0; padding: 5px; border-radius: 5px;" />', obj.logo_image.url)
        return "No Image"
    logo_preview.short_description = 'Logo Preview'