from rest_framework import serializers

class TelegramLinkSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    telegram_id = serializers.IntegerField()
    is_confirmed = serializers.BooleanField()

    link = serializers.SerializerMethodField()

    def get_link(self, obj):
        return f"https://t.me/fpin_dbot?start={obj.id}"