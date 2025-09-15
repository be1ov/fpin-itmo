from uuid import uuid4
from django.db import models

from apps.persons.models import ServiceUser


class TelegramAccount(models.Model):
    id = models.UUIDField(primary_key=True, default=lambda: uuid4())
    user = models.OneToOneField(ServiceUser, on_delete=models.CASCADE)
    is_confirmed = models.BooleanField(default=False)
    telegram_id = models.BigIntegerField(unique=True, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.user} - {'Confirmed' if self.is_confirmed else 'Not Confirmed'}"
