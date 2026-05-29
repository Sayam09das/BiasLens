"""Compatibility wrapper for cache invalidation helpers."""

from app.cache.invalidation import CacheInvalidationPolicy, build_cache_key

__all__ = ["CacheInvalidationPolicy", "build_cache_key"]
