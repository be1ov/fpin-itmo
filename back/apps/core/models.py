from django.db import models

from apps.persons.models import ServiceUser


class File(models.Model):
    uid = models.CharField(max_length=100, primary_key=True)
    file = models.FileField(upload_to='files')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(ServiceUser, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.uid