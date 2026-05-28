"""Fairness metric orchestrator for BiasLens."""

from __future__ import annotations

import pandas as pd

from core.fairness.bias_severity import score_bias_severity
from core.fairness.demographic_parity import (
    compute_group_selection_metrics,
    demographic_parity_difference,
    disparate_impact_ratio,
)
from core.fairness.equalized_odds import compute_equalized_odds_gap


def build_fairness_summary(
    df: pd.DataFrame,
    *,
    gender_column: str = "gender",
    age_group_column: str = "age_group",
    outcome_column: str = "shortlisted",
    score_column: str = "screening_score",
) -> dict[str, object]:
    """Build the main fairness summary used by training and API reporting."""
    gender_metrics = compute_group_selection_metrics(
        df,
        gender_column,
        outcome_column=outcome_column,
        score_column=score_column,
    )
    age_metrics = compute_group_selection_metrics(
        df,
        age_group_column,
        outcome_column=outcome_column,
        score_column=score_column,
    )

    gender_dp = demographic_parity_difference(gender_metrics)
    age_dp = demographic_parity_difference(age_metrics)
    gender_di = disparate_impact_ratio(gender_metrics)
    age_di = disparate_impact_ratio(age_metrics)

    return {
        "dataset_rows": int(len(df)),
        "overall_selection_rate": float(df[outcome_column].mean()),
        "by_gender": gender_metrics,
        "by_age_group": age_metrics,
        "gender_demographic_parity_difference": gender_dp,
        "age_demographic_parity_difference": age_dp,
        "gender_disparate_impact_ratio": gender_di,
        "age_disparate_impact_ratio": age_di,
        "gender_equalized_odds": compute_equalized_odds_gap(df, gender_column),
        "age_equalized_odds": compute_equalized_odds_gap(df, age_group_column),
        "gender_bias_severity": score_bias_severity(
            demographic_parity_gap=gender_dp,
            disparate_impact=gender_di,
        ),
        "age_bias_severity": score_bias_severity(
            demographic_parity_gap=age_dp,
            disparate_impact=age_di,
        ),
    }
