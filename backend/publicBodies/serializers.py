from rest_framework import serializers
from .models import PublicBody
from complaint.models import Complaint

class PublicBodySerializer(serializers.ModelSerializer):
    complaint_count = serializers.SerializerMethodField()
    department_name = serializers.CharField(source='department.name_en', read_only=True)

    # Flatten HOD details from the parent Department
    hod_name_en = serializers.CharField(source='department.hod_name_en', read_only=True)
    hod_name_ur = serializers.CharField(source='department.hod_name_ur', read_only=True)
    hod_name_sd = serializers.CharField(source='department.hod_name_sd', read_only=True)
    hod_designation_en = serializers.CharField(source='department.hod_designation_en', read_only=True)
    hod_designation_ur = serializers.CharField(source='department.hod_designation_ur', read_only=True)
    hod_designation_sd = serializers.CharField(source='department.hod_designation_sd', read_only=True)
    hod_contact = serializers.CharField(source='department.hod_contact', read_only=True)
    department_contact = serializers.CharField(source='department.department_contact', read_only=True)
    hod_email = serializers.EmailField(source='department.hod_email', read_only=True)
    hod_address_en = serializers.CharField(source='department.hod_address_en', read_only=True)
    hod_address_ur = serializers.CharField(source='department.hod_address_ur', read_only=True)
    hod_address_sd = serializers.CharField(source='department.hod_address_sd', read_only=True)

    class Meta:
        model = PublicBody
        fields = '__all__'

    def get_complaint_count(self, obj):
        if hasattr(obj, 'complaint_count_annotated'):
            return obj.complaint_count_annotated
        return Complaint.objects.filter(department__iexact=obj.name_en).count()