from aiogram_dialog import Window
from aiogram_dialog.widgets.text import Const

from app.bot.states.main import MainStates

main_menu_window = Window(
    Const("Главное меню"),
    state=MainStates.main_menu
)