from http import HTTPMethod
import typing as tp
import httpx
import hashlib

class APIClient:
    def __init__(self, bot_token: str):
        self.token = bot_token

    # async def make_request(self, url: str, data: tp.Dict, method: HTTPMethod):
    #     async with httpx.AsyncClient() as client:
    #         request = client.request(method=method, url=url)

    async def _generate_signature(self, data: tp.Dict) -> str:
        keys = list(data.keys())
        sorted_keys = sorted(keys)
        values = [f"{key}={data[key]}" for key in sorted_keys]
        values.append(self.token)
        
        values_string = ":".join(values)
        return hashlib.sha256(values_string.encode("utf-8")).hexdigest()