"""Shared API service helpers used by route handlers."""

from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.api.schemas import (
    ExtractedFeaturesResponse,
    FairnessResponse,
    PredictionResponse,
    RoleComparisonItem,
    RoleFitExplanation,
    TextReportResponse,
)
from app.predictor import build_input_frame, predict_with_probabilities
from core.extraction import extract_experience_years, extract_skills_from_text
from core.preprocessing.feature_builder import build_feature_set, build_fit_explanation
from core.reporting.report_payload import build_complete_report_payload


def build_features_from_resume_text(
    *,
    resume_text: str,
    job_role: str,
) -> dict[str, object]:
    """Convert raw resume text into the structured fields used by the model."""
    skills = extract_skills_from_text(resume_text)
    experience_years = extract_experience_years(resume_text)
    return build_feature_set(
        skills=skills,
        experience_years=experience_years,
        job_role=job_role,
    )


def build_resume_text_preview(resume_text: str, limit: int = 320) -> str:
    """Return a trimmed preview of extracted resume text."""
    compact = " ".join(resume_text.split())
    if len(compact) <= limit:
        return compact
    return f"{compact[:limit].rstrip()}..."


def clean_distinct_roles(job_roles: list[str]) -> list[str]:
    """Normalize and deduplicate requested job roles while preserving order."""
    cleaned_roles: list[str] = []
    for role in job_roles:
        normalized = role.strip()
        if normalized and normalized not in cleaned_roles:
            cleaned_roles.append(normalized)
    return cleaned_roles


def build_prediction_from_features(model, extracted_features: dict[str, object]) -> RoleComparisonItem:
    """Return prediction and structured explanation for one role-specific evaluation."""
    input_df = build_input_frame(
        skills=str(extracted_features["skills"]),
        experience_years=float(extracted_features["experience_years"]),
        job_role=str(extracted_features["job_role"]),
        ai_score=float(extracted_features["ai_score"]),
    )
    prediction_result = predict_with_probabilities(model, input_df)
    parsed_skills = [
        skill.strip()
        for skill in str(extracted_features["skills"]).split(",")
        if skill.strip()
    ]
    fit = build_fit_explanation(parsed_skills, str(extracted_features["job_role"]))
    return RoleComparisonItem(
        prediction=PredictionResponse(**prediction_result),
        extracted_features=ExtractedFeaturesResponse(**extracted_features),
        fit_explanation=RoleFitExplanation(**fit),
    )


def build_report_payload_from_features(
    *,
    model,
    fairness_report: dict[str, object],
    extracted_features: dict[str, object],
) -> TextReportResponse:
    """Create a combined report response after feature extraction."""
    item = build_prediction_from_features(model, extracted_features)
    return TextReportResponse(
        prediction=item.prediction,
        fairness=FairnessResponse(**fairness_report),
        extracted_features=item.extracted_features,
    )


def build_extended_report_payload_from_features(
    *,
    model,
    fairness_report: dict[str, object],
    extracted_features: dict[str, object],
    source_filename: str | None = None,
    extracted_resume_text_preview: str | None = None,
) -> dict[str, object]:
    """Create a richer reporting payload for future report/export endpoints."""
    item = build_prediction_from_features(model, extracted_features)
    return build_complete_report_payload(
        prediction=item.prediction.model_dump(),
        fairness_report=fairness_report,
        extracted_features=item.extracted_features.model_dump(),
        source_filename=source_filename,
        extracted_resume_text_preview=extracted_resume_text_preview,
    )


if __name__ == "__main__":
    print(
        "app.api.services is a support module, not a standalone script. "
        "Run the FastAPI app via 'uvicorn app.main:app --reload' from the ml-service directory."
    )
