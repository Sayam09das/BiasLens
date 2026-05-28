"""Data normalization helpers for extracted features."""

from app.model_utils import normalize_text


def normalize_skill_list(skills: list[str]) -> list[str]:
    """Normalize extracted skill labels while preserving order."""
    cleaned: list[str] = []
    for skill in skills:
        normalized = normalize_text(skill).lower()
        if normalized and normalized not in cleaned:
            cleaned.append(normalized)
    return cleaned
