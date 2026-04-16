from django.contrib import admin
from django import forms
from .models import Budget
import json
from django.contrib import messages

class BudgetAdminForm(forms.ModelForm):
    json_upload = forms.FileField(
        required=False, 
        help_text="Upload a JSON file to automatically populate the Expenditure Data field.",
        label="Upload Expenditure JSON"
    )

    class Meta:
        model = Budget
        fields = '__all__'

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    form = BudgetAdminForm
    list_display = ('title_en', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('title_en', 'title_ur', 'title_sd')
    actions = ['approve_budgets']

    def save_model(self, request, obj, form, change):
        json_file = form.cleaned_data.get('json_upload')
        if json_file:
            try:
                data = json.load(json_file)
                if isinstance(data, list):
                    # Validate that the JSON structure matches what the frontend expects
                    if all(isinstance(item, dict) and 'label' in item and 'value' in item for item in data):
                        obj.expenditure_data = data
                        self.message_user(request, "Expenditure data updated successfully from JSON file.", level=messages.SUCCESS)
                    else:
                        self.message_user(request, "JSON Error: Each item must have 'label' and 'value' keys.", level=messages.ERROR)
                else:
                    self.message_user(request, "JSON Error: Data must be a list of objects.", level=messages.ERROR)
            except json.JSONDecodeError:
                self.message_user(request, "Invalid JSON file uploaded.", level=messages.ERROR)
        super().save_model(request, obj, form, change)

    def approve_budgets(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} budgets have been approved.", level=messages.SUCCESS)
    approve_budgets.short_description = "Approve selected budgets"