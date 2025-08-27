from django.db import models

from apps.persons.models import ServiceUser


class TelegramAccount(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.OneToOneField(ServiceUser, on_delete=models.CASCADE)
    is_confirmed = models.BooleanField(default=False)
    telegram_id = models.BigIntegerField(unique=True, null=True, blank=True)