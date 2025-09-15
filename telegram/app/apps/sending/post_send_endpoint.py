from app.core.sending.send_core import send_implementation
from app.schemas.api.sending.send_schema import SendSchema

async def send_endpoint(body: SendSchema):
    return await send_implementation(body)
