from rest_framework import generics, permissions
from .models import WebsiteLogo
from .serializers import WebsiteLogoSerializer

class ActiveLogoView(generics.ListAPIView):
    """
    API view to retrieve the currently active website logo.
    """
    serializer_class = WebsiteLogoSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """This view should return a list containing only the single active logo."""
        return WebsiteLogo.objects.filter(is_active=True)