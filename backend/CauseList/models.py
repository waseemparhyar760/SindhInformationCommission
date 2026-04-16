from django.db import models

class CauseList(models.Model):
    title_en = models.CharField(max_length=255, help_text="e.g., Cause List for 12th Jan 2025 (English)")
    title_ur = models.CharField(max_length=255, blank=True, null=True, help_text="Title in Urdu")
    title_sd = models.CharField(max_length=255, blank=True, null=True, help_text="Title in Sindhi")
    date = models.DateField()
    file = models.FileField(upload_to='cause_lists/', blank=True, null=True, help_text="Upload a PDF/image file for the cause list (if not generating from hearings).")
    hearings = models.ManyToManyField('complaint.Hearing', blank=True, related_name='cause_lists', verbose_name="Associated Hearings", through='CauseListHearing')
    is_approved = models.BooleanField(default=False, help_text="Approve to make this cause list visible on the frontend.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.title_en} - {self.date}"

class CauseListHearing(models.Model):
    cause_list = models.ForeignKey(CauseList, on_delete=models.CASCADE)
    hearing = models.ForeignKey('complaint.Hearing', on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0, verbose_name="Order")
    serial_number = models.CharField(max_length=50, blank=True, null=True, verbose_name="Serial No.")

    class Meta:
        ordering = ['order']
        verbose_name = "Hearing in Cause List"
        verbose_name_plural = "Hearings in Cause List"
