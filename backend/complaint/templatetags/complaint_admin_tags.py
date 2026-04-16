from django import template
from ..models import Complaint

register = template.Library()

@register.simple_tag
def get_unapproved_complaint_count():
    """
    Returns the total number of complaints that are not yet approved.
    """
    return Complaint.objects.filter(is_approved=False).count()
