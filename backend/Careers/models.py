from django.db import models

class Career(models.Model):
    title_en = models.CharField(max_length=255, verbose_name="Job Title (English)")
    title_ur = models.CharField(max_length=255, verbose_name="Job Title (Urdu)", blank=True, null=True)
    title_sd = models.CharField(max_length=255, verbose_name="Job Title (Sindhi)", blank=True, null=True)
    
    description_en = models.TextField(verbose_name="Description (English)", blank=True, null=True)
    description_ur = models.TextField(verbose_name="Description (Urdu)", blank=True, null=True)
    description_sd = models.TextField(verbose_name="Description (Sindhi)", blank=True, null=True)

    department = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    deadline = models.DateField(blank=True, null=True)
    
    file = models.FileField(upload_to='careers/', blank=True, null=True, verbose_name="Advertisement/Details PDF")
    link = models.URLField(blank=True, null=True, verbose_name="Apply Link")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title_en