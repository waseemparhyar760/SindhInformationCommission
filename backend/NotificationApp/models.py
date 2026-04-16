from django.db import models

class Notification(models.Model):
    title_en = models.CharField("Title (English)", max_length=255)
    title_ur = models.CharField("Title (Urdu)", max_length=255, blank=True)
    title_sd = models.CharField("Title (Sindhi)", max_length=255, blank=True)
    
    description_en = models.TextField("Description (English)", blank=True)
    description_ur = models.TextField("Description (Urdu)", blank=True)
    description_sd = models.TextField("Description (Sindhi)", blank=True)
    
    file = models.FileField(upload_to='notifications/', blank=True, null=True, help_text="Optional PDF or Document")
    link = models.URLField(blank=True, null=True, help_text="Optional external link")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return self.title_en
