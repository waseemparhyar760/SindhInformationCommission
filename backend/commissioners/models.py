from django.db import models

class Commissioner(models.Model):
    # English
    name_en = models.CharField(max_length=255, verbose_name="Name (English)", default="")
    title_en = models.CharField(max_length=255, verbose_name="Title (English)", default="")
    bio_en = models.TextField(verbose_name="Bio (English)", default="")
    education_en = models.CharField(max_length=255, verbose_name="Highest Education (English)", blank=True, null=True)

    # Urdu
    name_ur = models.CharField(max_length=255, verbose_name="Name (Urdu)", default="")
    title_ur = models.CharField(max_length=255, verbose_name="Title (Urdu)", default="")
    bio_ur = models.TextField(verbose_name="Bio (Urdu)", default="")
    education_ur = models.CharField(max_length=255, verbose_name="Highest Education (Urdu)", blank=True, null=True)

    # Sindhi
    name_sd = models.CharField(max_length=255, verbose_name="Name (Sindhi)", default="")
    title_sd = models.CharField(max_length=255, verbose_name="Title (Sindhi)", default="")
    bio_sd = models.TextField(verbose_name="Bio (Sindhi)", default="")
    education_sd = models.CharField(max_length=255, verbose_name="Highest Education (Sindhi)", blank=True, null=True)

    # Contact Info
    email = models.EmailField(blank=True, null=True, verbose_name="Email Address")
    contact_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="Contact Number")
    
    is_chief = models.BooleanField(default=False, verbose_name="Is Chief Commissioner?")
    image = models.ImageField(upload_to='commissioners/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_chief', 'created_at']

    def __str__(self):
        return self.name_en