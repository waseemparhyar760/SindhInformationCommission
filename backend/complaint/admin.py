from django.contrib import admin
from django.contrib import messages
import datetime
from django import forms
from django.utils.html import format_html
from .models import Complaint, Hearing, NewComplaint
from publicBodies.models import PublicBody, Department

class BaseHearingInlineFormSet(forms.models.BaseInlineFormSet):
    def clean(self):
        super().clean()
        for form in self.forms:
            if not form.cleaned_data or form.cleaned_data.get('DELETE'):
                continue

            status = form.cleaned_data.get('procedural_status')
            hearing_date = form.cleaned_data.get('hearing_date')

            # These statuses don't require a next hearing date
            final_statuses = ['DISPOSED_OFF', 'NON_MAINTAINABLE']

            if status and status not in final_statuses and not hearing_date:
                form.add_error('hearing_date', 'A hearing date is required unless the status is "Disposed-off" or "Non-Maintainable".')

class HearingInline(admin.StackedInline):
    model = Hearing
    extra = 0
    formset = BaseHearingInlineFormSet
    readonly_fields = ('hearing_ordinal', 'serial_number')
    fields = (
        'hearing_ordinal',
        ('hearing_date', 'hearing_time'), 
        ('complainant_name', 'complainant_is_present'), 
        ('respondent_name', 'respondent_is_present'), 
        'serial_number',
        'bench_members',
        'procedural_status',
        'disposal_reason',
        'first_notice_file',
        'final_notice_file',
        'show_cause_file',
        'final_show_cause_file',
        'ten_days_order_file',
        'penalty_order_file',
        'adjournment_file',
        'recall_file',
        'further_proceedings_file',
        'disposed_off_file',
        'non_maintainable_file',
    )

    def hearing_ordinal(self, obj):
        if not obj or not obj.id:
            return "New Hearing"
        
        # Get all hearings for this complaint ordered by date/time
        hearings = list(obj.complaint.hearings.order_by('hearing_date', 'hearing_time').values_list('id', flat=True))
        if obj.id in hearings:
            count = hearings.index(obj.id) + 1
            suffix = 'th' if 11 <= count <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(count % 10, 'th')
            return f"{count}{suffix} Hearing"
        return "Unknown"
    hearing_ordinal.short_description = "Hearing Sequence"

class ScheduledHearingFilter(admin.SimpleListFilter):
    title = 'Hearing Schedule'
    parameter_name = 'hearing_schedule'

    def lookups(self, request, model_admin):
        return (
            ('scheduled', 'Has Next Hearing Date'),
            ('no_schedule', 'No Hearing Scheduled'),
        )

    def queryset(self, request, queryset):
        today = datetime.date.today()
        if self.value() == 'scheduled':
            return queryset.filter(hearings__hearing_date__gte=today).distinct()
        if self.value() == 'no_schedule':
            return queryset.exclude(hearings__hearing_date__gte=today)

