"""Configuration helpers for the BiasLens ML service."""

from __future__ import annotations

import os
from functools import lru_cache

from pydantic import BaseModel, Field


class Settings(BaseModel):
    """Small validated settings object loaded from environment variables."""

    service_name: str = Field(default="BiasLens ML Service")
    service_version: str = Field(default="0.1.0")
    allowed_origins: list[str] = Field(default_factory=lambda: ["*"])
    fairness_report_path: str = Field(
        default="artifacts/metrics/fairness_evaluation.json"
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached service settings."""
    origins = os.getenv("BIASLENS_ALLOWED_ORIGINS", "*")
    parsed_origins = [item.strip() for item in origins.split(",") if item.strip()]
    return Settings(
        service_name=os.getenv("BIASLENS_SERVICE_NAME", "BiasLens ML Service"),
        service_version=os.getenv("BIASLENS_SERVICE_VERSION", "0.1.0"),
        allowed_origins=parsed_origins or ["*"],
        fairness_report_path=os.getenv(
            "BIASLENS_FAIRNESS_REPORT_PATH",
            "artifacts/metrics/fairness_evaluation.json",
        ),
    )
