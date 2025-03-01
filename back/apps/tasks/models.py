from django.db import models

from apps.persons.models import ServiceUser


class Task(models.Model):
    title = models.CharField(max_length=150)
    description = models.CharField(max_length=4000)

    def __str__(self):
        return self.title


class TaskAttachment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    order = models.IntegerField()
    attachment = models.URLField(blank=True, null=True)

    author = models.ForeignKey(ServiceUser, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.order}. {self.title} - {self.task}"


