
"""
URL configuration for sic_project project.
"""
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView
urlpatterns = [
    # Admin Interface
    path('admin/', admin.site.urls),
    # API Endpoints
    path('api/complaint/', include('complaint.urls')),
    path('api/track/', include('complaint.public_urls')),
    path('api/commissioners/', include('commissioners.urls')),
    path('api/public-bodies/', include('publicBodies.urls')),
    path('api/staff/', include('staff.urls')),
    path('api/resources/', include('LawAndResources.urls')),
    path('api/statistics/', include('stats.urls')),
    path('api/info-desk/', include('InfoDesk.urls')),
    path('api/notifications/', include('EventNotifications.urls')),
    path('api/careers/', include('Careers.urls')),
    path('api/cause-list/', include('CauseList.urls')),
    path('api/gallery/', include('GalleryApp.urls')),
    path('api/annual-reports/', include('AnnualReportApp.urls')),
    path('api/acts/', include('ActApp.urls')),
    path('api/commission-overview/', include('CommissionOverviewApp.urls')),
    path('api/budget/', include('SICBudgetApp.urls')),
    path('api/about/', include('AboutApp.urls')),
    path('api/settings/', include('WebsiteSettingsApp.urls')),
    path('api/notification-app/', include('NotificationApp.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# React Frontend Catch-all
# This MUST remain at the absolute end of the file so it doesn't shadow API or Media/Static paths.
urlpatterns.append(re_path(r'^(?!admin|api|static|media).*$', TemplateView.as_view(template_name='index.html')))