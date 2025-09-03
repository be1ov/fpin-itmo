from apps.persons.models import ServiceUser
from apps.tg.models import TelegramAccount


def get_telegram_account(user: ServiceUser) -> "TelegramAccount":
    try:
        return user.telegramaccount
    except TelegramAccount.DoesNotExist:
        account =  TelegramAccount(user=user)
        account.save()
        return account