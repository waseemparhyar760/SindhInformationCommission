from rest_framework import serializers
from .models import CauseList
from complaint.models import Hearing

class HearingSerializer(serializers.ModelSerializer):
    complaint_display = serializers.SerializerMethodField()
    department = serializers.ReadOnlyField(source='complaint.department')

    class Meta:
        model = Hearing
        fields = [
            'id', 
            'hearing_date', 
            'hearing_time', 
            'complainant_name', 
            'respondent_name', 
            'bench_members',
            'complaint_display',
            'department',
            'serial_number',
        ]
    
    def get_complaint_display(self, obj):
        return f"Complaint No. ({obj.complaint.complaint_number}/{obj.complaint.complaint_year})"

class CauseListSerializer(serializers.ModelSerializer):
    hearings = serializers.SerializerMethodField()

    class Meta:
        model = CauseList
        fields = '__all__'

    def get_hearings(self, obj):
        # Fetch through model instances to get serial_number and order
        cause_list_hearings = obj.causelisthearing_set.select_related('hearing', 'hearing__complaint').order_by('order')
        
        data = []
        for item in cause_list_hearings:
            hearing_data = HearingSerializer(item.hearing).data
            hearing_data['serial_number'] = item.serial_number
            data.append(hearing_data)
        return data