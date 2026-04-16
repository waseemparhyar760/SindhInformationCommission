from django.db import models
from django.core.exceptions import ValidationError

class WebsiteLogo(models.Model):
    """
    Model to store the website logo.
    Ensures that only one logo can be active at any given time.
    """
    name = models.CharField(max_length=100, default="Main Website Logo")
    logo_image = models.ImageField(
        upload_to='website_settings/logos/',
        help_text="Upload the website logo. Recommended size: 200x50 pixels."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Set this as the currently active logo for the website. Only one can be active."
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.is_active:
            WebsiteLogo.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Website Logo"
        verbose_name_plural = "Website Logos"