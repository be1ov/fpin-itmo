from fastapi import HTTPException
from app.schemas.api.sending.send_schema import SendSchema
from app.dependencies.managers.dispatcher import Dispatcher


async def send_implementation(body: SendSchema):
    dispatcher = Dispatcher()
    async with dispatcher.start():
        if dispatcher.api.check_signature(body.model_dump()) == False:
            raise HTTPException(status_code=400, detail="Invalid hash")

        try:
            bot = dispatcher.bot
            await bot.bot.send_message(chat_id=body.recipient_id, text=body.message)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to send message")
