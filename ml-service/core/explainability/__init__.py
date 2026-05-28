"""Model explainability helpers for BiasLens."""

from core.explainability.explanation_formatter import format_prediction_explanation
from core.explainability.feature_importance import estimate_feature_importance
from core.explainability.lime_explainer import build_lime_like_explanation
from core.explainability.proxy_attribution import attribute_proxy_signals
from core.explainability.shap_explainer import build_shap_like_explanation

__all__ = [
    "attribute_proxy_signals",
    "build_lime_like_explanation",
    "build_shap_like_explanation",
    "estimate_feature_importance",
    "format_prediction_explanation",
]
