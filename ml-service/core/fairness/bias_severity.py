"""Bias severity scoring helpers."""

from __future__ import annotations


def score_bias_severity(
    *,
    demographic_parity_gap: float | None,
    disparate_impact: float | None,
) -> dict[str, object]:
    """Convert a few fairness metrics into a coarse severity label."""
    dp_gap = float(demographic_parity_gap or 0.0)
    di = disparate_impact

    severity = "low"
    reasons: list[str] = []

    if dp_gap >= 0.15:
        severity = "high"
        reasons.append("demographic parity gap is large")
    elif dp_gap >= 0.08:
        severity = "moderate"
        reasons.append("demographic parity gap is noticeable")

    if di is not None and di < 0.8:
        severity = "high" if severity == "moderate" else max(severity, "moderate", key=["low", "moderate", "high"].index)
        reasons.append("disparate impact ratio is below the 0.8 rule-of-thumb threshold")

    return {
        "severity": severity,
        "reasons": reasons,
    }
