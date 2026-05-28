"""Counterfactual consistency metrics for fairness checks."""

from __future__ import annotations


def compute_counterfactual_consistency(
    *,
    original_prediction: dict[str, object],
    counterfactual_prediction: dict[str, object],
) -> dict[str, object]:
    """Measure whether a prediction changed under a counterfactual perturbation."""
    original_label = str(original_prediction.get("prediction", ""))
    counterfactual_label = str(counterfactual_prediction.get("prediction", ""))
    return {
        "is_consistent": original_label == counterfactual_label,
        "original_prediction": original_label,
        "counterfactual_prediction": counterfactual_label,
    }
