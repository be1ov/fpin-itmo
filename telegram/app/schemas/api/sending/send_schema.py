from pydantic import BaseModel


class SendSchema(BaseModel):
    recipient_id: int
    message: str
    hash: str
