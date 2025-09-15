from copy import deepcopy
from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.tg.actions.signature import (
    HashNotFoundException,
    SignatureInvalidException,
    generate_signature,
    validate_signature,
)
from apps.persons.serializers import ServiceUserSerializer
from apps.tg.serializers.telegram_link_serializer import TelegramLinkSerializer
from apps.tg.models import TelegramAccount
import httpx


class TelegramLinkAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        data = deepcopy(request.data)

        try:
            validate_signature(data, token=settings.BOT_TOKEN)
        except (HashNotFoundException, SignatureInvalidException) as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = TelegramLinkSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        v = serializer.validated_data

        try:
            acc = TelegramAccount.objects.get(id=v["id"])
        except TelegramAccount.DoesNotExist:
            return Response(
                {"status": "error", "message": "invalid_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        acc.is_confirmed = True
        acc.telegram_id = v["telegram_id"]
        acc.save()

        return Response(
            {"status": "ok", "data": {"user": ServiceUserSerializer(acc.user).data}},
            status=status.HTTP_200_OK,
        )


class TestSendingMessageAPIView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        request_data = {
            "recipient_id": request.query_params.get("recipient_id"),
            "message": request.query_params.get("message", "test message"),
        }
        hash = generate_signature(request_data, token=settings.BOT_TOKEN)
        request_data["hash"] = hash

        with httpx.Client() as client:
            response = client.post(
                settings.BOT_API_URL + "/send/",
                data=request_data,
                timeout=10.0,
            )
            return Response(response.json(), status=response.status_code)
