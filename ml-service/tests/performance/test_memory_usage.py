"""Memory-usage placeholder smoke test."""

from core.models.model_registry import get_default_model


def test_default_model_loads_once() -> None:
    model = get_default_model()
    assert model is not None
