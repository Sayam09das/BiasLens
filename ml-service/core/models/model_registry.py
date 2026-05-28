"""Registry of available model wrappers."""

from __future__ import annotations

from core.models.ats_proxy import AtsProxyModel
from core.models.logistic_model import LogisticResumeModel
from core.models.model_loader import DEFAULT_MODEL_ARTIFACT, load_default_model_artifact
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
    """Return the currently configured default wrapped model instance."""
    artifact = load_default_model_artifact()
    wrapper_class = get_model_class(DEFAULT_MODEL_ARTIFACT.model_name)
    return wrapper_class(artifact)
