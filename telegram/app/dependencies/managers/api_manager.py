import hashlib
import typing as tp

import httpx
from app.config.settings import settings
from app.schemas.dto.LinkUserDto import LinkUserDto, LinkUserResponseDto
from app.exceptions.users.linking_exception import LinkingException


class ApiManager:
    def __init__(self, secret_string: str, base_url: tp.Optional[str] = None) -> None:
        base_url = base_url or settings.API_URL
        self.secret_string = secret_string

    def _generate_signature(self, data: tp.Dict) -> str:
        keys = list(data.keys())
        sorted_keys = sorted(keys)
        values = [f"{key}={data[key]}" for key in sorted_keys]
        values.append(self.secret_string)

        values_string = ":".join(values)
        return hashlib.sha256(values_string.encode("utf-8")).hexdigest()

    async def link_user(self, data: LinkUserDto) -> LinkUserResponseDto:
        response_data = {
            "id": str(data.tag),
            "telegram_id": data.telegram_id,
        }
        hash = self._generate_signature(response_data)
        response_data["hash"] = hash

        async with httpx.AsyncClient(base_url=settings.API_URL) as client:
            r = await client.post("/tg/link", data=response_data)
            response = r.json()
            if r.status_code != 200:
                raise LinkingException(f"Linking failed: {response}")

            return LinkUserResponseDto(**response)
