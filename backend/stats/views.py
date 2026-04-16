from rest_framework import viewsets
from rest_framework.response import Response
from django.db.models import Q, Count
from .models import DashboardStat
from .serializers import DashboardStatSerializer
from complaint.models import Complaint, Hearing

class DashboardStatViewSet(viewsets.ViewSet):
    """
    A ViewSet for retrieving the singleton stats object,
    enriched with live data from the Complaint model.
    """
    def list(self, request):
        # Get the singleton stats object (or create default if missing)
        # We still need this for the 'annual_report' file and 'trends' text
        stat, _ = DashboardStat.objects.get_or_create(pk=1)
        
        # Calculate live statistics from the Complaint model
        # 1. Basic Counts
        total_complaints = Complaint.objects.count()
        appeals_filed = Complaint.objects.filter(is_approved=True).count()
        
        # 2. Resolved/Disposed Cases (Based on Hearings)
        resolved_cases = Hearing.objects.filter(
            procedural_status__in=['DISPOSED_OFF', 'NON_MAINTAINABLE']
        ).values('complaint').distinct().count()
        
        pending_complaints = total_complaints - resolved_cases

        # 3. Disposed Counts by Reason
        # Info Provided
        info_provided_qs = Hearing.objects.filter(
            procedural_status='DISPOSED_OFF',
            disposal_reason='INFO_PROVIDED'
        )
        info_provided_count = info_provided_qs.values('complaint').distinct().count()
        
        # Non-Maintainable
        non_maintainable_qs = Hearing.objects.filter(
            Q(procedural_status='NON_MAINTAINABLE') | 
            Q(procedural_status='DISPOSED_OFF', disposal_reason='NON_MAINTAINABLE')
        )
        non_maintainable_count = non_maintainable_qs.values('complaint').distinct().count()

        # 4. Average Response Time
        disposed_hearings = Hearing.objects.filter(
            procedural_status__in=['DISPOSED_OFF', 'NON_MAINTAINABLE']
        ).select_related('complaint')

        total_days = 0
        count = 0
        seen_complaints = set()

        for hearing in disposed_hearings:
            if hearing.complaint.id in seen_complaints:
                continue
            seen_complaints.add(hearing.complaint.id)
            
            disposal_date = hearing.hearing_date or hearing.created_at.date()
            complaint_date = hearing.complaint.created_at.date()
            
            days = (disposal_date - complaint_date).days
            if days < 0: days = 0
            total_days += days
            count += 1
            
        avg_response_time = int(total_days / count) if count > 0 else 0

        # Penalized Complaints
        penalized_cases = Hearing.objects.filter(
            procedural_status='PENALTY_ORDER'
        ).values('complaint').distinct().count()

        # 5. Filing Modes
        filing_modes = Complaint.objects.values('filing_mode').annotate(count=Count('id'))
        mode_data = {item['filing_mode']: item['count'] for item in filing_modes}
        
        portal_count = mode_data.get('PORTAL', 0)
        courier_count = mode_data.get('COURIER', 0)
        by_hand_count = mode_data.get('BY_HAND', 0)

        # Prepare Response
        serializer = DashboardStatSerializer(stat, context={'request': request})
        data = serializer.data
        
        # Override static DB values with live counts
        data['total_requests'] = total_complaints
        data['appeals_filed'] = appeals_filed
        data['resolved_cases'] = resolved_cases
        data['avg_response_time'] = avg_response_time
        data['pending_complaints'] = pending_complaints
        data['penalized_cases'] = penalized_cases
        
        # Add extra fields expected by frontend
        data['disposed_info_provided'] = info_provided_count
        data['disposed_non_maintainable'] = non_maintainable_count
        data['filing_modes'] = {
            'portal': portal_count,
            'courier': courier_count,
            'by_hand': by_hand_count
        }
        
        # Serialize Lists
        def serialize_list(queryset):
            result = []
            for h in queryset.select_related('complaint').order_by('-hearing_date', '-created_at')[:10]:
                result.append({
                    'id': h.complaint.id,
                    'complaint_number': h.complaint.complaint_number,
                    'complaint_year': h.complaint.complaint_year,
                    'subject': h.complaint.subject,
                    'department': h.complaint.department,
                    'date': h.hearing_date or h.created_at.date()
                })
            return result

        data['disposed_info_list'] = serialize_list(info_provided_qs)
        data['disposed_nm_list'] = serialize_list(non_maintainable_qs)
        
        return Response(data)
