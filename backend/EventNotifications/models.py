from django.db import models

class Notification(models.Model):
    TYPE_CHOICES = [
        ('notification', 'Notification'),
        ('event', 'Event'),
    ]

    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ur = models.CharField(max_length=255, verbose_name="Title (Urdu)", blank=True, null=True)
    title_sd = models.CharField(max_length=255, verbose_name="Title (Sindhi)", blank=True, null=True)
    
    description_en = models.TextField(verbose_name="Description (English)", blank=True, null=True)
    description_ur = models.TextField(verbose_name="Description (Urdu)", blank=True, null=True)
    description_sd = models.TextField(verbose_name="Description (Sindhi)", blank=True, null=True)

    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='notification')
    event_date = models.DateTimeField(blank=True, null=True, help_text="Required for Events")
    
    file = models.FileField(upload_to='notifications/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title_en