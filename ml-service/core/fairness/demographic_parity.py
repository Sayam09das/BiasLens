"""Demographic parity metrics for grouped fairness analysis."""

from __future__ import annotations

import pandas as pd


def compute_group_selection_metrics(
    df: pd.DataFrame,
    column: str,
    *,
    outcome_column: str = "shortlisted",
    score_column: str = "screening_score",
) -> dict[str, dict[str, float]]:
    """Measure per-group selection rates and average scores."""
    results: dict[str, dict[str, float]] = {}
    grouped = df.groupby(column, observed=True)

    for group_name, group_df in grouped:
        if pd.isna(group_name) or group_df.empty:
            continue

        group_key = str(group_name)
        results[group_key] = {
            "rows": int(len(group_df)),
            "selection_rate": float(group_df[outcome_column].mean()),
            "average_screening_score": float(group_df[score_column].mean()),
        }

    return results


def demographic_parity_difference(group_metrics: dict[str, dict[str, float]]) -> float:
    """Return the max-minus-min group selection-rate gap."""
    rates = [float(values["selection_rate"]) for values in group_metrics.values()]
    return float(max(rates) - min(rates)) if rates else 0.0


def disparate_impact_ratio(group_metrics: dict[str, dict[str, float]]) -> float | None:
    """Return the min/max group selection-rate ratio."""
    rates = [
        float(values["selection_rate"])
        for values in group_metrics.values()
        if float(values["selection_rate"]) > 0
    ]
    if len(rates) < 2:
        return None
    return float(min(rates) / max(rates))
