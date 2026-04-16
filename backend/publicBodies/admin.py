from django.contrib import admin
from .models import PublicBody, Department
from complaint.models import Complaint

class PublicBodyInline(admin.TabularInline):
    model = PublicBody
    extra = 0
    fields = ('name_en', 'phone', 'email', 'website')
    show_change_link = True

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'hod_name_en', 'hod_contact')
    search_fields = ('name_en', 'hod_name_en')
    fieldsets = (
        ('Department Details', {
            'fields': ('name_en', 'name_ur', 'name_sd')
        }),
        ('Head of Department (HOD)', {
            'fields': (
                'hod_name_en', 'hod_designation_en',
                'hod_name_ur', 'hod_designation_ur',
                'hod_name_sd', 'hod_designation_sd',
                'hod_contact',
                'department_contact',
                'hod_email',
                'hod_address_en',
                'hod_address_ur',
                'hod_address_sd',
            )
        })
    )
    inlines = [PublicBodyInline]
    
    class Media:
        js = ('complaint/js/admin_toggle.js',)

@admin.register(PublicBody)
class PublicBodyAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'department', 'pio_name_en', 'complaint_count')
    search_fields = ('name_en', 'name_ur', 'name_sd', 'pio_name_en', 'department__name_en', 'department__hod_name_en')
    list_filter = ('department',)
    
    fieldsets = (
        ('Department', {
            'fields': ('department',)
        }),
        ('Public Body Details', {
            'fields': (
                'name_en', 'address_en',
                'name_ur', 'address_ur',
                'name_sd', 'address_sd',
                'website', 'email', 'phone',
            )
        }),
        ('Designated Officer (PIO) Details', {
            'classes': ('collapse',),
            'fields': (
                'pio_name_en', 'pio_designation_en',
                'pio_name_ur', 'pio_designation_ur',
                'pio_name_sd', 'pio_designation_sd',
                'pio_contact',
                'pio_email',
                'pio_address_en',
                'pio_address_ur',
                'pio_address_sd',
            )
        }),
    )

    def complaint_count(self, obj):
        return Complaint.objects.filter(department=obj.name_en).count()
    complaint_count.short_description = 'Total Complaints'

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)
        
        # Filter by department if passed in query params (e.g. from a custom widget or manual url)
        department_id = request.GET.get('department_id')
        if department_id:
            queryset = queryset.filter(department_id=department_id)
            
        return queryset, use_distinct

    class Media:
        js = ('complaint/js/admin_toggle.js',)