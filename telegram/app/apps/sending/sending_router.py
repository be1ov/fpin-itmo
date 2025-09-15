from fastapi import APIRouter
from .post_send_endpoint import send_endpoint

sending_router = APIRouter()
sending_router.add_api_route(
    "/", send_endpoint, methods=["POST"], summary="Send a message"
)
