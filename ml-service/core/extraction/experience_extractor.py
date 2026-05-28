"""Experience extraction helpers for resumes."""

from __future__ import annotations

import re

from app.model_utils import (
    extract_experience_years as _extract_experience_years,
    infer_experience_from_date_ranges,
)
from core.types import ExperienceProfile

EXPLICIT_EXPERIENCE_PATTERNS = [
    r"(\d+(?:\.\d+)?)\+?\s+years?\s+of\s+experience",
    r"experience\s+of\s+(\d+(?:\.\d+)?)\+?\s+years?",
    r"(\d+(?:\.\d+)?)\+?\s+years?\s+experience",
    r"over\s+(\d+(?:\.\d+)?)\+?\s+years?",
    r"(\d+(?:\.\d+)?)\+?\s+yrs?\b",
]


def extract_experience_years(text: str) -> float:
    """Return the normalized total years of experience estimate."""
    return _extract_experience_years(text)


def extract_experience_profile(text: str) -> ExperienceProfile:
    """Return a fuller view of experience signals found in the resume."""
    lowered = text.lower()
    explicit_year_mentions: list[float] = []

    for pattern in EXPLICIT_EXPERIENCE_PATTERNS:
        for match in re.finditer(pattern, lowered):
            explicit_year_mentions.append(float(match.group(1)))

    inferred_from_dates = infer_experience_from_date_ranges(lowered)
    total_years = _extract_experience_years(text)
    return ExperienceProfile(
        total_years=total_years,
        explicit_year_mentions=explicit_year_mentions,
        inferred_from_dates=inferred_from_dates,
    )
