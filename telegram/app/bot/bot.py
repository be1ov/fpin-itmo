from uuid import UUID

from aiogram_dialog import DialogManager, StartMode, setup_dialogs
from app.dependencies.managers.dispatcher import Dispatcher
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardButton, InlineKeyboardMarkup

from app.schemas.dto.LinkUserDto import LinkUserDto
from app.exceptions.users.linking_exception import LinkingException

from app.bot.dialogs.main import main_dialog
from app.bot.dialogs.main.windows.main_menu_window import MainStates

dispatcher = Dispatcher()
dp = dispatcher.bot.dp
bot = dispatcher.bot.bot
api_manager = dispatcher.bot.api_manager
dp.include_router(main_dialog)
setup_dialogs(dp)

@dp.message(Command("start"))
async def start_handler(message: Message):
    if not message.from_user:
        return

    if not message.text:
        await message.answer("Упс! Попробуйте еще раз...")
        return

    args = message.text.split()
    if len(args) < 2:
        await message.answer(
            "Пожалуйста, получите ссылку для привязки аккаунта на fpin-itmo.ru",
            reply_markup=InlineKeyboardMarkup(
                inline_keyboard=[
                    [
                        InlineKeyboardButton(
                            text="Перейти на сайт", url="https://fpin-itmo.ru"
                        )
                    ]
                ]
            ),
        )
        return

    data = LinkUserDto(telegram_id=message.from_user.id, tag=UUID(args[1]))
    try:
        linking_result = await api_manager.link_user(data)
        msg = f"{linking_result.user.first_name}, ваш аккаунт успешно привязан и вы будете получать уведомления!"
        await message.answer(msg)
    except LinkingException as e:
        await message.answer(
            "Что-то пошло не так... Пожалуйста, попробуйте позже, или обратитесь в поддержку",
            reply_markup=InlineKeyboardMarkup(
                inline_keyboard=[
                    [
                        InlineKeyboardButton(
                            text="Написать в поддержку", url="https://t.me/be1ov_v"
                        )
                    ]
                ]
            ),
        )

@dp.message(Command("menu"))
async def menu_handler(message: Message, dialog_manager: DialogManager):
    await dialog_manager.start(MainStates.main_menu, mode=StartMode.RESET_STACK)


def start():
    dp.run_polling(bot, skip_updates=True)
