"""PDF-report scaffolding helpers."""

from __future__ import annotations

from core.reporting.report_payload import build_complete_report_payload


def build_pdf_report_context(
    *,
    prediction: dict[str, object],
    fairness_report: dict[str, object],
    extracted_features: dict[str, object] | None = None,
    source_filename: str | None = None,
    extracted_resume_text_preview: str | None = None,
) -> dict[str, object]:
    """Build a render context for a future PDF report generator."""
    payload = build_complete_report_payload(
        prediction=prediction,
        fairness_report=fairness_report,
        extracted_features=extracted_features,
        source_filename=source_filename,
        extracted_resume_text_preview=extracted_resume_text_preview,
    )
    return {
        "title": "BiasLens Resume Analysis Report",
        "payload": payload,
        "pdf_ready": False,
        "message": "PDF rendering is not wired yet; this context is ready for a future generator.",
    }
