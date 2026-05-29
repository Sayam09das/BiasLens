"""Shared runtime dependencies for the BiasLens ML service."""

from __future__ import annotations

import json
from pathlib import Path

from app.cache import build_cache_manager
from app.cache.invalidation import FAIRNESS_REPORT_CACHE_KEY
from app.config import get_settings
from core.explainability.shap_explainer import load_active_shap_artifact
from core.models.model_registry import get_default_model


ROOT = Path(__file__).resolve().parents[1]
_cached_model = None
_cached_fairness_report: dict[str, object] | None = None
_cached_shap_explainer: dict[str, object] | None = None
_cache_manager = None


def get_cache_manager():
    """Return the configured cache manager instance."""
    global _cache_manager
    if _cache_manager is None:
        _cache_manager = build_cache_manager(get_settings())
    return _cache_manager


def get_model():
    """Return a cached prediction model instance."""
    global _cached_model
    if _cached_model is None:
        _cached_model = get_default_model()
    return _cached_model


def get_shap_explainer():
    """Return the cached SHAP explainer artifact when present."""
    global _cached_shap_explainer
    if _cached_shap_explainer is None:
        _cached_shap_explainer = load_active_shap_artifact()
    return _cached_shap_explainer


def get_fairness_report() -> dict[str, object]:
    """Return the saved fairness report from disk or cache."""
    global _cached_fairness_report
    if _cached_fairness_report is not None:
        return _cached_fairness_report

    cache = get_cache_manager()
    cached_report = cache.get(FAIRNESS_REPORT_CACHE_KEY)
    if isinstance(cached_report, dict):
        _cached_fairness_report = cached_report
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
    cache.set(FAIRNESS_REPORT_CACHE_KEY, _cached_fairness_report)
    return _cached_fairness_report


def prime_runtime_state() -> None:
    """Warm caches during application startup."""
    get_model()
    get_fairness_report()
    get_shap_explainer()


def clear_runtime_state() -> None:
    """Clear in-memory caches during shutdown or tests."""
    global _cached_model, _cached_fairness_report, _cached_shap_explainer, _cache_manager
    _cached_model = None
    _cached_fairness_report = None
    _cached_shap_explainer = None
    if _cache_manager is not None:
        _cache_manager.clear()
    _cache_manager = None
