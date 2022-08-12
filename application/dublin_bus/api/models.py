from django.utils import timezone
from django.db import models
import string
import random

# source tech with tim


def generate_code():
    # Create random unique code as identifier for unique users with a length of 6, used in favourites feature
    length = 6
    while True:
        code = "".join(random.choices(string.ascii_uppercase, k=length))
        if Favourite.objects.filter(code=code).count() == 0:
            break

    return code


class AutoDateTimeField(models.DateTimeField):
    def pre_save(self, model_instance, add):
        return timezone.now()


class Report(models.Model):
    # Model used in the report feature and alerts features for users reports on bus service interruptions
    code = models.CharField(max_length=8, default=generate_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    submission_type = models.CharField(max_length=100, null=False)
    route = models.CharField(max_length=100, null=False)
    travel_time = models.CharField(max_length=200, null=False)
    delay = models.CharField(max_length=200, null=False)
    text = models.CharField(max_length=200, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text


class Favourite(models.Model):
    # De-scoped: Model used in the favourites feature to record users favourite routes
    code = models.CharField(max_length=8, default=generate_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    route = models.CharField(max_length=4, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Feedback(models.Model):
    # Model used in the report feature and alerts features for users feedback on the application
    code = models.CharField(max_length=8, default=generate_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    feedback_type = models.CharField(max_length=100, null=False)
    os = models.CharField(max_length=100, null=False)
    text = models.CharField(max_length=200, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text
