from pydantic import RedisDsn
from pydantic_settings import BaseSettings

class CelerySettings(BaseSettings):
    broker_url: RedisDsn
    result_backend: RedisDsn
    timezone: str = "Europe/Moscow"

    model_config = {
        "extra": "allow"
    }

settings = CelerySettings()