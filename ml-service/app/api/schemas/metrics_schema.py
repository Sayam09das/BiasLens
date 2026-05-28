"""Runtime and artifact metrics schemas."""

from pydantic import BaseModel


METRICS_RESPONSE_EXAMPLE = {
    "service": "BiasLens ML Service",
    "version": "0.1.0",
    "status": "available",
    "model": {
        "name": "logistic_regression",
        "classes": ["Hire", "Reject"],
        "artifact_ready": True,
    },
    "cache": {
        "backend": "memory",
        "default_ttl_seconds": 300,
    },
    "artifacts": {
        "versions_file_present": True,
        "baseline_metrics_present": True,
        "fairness_report_present": True,
        "cross_validation_present": True,
        "manifest_present": True,
    },
    "saved_metrics": {
        "accuracy": 1.0,
        "weighted_f1": 1.0,
        "cross_validation_mean_accuracy": 0.996,
        "cross_validation_std_accuracy": 0.008,
        "fairness_dataset_rows": 2000,
        "overall_selection_rate": 0.4025,
    },
}


class ModelMetricsInfo(BaseModel):
    name: str
    classes: list[str]
    artifact_ready: bool


class CacheMetricsInfo(BaseModel):
    backend: str
    default_ttl_seconds: int


class ArtifactMetricsInfo(BaseModel):
    versions_file_present: bool
    baseline_metrics_present: bool
    fairness_report_present: bool
    cross_validation_present: bool
    manifest_present: bool


class SavedMetricsInfo(BaseModel):
    accuracy: float | None = None
    weighted_f1: float | None = None
    cross_validation_mean_accuracy: float | None = None
    cross_validation_std_accuracy: float | None = None
    fairness_dataset_rows: int | None = None
    overall_selection_rate: float | None = None


class MetricsResponse(BaseModel):
    service: str
    version: str
    status: str
    model: ModelMetricsInfo
    cache: CacheMetricsInfo
    artifacts: ArtifactMetricsInfo
    saved_metrics: SavedMetricsInfo

    model_config = {"json_schema_extra": {"example": METRICS_RESPONSE_EXAMPLE}}
