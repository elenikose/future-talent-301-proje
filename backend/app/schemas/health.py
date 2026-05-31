"""Health uç noktası şeması."""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    version: str
