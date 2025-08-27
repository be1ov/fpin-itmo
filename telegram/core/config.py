from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")

class Settings(BaseSettings):
    BOT_TOKEN: str = Field(..., alias="BOT_TOKEN")
    REDIS_URL: str = Field(..., alias="REDIS_URL")

    API_URL: str = Field(..., alias="API_URL")

    model_config = SettingsConfigDict(
        extra="ignore"
    )

settings = Settings() # type: ignore