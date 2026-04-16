from django.urls import path
from .views import AnnualReportListView

urlpatterns = [
    path('list/', AnnualReportListView.as_view(), name='annual-report-list'),
]