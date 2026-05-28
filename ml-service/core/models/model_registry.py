"""Registry of available model wrappers."""

from __future__ import annotations

from core.models.ats_proxy import AtsProxyModel
from core.models.logistic_model import LogisticResumeModel
from core.models.model_loader import load_active_model_artifact, load_active_model_info
from core.models.random_forest_model import RandomForestResumeModel
from core.models.svm_model import SvmResumeModel
from core.models.xgboost_model import XGBoostResumeModel

MODEL_REGISTRY = {
    "ats_proxy": AtsProxyModel,
    "logistic_regression": LogisticResumeModel,
    "random_forest": RandomForestResumeModel,
    "svm": SvmResumeModel,
    "xgboost": XGBoostResumeModel,
}


def get_model_class(model_name: str):
    """Return the wrapper class for a registered model name."""
    normalized = model_name.strip().lower()
    if normalized not in MODEL_REGISTRY:
        raise KeyError(f"Unknown model '{model_name}'. Registered models: {', '.join(sorted(MODEL_REGISTRY))}")
    return MODEL_REGISTRY[normalized]


def list_registered_models() -> list[str]:
    """List registered model identifiers."""
    return sorted(MODEL_REGISTRY)


def get_default_model():
    """Return the currently configured active wrapped model instance."""
    model_info = load_active_model_info()
    artifact = load_active_model_artifact()
    wrapper_name = model_info.wrapper_name or _infer_wrapper_name(model_info.model_name)
    wrapper_class = get_model_class(wrapper_name)
    return wrapper_class(artifact)


def _infer_wrapper_name(model_name: str) -> str:
    """Infer the runtime wrapper name from saved model metadata."""
    normalized = model_name.strip().lower()
    aliases = {
        "baseline_resume_screening_model": "logistic_regression",
        "ats-model": "ats_proxy",
        "rf-model": "random_forest",
        "xgb-model": "xgboost",
        "svm-model": "svm",
    }
    return aliases.get(normalized, normalized)
