"""Format explainability outputs for routes and clients."""

from __future__ import annotations


def format_prediction_explanation(
    *,
    prediction: dict[str, object],
    shap_explanation: dict[str, object],
    lime_explanation: dict[str, object],
    proxy_attribution: dict[str, object],
) -> dict[str, object]:
    """Merge prediction and explanation fragments into one API-ready payload."""
    prediction_label = str(prediction.get("prediction", ""))
    probabilities = prediction.get("probabilities") or {}

    top_probability = None
    if isinstance(probabilities, dict) and probabilities:
        label, score = max(probabilities.items(), key=lambda item: float(item[1]))
        top_probability = {
            "label": str(label),
            "score": round(float(score), 4),
        }

    return {
        "prediction": prediction_label,
        "top_probability": top_probability,
        "shap": shap_explanation,
        "lime": lime_explanation,
        "proxy_attribution": proxy_attribution,
    }
