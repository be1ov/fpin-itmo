from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class UserModelSchema(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
