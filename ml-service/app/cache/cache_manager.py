"""Cache abstraction for runtime data with a Redis-ready surface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import datetime, timedelta

from app.config import Settings


class CacheManager(ABC):
    """Abstract cache interface for report and model-adjacent data."""

    @abstractmethod
    def get(self, key: str):
        """Return a cached value or `None`."""

    @abstractmethod
    def set(self, key: str, value, ttl_seconds: int | None = None) -> None:
        """Store a cached value with an optional TTL."""

    @abstractmethod
    def delete(self, key: str) -> None:
        """Delete a cached value if present."""

    @abstractmethod
    def clear(self) -> None:
        """Clear all cache entries."""


class InMemoryCacheManager(CacheManager):
    """Simple in-process cache with TTL support."""

    def __init__(self, default_ttl_seconds: int = 300) -> None:
        self.default_ttl_seconds = default_ttl_seconds
        self._store: dict[str, tuple[object, datetime | None]] = {}

    def get(self, key: str):
        item = self._store.get(key)
        if item is None:
            return None

        value, expires_at = item
        if expires_at is not None and datetime.utcnow() >= expires_at:
            self.delete(key)
            return None
        return value

    def set(self, key: str, value, ttl_seconds: int | None = None) -> None:
        ttl = self.default_ttl_seconds if ttl_seconds is None else ttl_seconds
        expires_at = None if ttl <= 0 else datetime.utcnow() + timedelta(seconds=ttl)
        self._store[key] = (value, expires_at)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    def clear(self) -> None:
        self._store.clear()


def build_cache_manager(settings: Settings) -> CacheManager:
    """Build the configured cache backend with a safe fallback."""
    backend = settings.cache_backend.strip().lower()
    if backend == "redis":
        # Redis can be added later without changing call sites.
        return InMemoryCacheManager(default_ttl_seconds=settings.cache_default_ttl_seconds)
    return InMemoryCacheManager(default_ttl_seconds=settings.cache_default_ttl_seconds)
