from rest_framework import serializers

class TelegramLinkSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    telegram_id = serializers.IntegerField()