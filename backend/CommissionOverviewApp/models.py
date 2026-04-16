from django.db import models
from ckeditor.fields import RichTextField

class CommissionOverview(models.Model):
    title_en = models.CharField(max_length=255, default="Commission Overview", verbose_name="Title (English)")
    title_ur = models.CharField(max_length=255, blank=True, verbose_name="Title (Urdu)")
    title_sd = models.CharField(max_length=255, blank=True, verbose_name="Title (Sindhi)")

    description_en = RichTextField(verbose_name="Description (English)")
    description_ur = RichTextField(verbose_name="Description (Urdu)", blank=True, config_name='rtl_config')
    description_sd = RichTextField(verbose_name="Description (Sindhi)", blank=True, config_name='rtl_config')

    image = models.ImageField(upload_to='commission_overview/', blank=True, null=True, verbose_name="Overview Image")
    is_active = models.BooleanField(default=True, help_text="Set to true to display this overview on the dashboard.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title_en

    class Meta:
        verbose_name = "Commission Overview"
        verbose_name_plural = "Commission Overviews"
        ordering = ['-created_at']