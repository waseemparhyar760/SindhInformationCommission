from django.db import models

class AllowedIP(models.Model):
    ip_address = models.GenericIPAddressField(unique=True, verbose_name="IP Address", help_text="Enter the IP address allowed to access the Admin Panel.")
    description = models.CharField(max_length=255, blank=True, null=True, help_text="e.g. Office PC, Server Room")
    is_active = models.BooleanField(default=True, verbose_name="Active", help_text="Uncheck to temporarily disable access for this IP.")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.ip_address} ({self.description or 'No Description'})"

    class Meta:
        verbose_name = "Allowed Admin IP"
        verbose_name_plural = "Allowed Admin IPs"
