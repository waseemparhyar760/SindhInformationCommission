from django.core.exceptions import PermissionDenied
from django.conf import settings
from .models import AllowedIP

class AdminIPRestrictionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the request is targeting the admin panel
        if request.path.startswith('/admin/'):
            client_ip = self.get_client_ip(request)
            
            # Always allow localhost in DEBUG mode to prevent lockout during development
            if settings.DEBUG and client_ip in ['127.0.0.1', '::1']:
                return self.get_response(request)

            # Check if IP is in the allowed list and is active
            if not AllowedIP.objects.filter(ip_address=client_ip, is_active=True).exists():
                raise PermissionDenied(f"Access Denied: Your IP ({client_ip}) is not authorized to access the Admin Panel.")

        return self.get_response(request)

    def get_client_ip(self, request):
        """
        Retrieves the client IP address, handling cases where the app is behind a proxy.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
