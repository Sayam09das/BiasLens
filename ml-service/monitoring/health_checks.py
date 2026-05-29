"""Custom health check probes for future orchestration."""

from __future__ import annotations


def run_basic_health_probes() -> dict[str, str]:
    """Return a minimal probe summary."""
    return {
        "api": "ok",
        "model_registry": "ok",
        "fairness_cache": "ok",
    }
