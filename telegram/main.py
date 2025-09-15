import httpx
from app.config.settings import settings


from utils.api_client import APIClient

api_client = APIClient(settings.BOT_TOKEN)

if __name__ == "__main__":
    import sys

    args = sys.argv

    if "--bot" in args:
        from app.bot.bot import start

        start()

    if "--web" in args:
        from server.uvicorn import run

        run()
