from rest_framework import viewsets
from .models import ResourceDocument
from .serializers import ResourceDocumentSerializer

class ResourceDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResourceDocument.objects.all()
    serializer_class = ResourceDocumentSerializer
    pagination_class = None