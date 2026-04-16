from rest_framework import serializers
from .models import InfoDeskDocument

class InfoDeskDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoDeskDocument
        fields = '__all__'