"""Unit tests for model-layer helpers."""

from core.models.model_loader import load_model_versions_metadata
from core.models.model_registry import get_default_model


def test_versions_metadata_has_active_prediction_model() -> None:
    metadata = load_model_versions_metadata()
    assert "active" in metadata
    assert "prediction_model" in metadata["active"]


def test_default_model_exposes_predict_proba() -> None:
    model = get_default_model()
    assert hasattr(model, "predict_proba")
