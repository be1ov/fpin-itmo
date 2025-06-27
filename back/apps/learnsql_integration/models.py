import requests
from django.conf import settings
from django.db import models

from apps.persons.models import ServiceUser
from db_lk.utils import generate_random_password


class LearnSQLAccount(models.Model):
    user = models.OneToOneField(ServiceUser, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    login = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=12, default=generate_random_password)

    def save(self, *args, **kwargs):
        if not self.email:
            self.email = self.user.email
        if not self.login:
            self.login = self.user.username
        super().save(*args, **kwargs)

    def __str__(self):
        return self.login

    def create_account(self):
        url = f"{settings.LEARN_SQL_BASE_URL}/auth/users"
        payload = {
            "username": self.login,
            "password": self.password,
            "email": self.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name
        }

        try:
            response = requests.post(url, data=payload)
            response.raise_for_status()
            response_data = response.json()
            return response_data
        except requests.RequestException as e:
            return None