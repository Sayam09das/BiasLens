"""Health and root metadata schemas."""

from pydantic import BaseModel


class RootResponse(BaseModel):
    service: str
    status: str
    model: str


class HealthResponse(BaseModel):
    status: str
