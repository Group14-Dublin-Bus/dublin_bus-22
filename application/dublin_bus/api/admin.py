from django.contrib import admin

# Import the website models from models.py
from .models import Report, Favourite, Feedback

# Register both models so that an admin can edit them
admin.site.register(Report)
admin.site.register(Favourite)
admin.site.register(Feedback)
