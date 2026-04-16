from rest_framework import serializers
from .models import WebsiteLogo

class WebsiteLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteLogo
        fields = ['name', 'logo_image']