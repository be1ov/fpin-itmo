from uuid import UUID
from pydantic import BaseModel

from app.schemas.models.user_model_schema import UserModelSchema


class LinkUserDto(BaseModel):
    telegram_id: int
    tag: UUID


class LinkUserResponseDto(BaseModel):
    user: UserModelSchema
