from rest_framework import serializers
from .models import Report, Favourite, Feedback

# Serializers for all models in the application


class ReportSerializer(serializers.ModelSerializer):
    # Serializer for updating the report model
    class Meta:
        model = Report
        fields = ("id", "code", 'host', "submission_type",
                  "route", "travel_time", "text", "delay", "created_at", "updated_at")


class CreateReportSerializer(serializers.ModelSerializer):
    # Serializer for adding to the report model
    class Meta:
        model = Report
        fields = ("submission_type", "route", "travel_time", "delay", "text")


class FavouriteSerializer(serializers.ModelSerializer):
    # De-scoped: Serializer for updating the favourite model
    class Meta:
        model = Favourite
        fields = ("id", "code", 'host', "route", "created_at", "updated_at")


class CreateFavouriteSerializer(serializers.ModelSerializer):
    # De-scoped: Serializer for adding to the favourites model
    class Meta:
        model = Favourite
        fields = ("route",)


class FeedbackSerializer(serializers.ModelSerializer):
    # Serializer for updating the feedback model
    class Meta:
        model = Feedback
        fields = ("id", "code", 'host', "feedback_type",
                  "os", "text", "created_at", "updated_at")


class CreateFeedbackSerializer(serializers.ModelSerializer):
    # Serializer for adding to the feedback model
    class Meta:
        model = Feedback
        fields = ("feedback_type", "os", "text")
