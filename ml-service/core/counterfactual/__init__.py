"""Counterfactual generation utilities for resume and role-fit analysis."""

from core.counterfactual.attribute_swapper import apply_attribute_swaps
from core.counterfactual.evaluation import evaluate_counterfactual_result
from core.counterfactual.generator import generate_role_counterfactuals
from core.counterfactual.perturbation_policy import get_default_perturbation_policy
from core.counterfactual.prompt_templates import build_counterfactual_prompt
from core.counterfactual.semantic_validator import validate_counterfactual_text

__all__ = [
    "apply_attribute_swaps",
    "build_counterfactual_prompt",
    "evaluate_counterfactual_result",
    "generate_role_counterfactuals",
    "get_default_perturbation_policy",
    "validate_counterfactual_text",
]
