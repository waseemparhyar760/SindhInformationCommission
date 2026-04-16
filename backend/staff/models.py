from django.db import models

class StaffMember(models.Model):
    # English
    name_en = models.CharField(max_length=255, verbose_name="Name (English)")
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    department_en = models.CharField(max_length=255, verbose_name="Department (English)")
    bio_en = models.TextField(verbose_name="Bio (English)")
    education_en = models.TextField(verbose_name="Education (English)")
    experience_en = models.TextField(verbose_name="Experience (English)")

    # Urdu
    name_ur = models.CharField(max_length=255, verbose_name="Name (Urdu)", blank=True, null=True)
    title_ur = models.CharField(max_length=255, verbose_name="Title (Urdu)", blank=True, null=True)
    department_ur = models.CharField(max_length=255, verbose_name="Department (Urdu)", blank=True, null=True)
    bio_ur = models.TextField(verbose_name="Bio (Urdu)", blank=True, null=True)
    education_ur = models.TextField(verbose_name="Education (Urdu)", blank=True, null=True)
    experience_ur = models.TextField(verbose_name="Experience (Urdu)", blank=True, null=True)

    # Sindhi
    name_sd = models.CharField(max_length=255, verbose_name="Name (Sindhi)", blank=True, null=True)
    title_sd = models.CharField(max_length=255, verbose_name="Title (Sindhi)", blank=True, null=True)
    department_sd = models.CharField(max_length=255, verbose_name="Department (Sindhi)", blank=True, null=True)
    bio_sd = models.TextField(verbose_name="Bio (Sindhi)", blank=True, null=True)
    education_sd = models.TextField(verbose_name="Education (Sindhi)", blank=True, null=True)
    experience_sd = models.TextField(verbose_name="Experience (Sindhi)", blank=True, null=True)

    # Common
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    image = models.ImageField(upload_to='staff/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0, help_text="Order in which staff appears")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = "Staff Member"

    def __str__(self):
        return self.name_en