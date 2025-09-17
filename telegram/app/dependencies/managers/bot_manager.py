from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.base import DefaultKeyBuilder
from app.config.settings import settings

from app.config.settings import settings
from aiogram.fsm.storage.redis import RedisStorage
from aiogram.fsm.storage.memory import MemoryStorage
import redis.asyncio as Redis

from app.dependencies.managers.api_manager import ApiManager

class BotManager:
    def __init__(self, api_manager: ApiManager):
        self._bot = Bot(token=settings.BOT_TOKEN)
        if settings.DEBUG:
            self._storage = MemoryStorage()
        else:
            self._redis = Redis.from_url(settings.REDIS_URL)
            self._storage = RedisStorage(
                redis=self._redis,
                key_builder=DefaultKeyBuilder(with_destiny=True, prefix="fsm:"),
            )

        self._dp = Dispatcher(storage=self._storage)
        

        self._api_manager = api_manager

    @property
    def api_manager(self):
        return self._api_manager

    @property
    def bot(self):
        return self._bot

    @property
    def dp(self):
        return self._dp

    async def send_message(self, chat_id: int, text: str):
        return await self._bot.send_message(chat_id=chat_id, text=text)
