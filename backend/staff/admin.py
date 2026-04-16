from django.contrib import admin
from .models import StaffMember

@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'title_en', 'department_en', 'order')
    list_editable = ('order',)
    search_fields = ('name_en', 'title_en')
    fieldsets = (
        ('English', {
            'fields': ('name_en', 'title_en', 'department_en', 'bio_en', 'education_en', 'experience_en')
        }),
        ('Urdu', {
            'classes': ('collapse',),
            'fields': ('name_ur', 'title_ur', 'department_ur', 'bio_ur', 'education_ur', 'experience_ur')
        }),
        ('Sindhi', {
            'classes': ('collapse',),
            'fields': ('name_sd', 'title_sd', 'department_sd', 'bio_sd', 'education_sd', 'experience_sd')
        }),
        ('General', {
            'fields': ('email', 'phone', 'image', 'order')
        }),
    )