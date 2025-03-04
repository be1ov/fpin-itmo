from django.contrib.auth.models import AbstractUser
from django.db import models

class ServiceUser(AbstractUser):
    last_name = models.CharField(max_length=30, verbose_name="Фамилия")
    first_name = models.CharField(max_length=30, verbose_name="Имя")
    patronymic = models.CharField(max_length=30, blank=True, null=True, verbose_name="Отчество")
    isu = models.CharField(max_length=6, verbose_name="Табельный номер (ИСУ)")
    github = models.CharField(max_length=30, blank=True, null=True, verbose_name="Github ID")
    github_username = models.CharField(max_length=30, blank=True, null=True, verbose_name="Github Username")
    github_access_token = models.CharField(max_length=100, blank=True, null=True, verbose_name="Github Access Token")

    is_approved = models.BooleanField(default=False, verbose_name="Утвержден")

    @property
    def full_name(self):
        return f"{self.last_name} {self.first_name} {self.patronymic or ''}".strip()

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"