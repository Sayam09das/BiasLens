"""Build complete reporting payloads from prediction and fairness data."""

from __future__ import annotations

from core.reporting.chart_data import build_fairness_chart_data, build_probability_chart_data
from core.reporting.recommendations import generate_report_recommendations


def build_complete_report_payload(
    *,
    prediction: dict[str, object],
    fairness_report: dict[str, object],
    extracted_features: dict[str, object] | None = None,
    source_filename: str | None = None,
    extracted_resume_text_preview: str | None = None,
) -> dict[str, object]:
    """Build a richer report payload for future API and frontend use."""
    payload: dict[str, object] = {
        "prediction": prediction,
        "fairness": fairness_report,
        "charts": {
            "probabilities": build_probability_chart_data(prediction),
            "fairness": build_fairness_chart_data(fairness_report),
        },
    }

    if extracted_features is not None:
        payload["extracted_features"] = extracted_features
        payload["recommendations"] = generate_report_recommendations(
            extracted_features=extracted_features,
            prediction=prediction,
            fairness_report=fairness_report,
        )

    if source_filename:
        payload["source_filename"] = source_filename
    if extracted_resume_text_preview:
        payload["extracted_resume_text_preview"] = extracted_resume_text_preview
    return payload
