from rest_framework import serializers
from .models import CommissionOverview

class CommissionOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionOverview
        fields = '__all__'