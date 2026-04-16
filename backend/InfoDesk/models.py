from django.db import models

class InfoDeskDocument(models.Model):
    CATEGORY_CHOICES = [
        ('advertisements', 'Advertisement'),
        ('tenders', 'Tender'),
        ('pio-guidelines', 'PIO Guideline'),
        ('proactive-disclosures', 'Proactive Disclosure'),
        ('publications', 'Publication'),
    ]

    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ur = models.CharField(max_length=255, verbose_name="Title (Urdu)", blank=True, null=True)
    title_sd = models.CharField(max_length=255, verbose_name="Title (Sindhi)", blank=True, null=True)
    
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    
    file = models.FileField(upload_to='infodesk/', blank=True, null=True)
    link = models.URLField(blank=True, null=True, help_text="External link if no file is uploaded")
    
    publication_date = models.DateField(auto_now_add=True)
    
    class Meta:
        ordering = ['-publication_date']
        verbose_name = "Info Desk Document"

    def __str__(self):
        return self.title_en