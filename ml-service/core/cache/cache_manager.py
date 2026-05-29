"""Compatibility wrapper for the cache manager implementation."""

from app.cache.cache_manager import CacheManager, InMemoryCacheManager, build_cache_manager

__all__ = ["CacheManager", "InMemoryCacheManager", "build_cache_manager"]
