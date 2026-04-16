from rest_framework import serializers
from .models import ResourceDocument

class ResourceDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceDocument
        fields = '__all__'