from django.db import models

class AnnualReport(models.Model):
    title = models.CharField(max_length=255, help_text="e.g. Annual Report 2024-2025")
    pdf_file = models.FileField(upload_to='annual_reports/', verbose_name="Report PDF")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
