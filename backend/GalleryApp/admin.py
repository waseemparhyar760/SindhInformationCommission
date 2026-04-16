from django.contrib import admin
from .models import Event, EventImage

class EventImageInline(admin.TabularInline):
    model = EventImage
    extra = 1

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'event_date', 'created_at')
    search_fields = ('title_en', 'title_ur', 'title_sd')
    prepopulated_fields = {'slug': ('title_en',)}
    inlines = [EventImageInline]
    list_filter = ('event_date',)
