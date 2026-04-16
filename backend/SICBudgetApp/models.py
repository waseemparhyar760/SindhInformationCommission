from django.db import models
from ckeditor.fields import RichTextField

class Budget(models.Model):
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ur = models.CharField(max_length=255, blank=True, verbose_name="Title (Urdu)")
    title_sd = models.CharField(max_length=255, blank=True, verbose_name="Title (Sindhi)")
    
    description_en = RichTextField(verbose_name="Description (English)")
    description_ur = RichTextField(verbose_name="Description (Urdu)", blank=True, config_name='rtl_config')
    description_sd = RichTextField(verbose_name="Description (Sindhi)", blank=True, config_name='rtl_config')
    
    file = models.FileField(upload_to='budget_files/', verbose_name="Budget File (PDF/Image)")
    is_approved = models.BooleanField(default=False, verbose_name="Approved", help_text="Approve to display this budget on the frontend.")
    
    total_grant = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name="Total Grant in Aid Received")
    amount_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name="Amount Balance/Lapsed")
    
    expenditure_data = models.JSONField(blank=True, null=True, verbose_name="Expenditure Data", help_text='JSON Format: [{"label": "Salaries", "value": 50000}, {"label": "Development", "value": 20000}]')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title_en

    class Meta:
        verbose_name = "Budget"
        verbose_name_plural = "Budgets"
        ordering = ['-created_at']