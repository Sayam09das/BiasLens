"""Deterministic counterfactual candidate generation for role-fit analysis."""

from __future__ import annotations

from core.counterfactual.attribute_swapper import apply_attribute_swaps
from core.counterfactual.perturbation_policy import get_default_perturbation_policy

ROLE_SKILL_SUGGESTIONS = {
    "data scientist": ["statistics", "scikit-learn", "power bi"],
    "machine learning engineer": ["scikit-learn", "pytorch", "spark"],
    "full stack developer": ["react", "node.js", "typescript"],
    "backend developer": ["api development", "node.js", "docker"],
}


def generate_role_counterfactuals(
    *,
    extracted_features: dict[str, object],
    target_role: str,
) -> list[dict[str, object]]:
    """Generate a few feature-level counterfactual variants for a target role."""
    policy = get_default_perturbation_policy()
    role_key = target_role.strip().lower()
    suggested_skills = ROLE_SKILL_SUGGESTIONS.get(role_key, [])
    max_skill_additions = int(policy["max_skill_additions"])

    candidates: list[dict[str, object]] = []
    if suggested_skills:
        candidates.append(
            apply_attribute_swaps(
                extracted_features=extracted_features,
                add_skills=suggested_skills[:max_skill_additions],
                job_role=target_role,
            )
        )

    if bool(policy["allow_experience_adjustment"]):
        candidates.append(
            apply_attribute_swaps(
                extracted_features=extracted_features,
                experience_delta=min(float(policy["max_experience_delta"]), 1.0),
                job_role=target_role,
            )
        )

    candidates.append(
        apply_attribute_swaps(
            extracted_features=extracted_features,
            add_skills=suggested_skills[:2],
            experience_delta=1.0 if bool(policy["allow_experience_adjustment"]) else 0.0,
            job_role=target_role,
        )
    )

    unique_candidates: list[dict[str, object]] = []
    seen: set[tuple[str, float, str]] = set()
    for candidate in candidates:
        key = (
            str(candidate.get("skills", "")),
            float(candidate.get("experience_years", 0.0)),
            str(candidate.get("job_role", "")),
        )
        if key in seen:
            continue
        seen.add(key)
        unique_candidates.append(candidate)
    return unique_candidates
