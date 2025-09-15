from contextlib import asynccontextmanager
from app.dependencies.managers.api_manager import ApiManager
from app.dependencies.managers.bot_manager import BotManager
from app.config.settings import settings


class Dispatcher:
    def __init__(self):
        pass

    @asynccontextmanager
    async def start(self):
        try:
            yield
        finally:
            pass

    @property
    def api(self):
        return ApiManager(secret_string=settings.BOT_TOKEN)

    @property
    def bot(self):
        return BotManager(self.api)
