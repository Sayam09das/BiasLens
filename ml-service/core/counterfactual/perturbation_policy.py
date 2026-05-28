"""Rules for safe and bounded counterfactual perturbations."""

from __future__ import annotations


def get_default_perturbation_policy() -> dict[str, object]:
    """Return the default rules used when generating simple counterfactuals."""
    return {
        "max_skill_additions": 3,
        "max_skill_removals": 2,
        "allow_job_role_swap": True,
        "allow_experience_adjustment": True,
        "max_experience_delta": 2.0,
        "protected_attributes_locked": [
            "gender",
            "age",
            "name",
            "email",
            "phone",
            "location",
        ],
    }
