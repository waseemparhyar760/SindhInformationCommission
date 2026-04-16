from django.contrib import admin
from .models import CauseList, CauseListHearing
from complaint.models import Hearing
import datetime
from django.db.models import Count

class CauseListHearingInline(admin.TabularInline):
    model = CauseListHearing
    extra = 1
    ordering = ('order',)
    fields = ('hearing', 'serial_number', 'order')
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "hearing":
            # Get ID of current CauseList being edited to exclude it from the "already assigned" check
            object_id = request.resolver_match.kwargs.get('object_id')
            
            # Get IDs of hearings on OTHER approved cause lists
            query = CauseList.objects.filter(is_approved=True)
            if object_id:
                query = query.exclude(id=object_id)
            
            assigned_hearing_ids = query.values_list('hearings__id', flat=True)
            
            # Limit choices to upcoming hearings not assigned to other approved lists
            kwargs["queryset"] = Hearing.objects.filter(
                hearing_date__gte=datetime.date.today()
            ).exclude(
                id__in=assigned_hearing_ids
            ).select_related('complaint').order_by('hearing_date', 'hearing_time')
            
            field = super().formfield_for_foreignkey(db_field, request, **kwargs)
            field.label_from_instance = lambda obj: f"{obj.complaint.complaint_number}/{obj.complaint.complaint_year} ({obj.complainant_name}/{obj.respondent_name}) {obj.hearing_date}"
            return field

        return super().formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(CauseList)
class CauseListAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'date', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'date',)
    search_fields = ('title_en', 'title_ur', 'title_sd')
    ordering = ('-date',)
    inlines = [CauseListHearingInline]
    exclude = ('hearings',)
    actions = ['approve_cause_lists']
    change_list_template = "admin/causelist_changelist.html"

    def approve_cause_lists(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} cause lists have been approved and are now visible on the frontend.")
    approve_cause_lists.short_description = "Approve selected cause lists"

    def changelist_view(self, request, extra_context=None):
        today = datetime.date.today()
        assigned_hearing_ids = CauseList.objects.filter(is_approved=True).values_list('hearings__id', flat=True)
        
        unassigned_hearings_by_date = Hearing.objects.filter(
            hearing_date__gte=today
        ).exclude(
            id__in=assigned_hearing_ids
        ).values('hearing_date').annotate(
            hearing_count=Count('id')
        ).order_by('hearing_date')

        extra_context = extra_context or {}
        extra_context['unassigned_hearings_by_date'] = unassigned_hearings_by_date
        
        return super().changelist_view(request, extra_context=extra_context)

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        if 'date' in request.GET:
            try:
                date_str = request.GET['date']
                hearing_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                initial['date'] = hearing_date
                initial['title_en'] = f"Cause List for {hearing_date.strftime('%d %B, %Y')}"
            except (ValueError, KeyError):
                pass
        return initial

    def get_formsets_with_inlines(self, request, obj=None):
        for formset, inline in super().get_formsets_with_inlines(request, obj):
            if request.method == 'GET' and 'date' in request.GET and obj is None:
                try:
                    date_str = request.GET['date']
                    hearing_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                    assigned_hearing_ids = CauseList.objects.filter(is_approved=True).exclude(date=hearing_date).values_list('hearings__id', flat=True)
                    hearings_for_date = Hearing.objects.filter(hearing_date=hearing_date).exclude(id__in=assigned_hearing_ids).order_by('hearing_time')
                    
                    initial_data = [{'hearing': h.pk, 'order': i + 1} for i, h in enumerate(hearings_for_date)]
                    
                    class InitialFormSet(formset):
                        def __init__(self, *args, **kwargs):
                            kwargs['initial'] = initial_data
                            super().__init__(*args, **kwargs)
                    
                    formset = InitialFormSet
                    formset.extra = len(initial_data) if initial_data else 1
                except (ValueError, KeyError):
                    pass
            yield formset, inline

    def save_formset(self, request, form, formset, change):
        if formset.model == CauseListHearing:
            instances = formset.save(commit=False)
            for instance in instances:
                instance.serial_number = str(instance.order)
                instance.save()
                
                # Sync to Hearing model
                hearing = instance.hearing
                hearing.serial_number = instance.serial_number
                hearing.save(update_fields=['serial_number'])
                
            for obj in formset.deleted_objects:
                hearing = obj.hearing
                hearing.serial_number = None
                hearing.save(update_fields=['serial_number'])
                obj.delete()
            formset.save_m2m()
        else:
            super().save_formset(request, form, formset, change)
