import uvicorn
from app.config.settings import settings
from app.application import app

def run():
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
