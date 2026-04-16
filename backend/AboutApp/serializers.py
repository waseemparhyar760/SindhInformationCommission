from rest_framework import serializers
from .models import Organogram

class OrganogramSerializer(serializers.ModelSerializer):
    """
    Serializer for the Organogram model.
    """
    class Meta:
        model = Organogram
        fields = ['id', 'title_en', 'title_ur', 'title_sd', 'image', 'is_active', 'updated_at']