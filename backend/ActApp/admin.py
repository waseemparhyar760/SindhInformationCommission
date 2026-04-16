from django.contrib import admin
from .models import Act

@admin.register(Act)
class ActAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'updated_at')
    list_filter = ('is_active',)