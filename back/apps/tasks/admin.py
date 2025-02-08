from django.contrib import admin

from apps.tasks.models import Task, TaskAttachment

admin.site.register(Task)
admin.site.register(TaskAttachment)