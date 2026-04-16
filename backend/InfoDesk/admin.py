from django.contrib import admin
from .models import InfoDeskDocument

@admin.register(InfoDeskDocument)
class InfoDeskDocumentAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'category', 'publication_date')
    list_filter = ('category', 'publication_date')
    search_fields = ('title_en', 'title_ur', 'title_sd')
    fieldsets = (
        ('Document Details', {'fields': ('category', 'title_en', 'title_ur', 'title_sd', 'description')}),
        ('Attachment', {'fields': ('file', 'link')}),
    )