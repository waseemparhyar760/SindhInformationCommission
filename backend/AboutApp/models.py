from django.db import models

class Organogram(models.Model):
    """
    Model to store the official organogram of the Sindh Information Commission.
    The save method ensures only one organogram is marked as active.
    """
    title_en = models.CharField("Title (English)", max_length=255, default="Organogram of Sindh Information Commission")
    title_ur = models.CharField("Title (Urdu)", max_length=255, blank=True)
    title_sd = models.CharField("Title (Sindhi)", max_length=255, blank=True)
    image = models.ImageField(
        upload_to='about/organogram/', 
        help_text="Upload the organogram image (e.g., PNG, JPG)."
    )
    is_active = models.BooleanField(
        default=True, 
        help_text="Only one organogram can be active at a time. Activating a new one will deactivate others."
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title_en

    def save(self, *args, **kwargs):
        if self.is_active:
            # Set all other organograms to inactive
            Organogram.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Organogram"
        verbose_name_plural = "Organogram"