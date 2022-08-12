from django.urls import path, re_path
from .views import Prediction, ReportView, GetReport, CreateReportView, FavouriteView, GetFavourite, CreateFavouriteView, StopsView, RoutesView, WeatherView, LineNumberView, CreateFeedbackView, FeedbackView

# Url patterns for all views in 
urlpatterns = [
    path("report", ReportView.as_view()),
    path("get-report", GetReport.as_view()),
    path("feedback", FeedbackView.as_view()),
    path("create-feedback", CreateFeedbackView.as_view()),
    path("report", ReportView.as_view()),
    path("get-report", GetReport.as_view()),
    path("create-report", CreateReportView.as_view()),
    
    path("stops", StopsView.stops, name="stops"),

    # add the regx experssion to provide dynamic url address
    re_path(r'^routes/(?P<route_number>\w+)',
            RoutesView.routes, name="routes"),
    path("weather", WeatherView.weather, name="weather"),
    path("line_number", LineNumberView.line_number, name="line_number"),
    path("prediction", Prediction.prediction),
]

    # Favourites de-scoped
    # path("get-favourite", GetFavourite.as_view()),
    # path("create-favourite", CreateFavouriteView.as_view()),
    # path("favourite", FavouriteView.as_view()),


