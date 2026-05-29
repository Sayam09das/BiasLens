"""Tracing configuration placeholders for future OpenTelemetry wiring."""

from __future__ import annotations


def build_tracing_config() -> dict[str, str]:
    """Return a tiny tracing configuration stub."""
    return {
        "provider": "opentelemetry",
        "status": "placeholder",
    }
