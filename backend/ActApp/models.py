from django.db import models

class Act(models.Model):
    title = models.CharField(max_length=255, default="Sindh Transparency & Right to Information Act, 2016")
    pdf_file = models.FileField(upload_to='acts/', verbose_name="Act PDF")
    is_active = models.BooleanField(default=True, help_text="Only the active act will be displayed on the dashboard.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']