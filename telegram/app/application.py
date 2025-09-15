from fastapi import FastAPI
from .apps.sending.sending_router import sending_router

app = FastAPI(
    title="FPin Telegram Bot",
    description="API для взаимодействия с ботом FPin в Telegram",
    version="1.0.0",
)

app.include_router(sending_router, prefix="/send", tags=["Sending"])
