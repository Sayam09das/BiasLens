"""Fairness metrics and reporting helpers for BiasLens."""

from core.fairness.bias_severity import score_bias_severity
from core.fairness.counterfactual_consistency import compute_counterfactual_consistency
from core.fairness.demographic_parity import (
    compute_group_selection_metrics,
    demographic_parity_difference,
    disparate_impact_ratio,
)
from core.fairness.equalized_odds import compute_equalized_odds_gap
from core.fairness.fairness_engine import build_fairness_summary
from core.fairness.report_generator import generate_fairness_report_payload

__all__ = [
    "build_fairness_summary",
    "compute_counterfactual_consistency",
    "compute_equalized_odds_gap",
    "compute_group_selection_metrics",
    "demographic_parity_difference",
    "disparate_impact_ratio",
    "generate_fairness_report_payload",
    "score_bias_severity",
]
