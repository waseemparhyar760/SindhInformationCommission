from rest_framework import serializers
from .models import Act

class ActSerializer(serializers.ModelSerializer):
    class Meta:
        model = Act
        fields = ['id', 'title', 'pdf_file', 'updated_at']