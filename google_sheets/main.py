from celery import Celery

from config import settings

app = Celery('exporter')

app.conf.update(
    broker_url=settings.broker_url,
    result_backend=settings.result_backend,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone=settings.timezone,
)