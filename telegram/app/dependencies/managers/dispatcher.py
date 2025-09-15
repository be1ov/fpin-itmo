from app.dependencies.managers.api_manager import ApiManager
from app.dependencies.managers.bot_manager import BotManager


class Dispatcher:
    def __init__(self):
        pass

    @property
    def api(self):
        return ApiManager()

    @property
    def bot(self):
        return BotManager(self.api)
