"""Equalized-odds style metrics for grouped evaluation."""

from __future__ import annotations

import pandas as pd


def compute_equalized_odds_gap(
    df: pd.DataFrame,
    group_column: str,
    *,
    truth_column: str = "shortlisted",
    prediction_column: str = "predicted_shortlisted",
) -> dict[str, float | None]:
    """Compute coarse TPR/FPR gaps across groups when predictions are available."""
    if prediction_column not in df.columns:
        return {
            "true_positive_rate_gap": None,
            "false_positive_rate_gap": None,
        }

    tpr_values: list[float] = []
    fpr_values: list[float] = []

    grouped = df.groupby(group_column, observed=True)
    for _, group_df in grouped:
        if group_df.empty:
            continue

        positives = group_df[group_df[truth_column] == 1]
        negatives = group_df[group_df[truth_column] == 0]

        if not positives.empty:
            tpr_values.append(float((positives[prediction_column] == 1).mean()))
        if not negatives.empty:
            fpr_values.append(float((negatives[prediction_column] == 1).mean()))

    return {
        "true_positive_rate_gap": float(max(tpr_values) - min(tpr_values)) if len(tpr_values) >= 2 else None,
        "false_positive_rate_gap": float(max(fpr_values) - min(fpr_values)) if len(fpr_values) >= 2 else None,
    }
