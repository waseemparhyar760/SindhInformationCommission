from django.db import models

class DashboardStat(models.Model):
    # Main Counters
    total_requests = models.IntegerField(default=0, verbose_name="Total Requests")
    appeals_filed = models.IntegerField(default=0, verbose_name="Appeals Filed")
    resolved_cases = models.IntegerField(default=0, verbose_name="Resolved Cases")
    avg_response_time = models.IntegerField(default=0, verbose_name="Average Response Time (Days)")
    
    # Trends (Text fields to allow formatting like "+12%")
    requests_trend = models.CharField(max_length=50, default="+0%", help_text="e.g. +12%")
    appeals_trend = models.CharField(max_length=50, default="+0%", help_text="e.g. +5%")
    resolved_trend = models.CharField(max_length=50, default="+0%", help_text="e.g. +8%")

    # Files
    annual_report = models.FileField(upload_to='reports/', blank=True, null=True, verbose_name="Annual Report PDF")

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Dashboard Statistic"
        verbose_name_plural = "Dashboard Statistics"

    def __str__(self):
        return f"Stats (Updated: {self.updated_at.strftime('%Y-%m-%d')})"

    def save(self, *args, **kwargs):
        # Optional: Ensure only one instance exists to prevent confusion
        if not self.pk and DashboardStat.objects.exists():
            return
        super().save(*args, **kwargs)
