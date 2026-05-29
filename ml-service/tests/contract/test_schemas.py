"""Schema import smoke tests."""

from app.api import schemas


def test_schema_module_exports_prediction_request() -> None:
    assert hasattr(schemas, "PredictionRequest")
