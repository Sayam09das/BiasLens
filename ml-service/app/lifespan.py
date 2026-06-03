"""Application lifespan hooks for the BiasLens ML service."""

from __future__ import annotations

from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI

from app.config import get_settings
from app.dependencies import clear_runtime_state, prime_runtime_state

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Warm shared runtime state on startup and release it on shutdown."""
    settings = get_settings()
    if settings.eager_startup_warmup:
        try:
            prime_runtime_state()
        except Exception as exc:  # pragma: no cover - defensive startup fallback
            logger.warning("Startup warmup failed; continuing with lazy initialization: %s", exc)
    try:
        yield
    finally:
        clear_runtime_state()
