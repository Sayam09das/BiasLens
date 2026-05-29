"""Unit tests for fairness metrics."""

import pandas as pd

from core.fairness.demographic_parity import (
    compute_group_selection_metrics,
    demographic_parity_difference,
)


def test_demographic_parity_difference_returns_gap() -> None:
    df = pd.DataFrame(
        {
            "gender": ["female", "female", "male", "male"],
            "shortlisted": [1, 1, 0, 1],
            "screening_score": [80, 85, 70, 75],
        }
    )
    metrics = compute_group_selection_metrics(df, "gender")
    assert demographic_parity_difference(metrics) >= 0
