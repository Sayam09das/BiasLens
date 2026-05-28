"""Lightweight feature-importance heuristics for the current ML service."""

from __future__ import annotations


def estimate_feature_importance(
    *,
    extracted_features: dict[str, object],
) -> list[dict[str, object]]:
    """Return a simple ranked feature-importance view for API-friendly explanations."""
    skills = [
        skill.strip()
        for skill in str(extracted_features.get("skills", "")).split(",")
        if skill.strip()
    ]
    experience_years = float(extracted_features.get("experience_years", 0.0))
    ai_score = float(extracted_features.get("ai_score", 0.0))
    job_role = str(extracted_features.get("job_role", ""))

    importances: list[dict[str, object]] = []
    importances.append(
        {
            "feature": "ai_score",
            "value": ai_score,
            "importance": round(ai_score / 100.0, 4),
            "reason": "The heuristic AI score is a direct strong signal in the baseline model input.",
        }
    )
    importances.append(
        {
            "feature": "experience_years",
            "value": experience_years,
            "importance": round(min(experience_years / 10.0, 1.0), 4),
            "reason": "Years of experience raise the baseline fit score when they are non-zero.",
        }
    )
    importances.append(
        {
            "feature": "job_role",
            "value": job_role,
            "importance": 0.55 if job_role else 0.0,
            "reason": "Target role changes how extracted skills are interpreted by the feature builder.",
        }
    )

    for skill in skills[:6]:
        importances.append(
            {
                "feature": "skill",
                "value": skill,
                "importance": 0.45,
                "reason": f"Detected skill '{skill}' contributes to text and role-fit signals.",
            }
        )

    return sorted(importances, key=lambda item: float(item["importance"]), reverse=True)
