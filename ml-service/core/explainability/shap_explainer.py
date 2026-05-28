"""SHAP-style explanation fallbacks for the current baseline model."""

from __future__ import annotations

from core.explainability.feature_importance import estimate_feature_importance


def build_shap_like_explanation(
    *,
    model,
    extracted_features: dict[str, object],
) -> dict[str, object]:
    """Return a SHAP-like explanation payload without requiring SHAP at runtime."""
    return {
        "method": "shap_like_fallback",
        "available": False,
        "message": "True SHAP computation is not wired yet; returning heuristic contribution estimates instead.",
        "feature_contributions": estimate_feature_importance(extracted_features=extracted_features),
        "model_name": getattr(model, "model_name", "unknown"),
    }
