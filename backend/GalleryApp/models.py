from django.db import models

class Event(models.Model):
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ur = models.CharField(max_length=255, blank=True, null=True, verbose_name="Title (Urdu)")
    title_sd = models.CharField(max_length=255, blank=True, null=True, verbose_name="Title (Sindhi)")
    slug = models.SlugField(unique=True, max_length=255)
    content_en = models.TextField(verbose_name="Content (English)")
    content_ur = models.TextField(blank=True, null=True, verbose_name="Content (Urdu)")
    content_sd = models.TextField(blank=True, null=True, verbose_name="Content (Sindhi)")
    social_media_link = models.URLField(blank=True, null=True, verbose_name="Social Media Link")
    event_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-event_date']

    def __str__(self):
        return self.title_en

class EventImage(models.Model):
    event = models.ForeignKey(Event, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='events/gallery/')
    
    def __str__(self):
        return f"Image for {self.event.title_en}"