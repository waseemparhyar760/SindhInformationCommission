from django import template
from django.db.models import Count, Max, Q
from complaint.models import Complaint, Hearing
from django.utils.html import format_html
import datetime

register = template.Library()

@register.inclusion_tag('admin/complaint_stats.html')
def dashboard_stats():
    today = datetime.date.today()
    cutoff_date = today - datetime.timedelta(days=20)

    # Aggregate counts by filing mode
    data = Complaint.objects.values('filing_mode').annotate(total=Count('id')).order_by('-total')
    
    # Get display labels from model choices
    choices = dict(Complaint.FILING_MODE_CHOICES)
    
    total_complaints = Complaint.objects.count()
    
    # Define colors for the bars
    colors = {
        'PORTAL': '#3b82f6', # Blue
        'COURIER': '#f59e0b', # Amber
        'BY_HAND': '#10b981', # Emerald
    }
    
    chart_labels = []
    chart_data = []
    chart_colors = []
    
    for item in data:
        count = item['total']
        mode = item['filing_mode']
        color = colors.get(mode, '#64748b')
        label = choices.get(mode, mode)
        
        chart_labels.append(label)
        chart_data.append(count)
        chart_colors.append(color)

    # 1. Unfocused / Pending Approval
    pending_complaints = Complaint.objects.filter(is_approved=False).order_by('-created_at')[:5]

    # 2. Next Hearings
    next_hearings = Hearing.objects.filter(hearing_date__gte=today).select_related('complaint').order_by('hearing_date')[:5]

    # 3. Past Hearings
    past_hearings = Hearing.objects.filter(hearing_date__lt=today).select_related('complaint').order_by('-hearing_date')[:5]

    # 4. Stalled Proceedings (Not disposed, no future hearings, inactive > 20 days)
    stalled_complaints = Complaint.objects.exclude(hearings__procedural_status='DISPOSED_OFF') \
        .exclude(hearings__hearing_date__gte=today) \
        .annotate(last_hearing=Max('hearings__hearing_date')) \
        .filter(Q(last_hearing__lt=cutoff_date) | Q(last_hearing__isnull=True, created_at__date__lt=cutoff_date)) \
        .order_by('last_hearing')[:5]
        
    return {
        'chart_labels': chart_labels,
        'chart_data': chart_data,
        'chart_colors': chart_colors,
        'pending_complaints': pending_complaints,
        'next_hearings': next_hearings,
        'past_hearings': past_hearings,
        'stalled_complaints': stalled_complaints,
    }

@register.simple_tag
def get_unapproved_complaint_count():
    """
    Returns the total number of complaints that are not yet approved.
    """
    return Complaint.objects.filter(is_approved=False).count()