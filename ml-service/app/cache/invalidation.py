"""Named invalidation helpers for cached runtime artifacts."""

from __future__ import annotations

from app.cache.cache_manager import CacheManager

FAIRNESS_REPORT_CACHE_KEY = "fairness_report"


def invalidate_report_cache(cache: CacheManager) -> None:
    """Invalidate the cached fairness report payload."""
    cache.delete(FAIRNESS_REPORT_CACHE_KEY)


def clear_named_caches(cache: CacheManager, names: list[str]) -> None:
    """Clear a list of known cache keys."""
    for name in names:
        cache.delete(name)
