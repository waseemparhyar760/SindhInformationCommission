from django.db import models

class Department(models.Model):
    name_en = models.CharField(max_length=255, verbose_name="Department Name (English)")
    name_ur = models.CharField(max_length=255, verbose_name="Department Name (Urdu)", blank=True, null=True)
    name_sd = models.CharField(max_length=255, verbose_name="Department Name (Sindhi)", blank=True, null=True)
    
    # Head of Department (HOD) Details - Now attached to Department
    hod_name_en = models.CharField(max_length=255, verbose_name="HOD Name (English)", blank=True, null=True)
    hod_name_ur = models.CharField(max_length=255, verbose_name="HOD Name (Urdu)", blank=True, null=True)
    hod_name_sd = models.CharField(max_length=255, verbose_name="HOD Name (Sindhi)", blank=True, null=True)
    hod_designation_en = models.CharField(max_length=255, verbose_name="HOD Designation (English)", blank=True, null=True)
    hod_designation_ur = models.CharField(max_length=255, verbose_name="HOD Designation (Urdu)", blank=True, null=True)
    hod_designation_sd = models.CharField(max_length=255, verbose_name="HOD Designation (Sindhi)", blank=True, null=True)
    hod_contact = models.CharField(max_length=100, verbose_name="HOD Contact Number", blank=True, null=True)
    hod_email = models.EmailField(verbose_name="HOD Email Address", blank=True, null=True)
    department_contact = models.CharField(max_length=100, verbose_name="Department Contact Number", blank=True, null=True)
    hod_address_en = models.TextField(verbose_name="HOD Address (English)", blank=True, null=True)
    hod_address_ur = models.TextField(verbose_name="HOD Address (Urdu)", blank=True, null=True)
    hod_address_sd = models.TextField(verbose_name="HOD Address (Sindhi)", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        ordering = ['name_en']

    def __str__(self):
        return self.name_en

class PublicBody(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='public_bodies', verbose_name="Parent Department")
    # Public Body Details
    name_en = models.CharField(max_length=255, verbose_name="Public Body Name (English)")
    name_ur = models.CharField(max_length=255, verbose_name="Name (Urdu)", blank=True, null=True)
    name_sd = models.CharField(max_length=255, verbose_name="Name (Sindhi)", blank=True, null=True)
    address_en = models.TextField(verbose_name="Address (English)", blank=True, null=True)
    address_ur = models.TextField(verbose_name="Address (Urdu)", blank=True, null=True)
    address_sd = models.TextField(verbose_name="Address (Sindhi)", blank=True, null=True)
    website = models.URLField(verbose_name="Website URL", blank=True, null=True)
    email = models.EmailField(verbose_name="Email Address", blank=True, null=True)
    phone = models.CharField(max_length=100, verbose_name="Phone Number", blank=True, null=True)

    # Designated Officer (PIO) Details
    pio_name_en = models.CharField(max_length=255, verbose_name="PIO Name (English)", blank=True, null=True)
    pio_name_ur = models.CharField(max_length=255, verbose_name="PIO Name (Urdu)", blank=True, null=True)
    pio_name_sd = models.CharField(max_length=255, verbose_name="PIO Name (Sindhi)", blank=True, null=True)
    pio_designation_en = models.CharField(max_length=255, verbose_name="PIO Designation (English)", blank=True, null=True)
    pio_designation_ur = models.CharField(max_length=255, verbose_name="PIO Designation (Urdu)", blank=True, null=True)
    pio_designation_sd = models.CharField(max_length=255, verbose_name="PIO Designation (Sindhi)", blank=True, null=True)
    pio_contact = models.CharField(max_length=100, verbose_name="PIO Contact Number", blank=True, null=True)
    pio_email = models.EmailField(verbose_name="PIO Email Address", blank=True, null=True)
    pio_address_en = models.TextField(verbose_name="PIO Address (English)", blank=True, null=True)
    pio_address_ur = models.TextField(verbose_name="PIO Address (Urdu)", blank=True, null=True)
    pio_address_sd = models.TextField(verbose_name="PIO Address (Sindhi)", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Public Body"
        verbose_name_plural = "Public Bodies"
        ordering = ['name_en']

    def __str__(self):
        return self.name_en