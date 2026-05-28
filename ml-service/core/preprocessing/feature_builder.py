"""Feature-building helpers for model-facing payloads."""

from __future__ import annotations

from core.types import ExtractedFeatureSet, RoleFitExplanationDict
from app.model_utils import estimate_ai_score, explain_role_fit


def build_feature_set(
    *,
    skills: list[str],
    experience_years: float,
    job_role: str,
) -> ExtractedFeatureSet:
    """Build a normalized feature payload for downstream prediction."""
    return {
        "skills": ", ".join(skills) if skills else "general experience",
        "experience_years": experience_years,
        "job_role": job_role,
        "ai_score": estimate_ai_score(skills, experience_years, job_role),
    }


def build_fit_explanation(skills: list[str], job_role: str) -> RoleFitExplanationDict:
    """Build a typed role-fit explanation payload."""
    return explain_role_fit(skills, job_role)
