from django.urls import path
from .views import BudgetListView

urlpatterns = [
    path('list/', BudgetListView.as_view(), name='budget-list'),
]