"""LIME-style explanation fallbacks for the current baseline model."""

from __future__ import annotations

from core.explainability.feature_importance import estimate_feature_importance


def build_lime_like_explanation(
    *,
    model,
    extracted_features: dict[str, object],
) -> dict[str, object]:
    """Return a LIME-like local explanation payload using lightweight heuristics."""
    top_items = estimate_feature_importance(extracted_features=extracted_features)[:5]
    return {
        "method": "lime_like_fallback",
        "available": False,
        "message": "True LIME sampling is not wired yet; returning a local heuristic explanation instead.",
        "top_local_features": top_items,
        "model_name": getattr(model, "model_name", "unknown"),
    }
