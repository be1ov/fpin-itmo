import asyncio
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
import httpx
from core.config import settings
from aiogram.fsm.storage.redis import RedisStorage
from redis.asyncio import Redis
from aiogram.filters import Command
from aiogram.types import Message

from utils.api_client import APIClient

DEBUG = True

if DEBUG:
    storage = MemoryStorage()
else:
    redis = Redis.from_url(settings.REDIS_URL)
    storage = RedisStorage(redis=redis)
bot = Bot(token=settings.BOT_TOKEN)
dp = Dispatcher(storage=storage)

api_client = APIClient(settings.BOT_TOKEN)

@dp.message(Command("start"))
async def start(message: Message):
    if not message.from_user:
        return
    
    if not message.text:
        await message.answer("Упс! Попробуйте еще раз...")
        return
    
    args = message.text.split()
    if len(args) < 2:
        await message.answer("Пожалуйста, получите ссылку для привязки аккаунта на fpin-itmo.ru")
        return
    
    link_id = args[1]
    data = {
        "id": link_id,
        "telegram_id": message.from_user.id
    }
    signature = await api_client._generate_signature(data)
    data["hash"] = signature

    async with httpx.AsyncClient(
        base_url=settings.API_URL
    ) as client:
        r = await client.post("/tg/link", data=data)
        response = r.json()
        if r.status_code != 200:
            await message.answer("Что-то пошло не так... Пожалуйста, попробуйте позже, или обратитесь в поддержку")
            return
        
        msg = f"{response['data']['user']['first_name']}, ваш аккаунт успешно привязан и вы будете получать уведомления!"
        await message.answer(msg)

def main():
    dp.run_polling(bot, skip_updates=True)

main()