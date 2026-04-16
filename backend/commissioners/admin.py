from django.contrib import admin
from django.db import models
from django import forms
from .models import Commissioner
from ckeditor.widgets import CKEditorWidget

class CommissionerAdminForm(forms.ModelForm):
    class Meta:
        model = Commissioner
        fields = '__all__'
        widgets = {
            'bio_en': CKEditorWidget(config_name='default'),
            'education_en': CKEditorWidget(config_name='default'),
            'bio_ur': CKEditorWidget(config_name='rtl_config'),
            'education_ur': CKEditorWidget(config_name='rtl_config'),
            'bio_sd': CKEditorWidget(config_name='rtl_config'),
            'education_sd': CKEditorWidget(config_name='rtl_config'),
        }

@admin.register(Commissioner)
class CommissionerAdmin(admin.ModelAdmin):
    form = CommissionerAdminForm
    list_display = ('name_en', 'title_en', 'is_chief')
    list_filter = ('is_chief',)
    search_fields = ('name_en', 'title_en', 'name_ur', 'name_sd')
    fieldsets = (
        ('English', {
            'fields': ('name_en', 'title_en', 'bio_en', 'education_en')
        }),
        ('Urdu', {
            'fields': ('name_ur', 'title_ur', 'bio_ur', 'education_ur')
        }),
        ('Sindhi', {
            'fields': ('name_sd', 'title_sd', 'bio_sd', 'education_sd')
        }),
        ('General', {
            'fields': ('is_chief', 'image', 'email', 'contact_number')
        }),
    )

    class Media:
        js = ('/static/ckeditor/ckeditor/ckeditor.js',)