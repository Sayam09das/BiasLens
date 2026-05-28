"""Application lifespan hooks for the BiasLens ML service."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.dependencies import clear_runtime_state, prime_runtime_state


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Warm shared runtime state on startup and release it on shutdown."""
    prime_runtime_state()
    try:
        yield
    finally:
        clear_runtime_state()
