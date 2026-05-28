"""Skill extraction helpers backed by the live model utility patterns."""

from __future__ import annotations

from app.model_utils import SKILL_PATTERNS, extract_skills_from_text as _extract_skills_from_text


def extract_skills_from_text(text: str) -> list[str]:
    """Extract normalized skill labels from resume text."""
    return _extract_skills_from_text(text)


def list_supported_skills() -> list[str]:
    """Return the currently configured canonical skill labels."""
    return sorted(SKILL_PATTERNS.keys())
