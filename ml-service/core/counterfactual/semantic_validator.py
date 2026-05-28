"""Simple semantic checks for generated counterfactuals."""

from __future__ import annotations


def validate_counterfactual_text(
    *,
    original_text: str,
    candidate_text: str,
    minimum_length_ratio: float = 0.35,
) -> dict[str, object]:
    """Validate that a counterfactual remains non-empty and reasonably complete."""
    original_compact = " ".join(original_text.split())
    candidate_compact = " ".join(candidate_text.split())

    if not candidate_compact:
        return {"is_valid": False, "reason": "candidate text is empty"}

    if not original_compact:
        return {"is_valid": True, "reason": "no original baseline to compare"}

    length_ratio = len(candidate_compact) / max(len(original_compact), 1)
    if length_ratio < minimum_length_ratio:
        return {"is_valid": False, "reason": "candidate text removes too much source context"}

    return {"is_valid": True, "reason": "candidate text passed basic semantic checks"}
