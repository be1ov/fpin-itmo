import httpx
from django.conf import settings
from .signature import generate_signature


def send_message(telegram_id: int, message: str) -> dict:
    """
    Sends a message to a Telegram user via the backend service.

    Args:
        telegram_id (int): The Telegram user ID to send the message to.
        message (str): The message content.

    Returns:
        dict: The response from the backend service.
    """
    request_data = {
        "recipient_id": telegram_id,
        "message": message,
    }
    hash = generate_signature(request_data, token=settings.BOT_TOKEN)
    request_data["hash"] = hash

    with httpx.Client() as client:
        response = client.post(
            settings.BOT_API_URL + "/send/",
            json=request_data,
            timeout=10.0,
        )
        return response.json()
