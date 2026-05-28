"""Prompt helpers for future LLM-based counterfactual generation."""

from __future__ import annotations


def build_counterfactual_prompt(
    *,
    resume_text: str,
    target_role: str,
    target_outcome: str = "Hire",
) -> str:
    """Build a deterministic prompt template for future LLM expansion."""
    return (
        "You are generating a minimal resume counterfactual.\n"
        f"Target role: {target_role}\n"
        f"Desired model outcome: {target_outcome}\n"
        "Modify only job-relevant qualifications or phrasing.\n"
        "Do not change personal identifiers or protected attributes.\n"
        "Return a concise edited resume summary.\n\n"
        "Original resume text:\n"
        f"{resume_text.strip()}\n"
    )
