from django.urls import path
from .views import index

urlpatterns = [
    path("", index),
    # path("Alerts/<str:reportCode>", index),
    path("Favourites/<str:favouriteCode>", index),
]
