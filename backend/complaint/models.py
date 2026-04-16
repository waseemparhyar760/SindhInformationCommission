from django.db import models
import datetime
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError

class Complaint(models.Model):
    # Personal Information
    full_name = models.CharField(max_length=255)
    cnic = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    postal_address = models.TextField(verbose_name="Postal Address")
    permanent_address = models.TextField(verbose_name="Permanent Address")

    # Department Information
    department = models.CharField(max_length=255)
    custom_department = models.CharField(max_length=255, blank=True, null=True)
    public_body_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Name of Public Body (e.g. BHU, School)")
    public_body_contact = models.CharField(max_length=100, blank=True, null=True, verbose_name="Public Body Contact Number")
    department_address = models.TextField(blank=True, null=True, verbose_name="Public Body Address")

    # PIO Details
    pio_name = models.CharField(max_length=255, blank=True, null=True)
    pio_designation = models.CharField(max_length=255, blank=True, null=True)
    pio_address = models.TextField(blank=True, null=True)

    # HOD Details
    hod_name = models.CharField(max_length=255, blank=True, null=True)
    hod_designation = models.CharField(max_length=255, blank=True, null=True)
    department_contact = models.CharField(max_length=100, blank=True, null=True, verbose_name="Department Contact Number")
    hod_address = models.TextField(blank=True, null=True, verbose_name="Department Address")

    # Date Logic Fields
    SUBMISSION_MODE_CHOICES = [
        ('COURIER', 'Courier Service'),
        ('BY_HAND', 'By Hand'),
    ]
    initial_request_date = models.DateField(null=True, blank=True, verbose_name="Date of Initial Application to PIO")
    request_submission_mode = models.CharField(max_length=20, choices=SUBMISSION_MODE_CHOICES, default='COURIER', verbose_name="Request Submission Mode")
    internal_review_date = models.DateField(null=True, blank=True, verbose_name="Date of Internal Review Application")
    review_submission_mode = models.CharField(max_length=20, choices=SUBMISSION_MODE_CHOICES, default='COURIER', verbose_name="Review Submission Mode")

    # Complaint Grounds
    subject = models.CharField(max_length=255)
    details = models.TextField()

    # Attachments
    cnic_front = models.ImageField(upload_to='complaints/cnic/', validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])], verbose_name="CNIC Front", blank=True, null=True)
    cnic_back = models.ImageField(upload_to='complaints/cnic/', validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])], verbose_name="CNIC Back", blank=True, null=True)
    application_file = models.FileField(upload_to='complaints/application/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png'])], verbose_name="First Application")
    application_ack_file = models.FileField(upload_to='complaints/application_ack/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png'])], verbose_name="Application Acknowledgement", blank=True, null=True)
    internal_review_file = models.FileField(upload_to='complaints/review/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png'])], verbose_name="Internal Review Application")
    internal_review_ack_file = models.FileField(upload_to='complaints/review_ack/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png'])], verbose_name="Internal Review Acknowledgement", blank=True, null=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Pending')

    # Admin Assigned Details
    complaint_number = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. 230")
    complaint_year = models.CharField(max_length=4, blank=True, null=True, help_text="e.g. 2026")
    is_approved = models.BooleanField(default=False, verbose_name="Administrative Approval", help_text="Approve to make this complaint trackable by the public.")
    
    sections_involved = models.CharField(max_length=255, blank=True, null=True, help_text="e.g. Section 6(3)")

    # Foreign Keys for Admin Selection
    department_fk = models.ForeignKey('publicBodies.Department', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Select Department")
    public_body_fk = models.ForeignKey('publicBodies.PublicBody', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Select Public Body")

    FILING_MODE_CHOICES = [
        ('PORTAL', 'Online Portal'),
        ('COURIER', 'Courier Service'),
        ('BY_HAND', 'By Hand'),
    ]
    filing_mode = models.CharField(max_length=20, choices=FILING_MODE_CHOICES, default='PORTAL', verbose_name="Complaint Filing Mode")

    def __str__(self):
        if self.complaint_number and self.complaint_year:
            return f"Complaint No. ({self.complaint_number}/{self.complaint_year}) - {self.subject}"
        return f"{self.subject} - {self.full_name} (Pending Allocation)"
    
    def save(self, *args, **kwargs):
        # Auto-fill from Foreign Keys if set (Admin Panel Logic)
        if self.department_fk:
            self.department = self.department_fk.name_en
            if not self.hod_name: self.hod_name = self.department_fk.hod_name_en
            if not self.hod_designation: self.hod_designation = self.department_fk.hod_designation_en
            if not self.department_contact: self.department_contact = self.department_fk.department_contact
            if not self.hod_address: self.hod_address = self.department_fk.hod_address_en
            
        if self.public_body_fk:
            self.public_body_name = self.public_body_fk.name_en
            if not self.public_body_contact: self.public_body_contact = self.public_body_fk.phone
            if not self.department_address: self.department_address = self.public_body_fk.address_en
            if not self.pio_name: self.pio_name = self.public_body_fk.pio_name_en
            if not self.pio_designation: self.pio_designation = self.public_body_fk.pio_designation_en
            
            # Ensure department matches public body if not set
            if not self.department_fk and self.public_body_fk.department:
                self.department_fk = self.public_body_fk.department
                self.department = self.public_body_fk.department.name_en
                
                # Fill HOD details from parent department if empty
                if not self.hod_name: self.hod_name = self.public_body_fk.department.hod_name_en
                if not self.hod_designation: self.hod_designation = self.public_body_fk.department.hod_designation_en
                if not self.department_contact: self.department_contact = self.public_body_fk.department.department_contact
                if not self.hod_address: self.hod_address = self.public_body_fk.department.hod_address_en

        # Auto-generate year if not set
        if not self.complaint_year:
            self.complaint_year = str(datetime.date.today().year)
            
        # Auto-generate complaint number if not set
        if not self.complaint_number:
            # Find the last complaint number for this year
            last_complaint = Complaint.objects.filter(complaint_year=self.complaint_year).order_by('-id').first()
            
            if last_complaint and last_complaint.complaint_number and last_complaint.complaint_number.isdigit():
                new_number = int(last_complaint.complaint_number) + 1
                self.complaint_number = str(new_number)
            else:
                # Start from 1 if no previous record or non-numeric previous number
                # You might want to check if '1' exists to be safe, but usually this is fine for new years
                self.complaint_number = "1"
                
        super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        
        # Validate Application Acknowledgement
        if self.request_submission_mode == 'COURIER' and not self.application_ack_file:
            raise ValidationError({'application_ack_file': "Application Acknowledgement is required when submission mode is Courier."})
            
        # Validate Internal Review Acknowledgement
        if self.review_submission_mode == 'COURIER' and not self.internal_review_ack_file:
            raise ValidationError({'internal_review_ack_file': "Internal Review Acknowledgement is required when submission mode is Courier."})
            
class Hearing(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='hearings')
    hearing_date = models.DateField(verbose_name="Hearing Date", null=True, blank=True)
    hearing_time = models.TimeField(verbose_name="Hearing Time", null=True, blank=True)
    
    # Attendees
    complainant_name = models.CharField(max_length=255, blank=True, help_text="Override if different from Complaint")
    respondent_name = models.CharField(max_length=255, blank=True, help_text="Official appearing for the department")
    complainant_is_present = models.BooleanField(default=True, verbose_name="Complainant Present")
    respondent_is_present = models.BooleanField(default=True, verbose_name="Respondent Present")
    
    created_at = models.DateTimeField(auto_now_add=True)
    bench_members = models.CharField(max_length=255, blank=True, null=True, help_text="Commissioners hearing the case")
    serial_number = models.CharField(max_length=50, blank=True, null=True, help_text="Serial number from Cause List")

    PROCEDURAL_STATUS_CHOICES = [
        ('FIRST_NOTICE', 'First Notice'),
        ('FINAL_NOTICE', 'Final Notice'),
        ('SHOW_CAUSE', 'Show Cause Notice'),
        ('FINAL_SHOW_CAUSE', 'Final Show Cause Notice'),
        ('TEN_DAYS_ORDER', 'Ten Days Order'),
        ('PENALTY_ORDER', 'Penalty Order'),
        ('ADJOURNMENT', 'Adjournment Order'),
        ('RECALL', 'Recall Order'),
        ('FURTHER_PROCEEDINGS', 'Further Proceedings'),
        ('DISPOSED_OFF', 'Disposed-off'),
        ('NON_MAINTAINABLE', 'Complaint Non-Maintainable'),
    ]
    procedural_status = models.CharField(max_length=100, choices=PROCEDURAL_STATUS_CHOICES, blank=True, null=True, verbose_name="Proceedings Status")

    DISPOSAL_REASON_CHOICES = [
        ('INFO_PROVIDED', 'Information/Record Provided'),
        ('NON_MAINTAINABLE', 'Complaint Non-Maintainable'),
        ('OTHER', 'Other'),
    ]
    disposal_reason = models.CharField(max_length=50, choices=DISPOSAL_REASON_CHOICES, blank=True, null=True, verbose_name="Reason for Disposal")

    # Status Specific Attachments
    info_provided_file = models.FileField(upload_to='complaints/status/info/', blank=True, null=True, verbose_name="Information Provided Order")
    first_notice_file = models.FileField(upload_to='complaints/status/notice1/', blank=True, null=True, verbose_name="First Notice")
    final_notice_file = models.FileField(upload_to='complaints/status/notice2/', blank=True, null=True, verbose_name="Final Notice")
    show_cause_file = models.FileField(upload_to='complaints/status/show_cause/', blank=True, null=True, verbose_name="Show Cause Notice")
    final_show_cause_file = models.FileField(upload_to='complaints/status/final_show_cause/', blank=True, null=True, verbose_name="Final Show Cause Notice")
    ten_days_order_file = models.FileField(upload_to='complaints/status/ten_days/', blank=True, null=True, verbose_name="Ten Days Order")
    penalty_order_file = models.FileField(upload_to='complaints/status/penalty/', blank=True, null=True, verbose_name="Penalty Order")
    adjournment_file = models.FileField(upload_to='complaints/status/adjournment/', blank=True, null=True, verbose_name="Adjournment Order")
    recall_file = models.FileField(upload_to='complaints/status/recall/', blank=True, null=True, verbose_name="Recall Order")
    further_proceedings_file = models.FileField(upload_to='complaints/status/further/', blank=True, null=True, verbose_name="Further Proceedings Order")
    disposed_off_file = models.FileField(upload_to='complaints/status/disposed/', blank=True, null=True, verbose_name="Disposal Order")
    non_maintainable_file = models.FileField(upload_to='complaints/status/non_maintainable/', blank=True, null=True, verbose_name="Non-Maintainable Order")

    class Meta:
        ordering = ['-hearing_date', '-hearing_time']

    def __str__(self):
        return f"Hearing: {self.complaint.subject} on {self.hearing_date}"
    
    def save(self, *args, **kwargs):
        if not self.complainant_name and self.complaint:
            self.complainant_name = self.complaint.full_name
        if not self.respondent_name and self.complaint:
            # Default to PIO name or Department
            self.respondent_name = self.complaint.pio_name or self.complaint.department
        super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        
        # Validate Disposal Reason
        if self.procedural_status == 'DISPOSED_OFF' and not self.disposal_reason:
            raise ValidationError({'disposal_reason': "Please specify the reason for disposal."})

        # Validate Procedural Status Files
        status_file_map = {
            'FIRST_NOTICE': 'first_notice_file',
            'FINAL_NOTICE': 'final_notice_file',
            'SHOW_CAUSE': 'show_cause_file',
            'FINAL_SHOW_CAUSE': 'final_show_cause_file',
            'TEN_DAYS_ORDER': 'ten_days_order_file',
            'PENALTY_ORDER': 'penalty_order_file',
            'ADJOURNMENT': 'adjournment_file',
            'RECALL': 'recall_file',
            'FURTHER_PROCEEDINGS': 'further_proceedings_file',
            'DISPOSED_OFF': 'disposed_off_file',
            'NON_MAINTAINABLE': 'non_maintainable_file',
        }
        
        if self.procedural_status in status_file_map:
            field_name = status_file_map[self.procedural_status]
            if not getattr(self, field_name):
                # Get verbose name for error message
                field_object = self._meta.get_field(field_name)
                raise ValidationError({
                    field_name: f"{field_object.verbose_name} is required when status is {self.get_procedural_status_display()}."
                })

        # Prevent modification of date/time for past hearings
        if self.pk:
            original = self.__class__.objects.get(pk=self.pk)
            if original.hearing_date and original.hearing_date < datetime.date.today():
                if self.hearing_date != original.hearing_date:
                    raise ValidationError({'hearing_date': "Cannot change the date of a past hearing."})
                if self.hearing_time != original.hearing_time:
                    raise ValidationError({'hearing_time': "Cannot change the time of a past hearing."})

class NewComplaint(Complaint):
    class Meta:
        proxy = True
        verbose_name = "Complaint Box"
        verbose_name_plural = "Complaint Box"