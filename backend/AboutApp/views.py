from rest_framework import generics, permissions
from .models import Organogram
from .serializers import OrganogramSerializer

class ActiveOrganogramListView(generics.ListAPIView):
    """
    API view to retrieve the currently active organogram.
    Returns a list containing at most one active organogram.
    """
    serializer_class = OrganogramSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """This view should return a list containing only the active organogram."""
        return Organogram.objects.filter(is_active=True)