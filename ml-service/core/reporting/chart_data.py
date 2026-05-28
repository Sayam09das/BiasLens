"""Chart-oriented data transformations for frontend reporting views."""

from __future__ import annotations


def build_probability_chart_data(prediction: dict[str, object]) -> list[dict[str, object]]:
    """Convert prediction probabilities into a chart-friendly list."""
    probabilities = prediction.get("probabilities") or {}
    if not isinstance(probabilities, dict):
        return []
    return [
        {"label": str(label), "value": round(float(value), 4)}
        for label, value in probabilities.items()
    ]


def build_fairness_chart_data(fairness_report: dict[str, object]) -> dict[str, list[dict[str, object]]]:
    """Convert fairness group metrics into chart-friendly series."""
    return {
        "by_gender": _group_metrics_to_series(fairness_report.get("by_gender", {})),
        "by_age_group": _group_metrics_to_series(fairness_report.get("by_age_group", {})),
    }


def _group_metrics_to_series(group_metrics: object) -> list[dict[str, object]]:
    if not isinstance(group_metrics, dict):
        return []
    series: list[dict[str, object]] = []
    for label, values in group_metrics.items():
        if not isinstance(values, dict):
            continue
        series.append(
            {
                "label": str(label),
                "rows": int(values.get("rows", 0)),
                "selection_rate": float(values.get("selection_rate", 0.0) or 0.0),
                "average_screening_score": float(values.get("average_screening_score", 0.0) or 0.0),
            }
        )
    return series
