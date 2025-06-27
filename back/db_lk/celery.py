import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "db_lk.settings")

app = Celery("db_lk")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()