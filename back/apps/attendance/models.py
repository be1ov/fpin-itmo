from django.db import models

from apps.education.models import Lesson, Student
from apps.persons.models import ServiceUser


class Attendance(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.PROTECT)
    user = models.ForeignKey(ServiceUser, on_delete=models.PROTECT, null=True)
    attachment = models.FileField(upload_to='attendances', null=True)
    is_approved = models.BooleanField()

    def __str__(self):
        presentation = "" if self.is_approved else "[UNAPPROVED] "
        presentation += f"{self.user} {self.lesson}"
        return presentation