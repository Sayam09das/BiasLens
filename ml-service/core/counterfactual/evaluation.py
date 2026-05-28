"""Evaluation helpers for feature-level counterfactual candidates."""

from __future__ import annotations


def evaluate_counterfactual_result(
    *,
    original_prediction: dict[str, object],
    counterfactual_prediction: dict[str, object],
) -> dict[str, object]:
    """Summarize whether a counterfactual changed the predicted outcome."""
    original_label = str(original_prediction.get("prediction", ""))
    counterfactual_label = str(counterfactual_prediction.get("prediction", ""))

    original_probabilities = original_prediction.get("probabilities") or {}
    counterfactual_probabilities = counterfactual_prediction.get("probabilities") or {}

    def _best_score(probabilities: object) -> float | None:
        if isinstance(probabilities, dict) and probabilities:
            return max(float(value) for value in probabilities.values())
        return None

    original_score = _best_score(original_probabilities)
    counterfactual_score = _best_score(counterfactual_probabilities)

    score_delta = None
    if original_score is not None and counterfactual_score is not None:
        score_delta = round(counterfactual_score - original_score, 4)

    return {
        "outcome_changed": original_label != counterfactual_label,
        "original_prediction": original_label,
        "counterfactual_prediction": counterfactual_label,
        "confidence_delta": score_delta,
    }
