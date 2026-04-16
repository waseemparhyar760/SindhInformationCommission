from django.urls import path
from .views import CauseListListView

urlpatterns = [
    path('list/', CauseListListView.as_view(), name='cause-list-list'),
]