class ApprovedPeriodFilter(admin.SimpleListFilter):
    title = 'Approved Complaints (By Filing Date)'
    parameter_name = 'approved_period'

    def lookups(self, request, model_admin):
        return (
            ('this_week', 'This Week'),
            ('this_month', 'This Month'),
            ('this_year', 'This Year'),
        )

    def queryset(self, request, queryset):
        today = datetime.date.today()
        if self.value() == 'this_week':
            start_week = today - datetime.timedelta(days=today.weekday())
            return queryset.filter(is_approved=True, created_at__date__gte=start_week)
        if self.value() == 'this_month':
            return queryset.filter(is_approved=True, created_at__year=today.year, created_at__month=today.month)
        if self.value() == 'this_year':
            return queryset.filter(is_approved=True, created_at__year=today.year)

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('complaint_number', 'complaint_year', 'subject', 'full_name', 'department', 'filing_mode', 'is_approved', 'status', 'next_hearing_date', 'created_at')
    list_filter = (ScheduledHearingFilter, ApprovedPeriodFilter, 'hearings__procedural_status', 'department', 'full_name', 'filing_mode', 'is_approved', 'status', 'created_at', 'complaint_year')
    date_hierarchy = 'created_at'
    search_fields = ('subject', 'full_name', 'cnic', 'custom_department', 'complaint_number')
    inlines = [HearingInline]
    actions = ['add_to_public_bodies', 'approve_complaints']
    readonly_fields = (
        'cnic_front_preview', 'cnic_back_preview', 'application_file_preview', 'application_ack_file_preview', 'internal_review_file_preview', 'internal_review_ack_file_preview', 'hearing_summary'
    )
    autocomplete_fields = ['department_fk', 'public_body_fk']
    
    fieldsets = (
        ('Official Allocation', {
            'fields': ('complaint_number', 'complaint_year', 'filing_mode', 'is_approved', 'status', 'sections_involved'),
        }),
        ('Complainant Details', {
            'fields': ('full_name', 'cnic', 'cnic_front', 'cnic_front_preview', 'cnic_back', 'cnic_back_preview', 'email', 'phone', 'postal_address', 'permanent_address'),
            'classes': ('collapse',),
        }),
        ('Complaint Details', {
            'fields': ('department_fk', 'public_body_fk', ('initial_request_date', 'request_submission_mode'), ('internal_review_date', 'review_submission_mode'), 'subject', 'details'),
            'classes': ('collapse',),
        }),
        ('Official Details (PIO/HOD)', {
            'fields': (('pio_name', 'pio_designation'), 'public_body_contact', 'department_address', ('hod_name', 'hod_designation'), ('department_contact', 'hod_address')),
            'classes': ('collapse',)
        }),
        ('Attachments', {
            'fields': (
                'application_file', 'application_file_preview',
                'application_ack_file', 'application_ack_file_preview',
                'internal_review_file', 'internal_review_file_preview',
                'internal_review_ack_file', 'internal_review_ack_file_preview'
            ),
            'classes': ('collapse',),
        }),
        ('Hearings Overview', {
            'fields': ('hearing_summary',),
            'classes': ('collapse',),
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).distinct()

    def get_readonly_fields(self, request, obj=None):
        readonly_fields = list(super().get_readonly_fields(request, obj))
        if obj:
            if obj.request_submission_mode == 'BY_HAND':
                readonly_fields.append('application_ack_file')
            if obj.review_submission_mode == 'BY_HAND':
                readonly_fields.append('internal_review_ack_file')
        return readonly_fields

    def _create_preview(self, file_field):
        if file_field:
            file_url = file_field.url
            if file_url.lower().endswith(('.jpg', '.jpeg', '.png')):
                return format_html(
                    '<a href="{0}" target="_blank"><img src="{0}" style="max-width:100%; max-height:500px; border:1px solid #ccc;" /></a>',
                    file_url
                )
            
            return format_html(
                '<a href="{0}" target="_blank" style="display:block; margin-bottom:10px; font-weight:bold;">Click to Open File</a>'
                '<iframe src="{0}" width="100%" height="500px" style="border:1px solid #ccc;"></iframe>',
                file_url
            )
        return "No file uploaded"

    def cnic_front_preview(self, obj):
        return self._create_preview(obj.cnic_front)
    cnic_front_preview.short_description = "CNIC Front Preview"

    def cnic_back_preview(self, obj):
        return self._create_preview(obj.cnic_back)
    cnic_back_preview.short_description = "CNIC Back Preview"

    def application_file_preview(self, obj):
        return self._create_preview(obj.application_file)
    application_file_preview.short_description = "First Application Preview"

    def application_ack_file_preview(self, obj):
        return self._create_preview(obj.application_ack_file)
    application_ack_file_preview.short_description = "Application Acknowledgement Preview"

    def internal_review_file_preview(self, obj):
        return self._create_preview(obj.internal_review_file)
    internal_review_file_preview.short_description = "Internal Review Preview"

    def internal_review_ack_file_preview(self, obj):
        return self._create_preview(obj.internal_review_ack_file)
    internal_review_ack_file_preview.short_description = "Internal Review Acknowledgement Preview"

    def add_to_public_bodies(self, request, queryset):
        created_count = 0
        existing_count = 0
        
        for complaint in queryset:
            # Only proceed if the user entered a custom department name
            if complaint.custom_department:
                # 1. Handle Department (Parent) - Holds HOD Details
                department, dept_created = Department.objects.get_or_create(
                    name_en=complaint.custom_department,
                    defaults={
                        'hod_name_en': complaint.hod_name,
                        'hod_designation_en': complaint.hod_designation,
                        'hod_address_en': complaint.hod_address,
                    }
                )

                # 2. Handle Public Body (Child) - Holds PIO Details
                # We assume the Public Body name is the same as the Department for custom entries,
                # or you could append "Secretariat" etc.
                if not PublicBody.objects.filter(name_en=complaint.custom_department, department=department).exists():
                    PublicBody.objects.create(
                        department=department, # Link to the parent department
                        name_en=complaint.custom_department,
                        address_en=complaint.department_address,
                        
                        # Map PIO Details (English fields)
                        pio_name_en=complaint.pio_name,
                        pio_designation_en=complaint.pio_designation,
                        pio_address_en=complaint.pio_address,
                    )
                    created_count += 1
                else:
                    existing_count += 1
        
        # User Feedback Messages
        if created_count > 0:
            self.message_user(request, f"Successfully added {created_count} new Public Bodies to the list.", messages.SUCCESS)
        
        if existing_count > 0:
            self.message_user(request, f"{existing_count} departments were skipped because they already exist.", messages.WARNING)
            
        if created_count == 0 and existing_count == 0:
            self.message_user(request, "No custom departments found in the selected complaints.", messages.INFO)

    add_to_public_bodies.short_description = "Add Custom Department to Public Bodies List"

    def approve_complaints(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} complaints have been approved and are now trackable.", messages.SUCCESS)
    approve_complaints.short_description = "Approve selected complaints for public tracking"

    def next_hearing_date(self, obj):
        today = datetime.date.today()
        hearing = obj.hearings.filter(hearing_date__gte=today).order_by('hearing_date').first()
        return hearing.hearing_date if hearing else None
    next_hearing_date.short_description = 'Next Hearing'
    next_hearing_date.admin_order_field = 'hearings__hearing_date'

    def hearing_summary(self, obj):
        if not obj:
            return "N/A"
        total = obj.hearings.count()
        today = datetime.date.today()
        past = obj.hearings.filter(hearing_date__lt=today).count()
        upcoming = obj.hearings.filter(hearing_date__gte=today).count()
        return format_html(
            '<strong>Total Hearings:</strong> {} &nbsp;&nbsp; '
            '(<span style="color: green;">Upcoming: {}</span>, <span style="color: gray;">Concluded: {}</span>)',
            total, upcoming, past
        )
    hearing_summary.short_description = "Hearings Statistics"

    class Media:
        js = ('complaint/js/admin_toggle.js',)

@admin.register(NewComplaint)
class NewComplaintAdmin(ComplaintAdmin):
    ordering = ('-created_at',)

    # Override the queryset to show only unapproved complaints
    def get_queryset(self, request):
        return super().get_queryset(request).filter(is_approved=False)

    # Customize the list display for this view by removing the 'is_approved' column
    def get_list_display(self, request):
        list_display = list(super().get_list_display(request))
        if 'is_approved' in list_display:
            list_display.remove('is_approved')
        return tuple(list_display)

    # Customize list filters to remove irrelevant ones
    def get_list_filter(self, request):
        list_filter = list(super().get_list_filter(request))
        # Remove filters that are not relevant for unapproved complaints
        for f in ['is_approved', ApprovedPeriodFilter, ScheduledHearingFilter]:
            if f in list_filter:
                list_filter.remove(f)
        return tuple(list_filter)
