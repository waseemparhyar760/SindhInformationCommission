from rest_framework import serializers
from .models import Complaint, Hearing

class HearingSerializer(serializers.ModelSerializer):
    complaint_number = serializers.ReadOnlyField(source='complaint.complaint_number')
    complaint_year = serializers.ReadOnlyField(source='complaint.complaint_year')
    complaint_procedural_status = serializers.ReadOnlyField(source='procedural_status')

    class Meta:
        model = Hearing
        fields = '__all__'

class ComplaintSerializer(serializers.ModelSerializer):
    hearings = HearingSerializer(many=True, read_only=True)
    
    class Meta:
        model = Complaint
        fields = '__all__'

class PublicComplaintSerializer(serializers.ModelSerializer):
    hearings = HearingSerializer(many=True, read_only=True)
    
    class Meta:
        model = Complaint
        fields = '__all__'