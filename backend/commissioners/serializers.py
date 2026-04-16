from rest_framework import serializers
from .models import Commissioner

class CommissionerSerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()
    isChief = serializers.BooleanField(source='is_chief')

    class Meta:
        model = Commissioner
        fields = [
            'id', 
            'name_en', 'title_en', 'bio_en', 'education_en',
            'name_ur', 'title_ur', 'bio_ur', 'education_ur',
            'name_sd', 'title_sd', 'bio_sd', 'education_sd',
            'email', 'contact_number',
            'isChief', 'imageUrl'
        ]

    def get_imageUrl(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None