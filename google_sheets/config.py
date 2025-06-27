from pydantic import RedisDsn, Field
from pydantic_settings import BaseSettings

class CelerySettings(BaseSettings):
    broker_url: RedisDsn = Field(alias="CELERY_BROKER_URL")
    result_backend: RedisDsn = Field(alias="CELERY_RESULT_BACKEND")
    timezone: str = "Europe/Moscow"

    model_config = {
        "extra": "allow"
    }

settings = CelerySettings()