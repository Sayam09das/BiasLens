"""Small deterministic mutation helpers for resume counterfactuals."""

from __future__ import annotations

from typing import Iterable


def apply_attribute_swaps(
    *,
    extracted_features: dict[str, object],
    add_skills: Iterable[str] = (),
    remove_skills: Iterable[str] = (),
    experience_delta: float = 0.0,
    job_role: str | None = None,
) -> dict[str, object]:
    """Apply bounded feature-level mutations to a feature payload."""
    current_skills = [
        skill.strip()
        for skill in str(extracted_features.get("skills", "")).split(",")
        if skill.strip()
    ]
    skill_set = list(dict.fromkeys(current_skills))

    for skill in remove_skills:
        normalized = skill.strip()
        if normalized and normalized in skill_set:
            skill_set.remove(normalized)

    for skill in add_skills:
        normalized = skill.strip()
        if normalized and normalized not in skill_set:
            skill_set.append(normalized)

    updated_experience = max(
        0.0,
        float(extracted_features.get("experience_years", 0.0)) + experience_delta,
    )

    updated = dict(extracted_features)
    updated["skills"] = ", ".join(skill_set)
    updated["experience_years"] = round(updated_experience, 2)
    if job_role:
        updated["job_role"] = job_role
    return updated
