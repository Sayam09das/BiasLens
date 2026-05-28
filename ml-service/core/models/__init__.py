"""Model abstractions and loading utilities for the BiasLens ML pipeline."""

from core.models.ats_proxy import AtsProxyModel
from core.models.base_model import BaseResumeModel
from core.models.ensemble import EnsembleResumeModel
from core.models.logistic_model import LogisticResumeModel
from core.models.model_loader import ModelArtifactInfo, load_default_model_artifact
from core.models.model_registry import get_default_model, get_model_class, list_registered_models
from core.models.random_forest_model import RandomForestResumeModel
from core.models.svm_model import SvmResumeModel
from core.models.xgboost_model import XGBoostResumeModel

__all__ = [
    "AtsProxyModel",
    "BaseResumeModel",
    "EnsembleResumeModel",
    "LogisticResumeModel",
    "ModelArtifactInfo",
    "RandomForestResumeModel",
    "SvmResumeModel",
    "XGBoostResumeModel",
    "get_default_model",
    "get_model_class",
    "list_registered_models",
    "load_default_model_artifact",
]
