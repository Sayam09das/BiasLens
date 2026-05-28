"""Fairness report payload helpers."""

from __future__ import annotations

import pandas as pd

from core.fairness.fairness_engine import build_fairness_summary


def generate_fairness_report_payload(df: pd.DataFrame) -> dict[str, object]:
    """Generate the canonical fairness report payload from a prepared dataframe."""
    return build_fairness_summary(df)
