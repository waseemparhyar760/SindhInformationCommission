from rest_framework import viewsets
from .models import InfoDeskDocument
from .serializers import InfoDeskDocumentSerializer

class InfoDeskDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InfoDeskDocument.objects.all()
    serializer_class = InfoDeskDocumentSerializer
    pagination_class = None