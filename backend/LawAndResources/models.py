from django.db import models

class ResourceDocument(models.Model):
    TYPE_CHOICES = [
        ('ACT', 'Sindh Transparency & RTI Act, 2016'),
        ('RULES', 'Rules of Business 2017'),
        ('GUIDE', "Citizen's Guide to RTI"),
        ('FORM_A', 'Form A (Information Request)'),
        ('FORM_B', 'Form B (Internal Review)'),
        ('FORM_C', 'Form C (Appeal)'),
    ]

    title = models.CharField(max_length=255, help_text="Display title for the document")
    resource_type = models.CharField(max_length=20, choices=TYPE_CHOICES, unique=True)
    
    # Files for each language
    file_en = models.FileField(upload_to='resources/en/', blank=True, null=True, verbose_name="English PDF")
    file_ur = models.FileField(upload_to='resources/ur/', blank=True, null=True, verbose_name="Urdu PDF")
    file_sd = models.FileField(upload_to='resources/sd/', blank=True, null=True, verbose_name="Sindhi PDF")

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.get_resource_type_display()
    
    class Meta:
        verbose_name = "Law & Resource Document"