from apps.tg.actions.accounts import get_telegram_account
from apps.tg.models import TelegramAccount
from rest_framework import serializers

from apps.persons.models import ServiceUser
from apps.tg.serializers.telegram_link_serializer import TelegramLinkSerializer


class ServiceUserSerializer(serializers.ModelSerializer):
    is_staff = serializers.SerializerMethodField()
    short_name = serializers.SerializerMethodField()
    telegram = serializers.SerializerMethodField()

    class Meta:
        model = ServiceUser
        fields = ["full_name", "last_name", "first_name", "patronymic", "isu", "is_approved", "is_staff", "short_name", "github", "telegram"]

    def get_is_staff(self, obj):
        return obj.is_staff

    def get_short_name(self, obj):
        return obj.last_name + " " + obj.first_name[0] + "." + (f" {obj.patronymic[0]}." if obj.patronymic else "")
    
    def get_telegram(self, obj):
        tg_account = get_telegram_account(obj)
        return TelegramLinkSerializer(tg_account).data if tg_account else None