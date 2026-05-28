"""Shared runtime dependencies for the BiasLens ML service."""

from __future__ import annotations

import json
from pathlib import Path

from app.config import get_settings
from app.predictor import load_model


ROOT = Path(__file__).resolve().parents[1]
_cached_model = None
_cached_fairness_report: dict[str, object] | None = None


def get_model():
    """Return a cached prediction model instance."""
    global _cached_model
    if _cached_model is None:
        _cached_model = load_model()
    return _cached_model


def get_fairness_report() -> dict[str, object]:
    """Return the saved fairness report from disk or cache."""
    global _cached_fairness_report
    if _cached_fairness_report is not None:
        return _cached_fairness_report

    settings = get_settings()
    report_path = ROOT / settings.fairness_report_path
    if not report_path.exists():
        raise FileNotFoundError(
            "Fairness report not found. Run "
            "'python3 ml-service/training/evaluate_fairness.py' first."
        )

    with report_path.open("r", encoding="utf-8") as handle:
        _cached_fairness_report = json.load(handle)
    return _cached_fairness_report


def prime_runtime_state() -> None:
    """Warm caches during application startup."""
    get_model()
    get_fairness_report()


def clear_runtime_state() -> None:
    """Clear in-memory caches during shutdown or tests."""
    global _cached_model, _cached_fairness_report
    _cached_model = None
    _cached_fairness_report = None
