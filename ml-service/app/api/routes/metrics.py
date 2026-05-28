"""Runtime and saved metrics endpoint."""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter

from app.api.schemas import METRICS_RESPONSE_EXAMPLE, MetricsResponse
from app.config import get_settings
from app.dependencies import get_model

router = APIRouter(tags=["metrics"])

ROOT = Path(__file__).resolve().parents[3]
ARTIFACTS_DIR = ROOT / "artifacts"
VERSIONS_PATH = ARTIFACTS_DIR / "versions.json"
BASELINE_METRICS_PATH = ARTIFACTS_DIR / "metrics" / "baseline_resume_screening_metrics.json"
FAIRNESS_REPORT_PATH = ARTIFACTS_DIR / "metrics" / "fairness_evaluation.json"
CROSS_VALIDATION_PATH = ARTIFACTS_DIR / "metrics" / "cross_validation.json"
MANIFEST_PATH = ARTIFACTS_DIR / "artifact_manifest.json"


@router.get(
    "/metrics",
    response_model=MetricsResponse,
    responses={
        200: {
            "description": "Runtime and saved metrics summary",
            "content": {"application/json": {"example": METRICS_RESPONSE_EXAMPLE}},
        }
    },
)
def metrics_status() -> MetricsResponse:
    settings = get_settings()
    model = get_model()

    baseline_metrics = _load_json_if_present(BASELINE_METRICS_PATH)
    fairness_report = _load_json_if_present(FAIRNESS_REPORT_PATH)
    cross_validation = _load_json_if_present(CROSS_VALIDATION_PATH)

    return MetricsResponse(
        service=settings.service_name,
        version=settings.service_version,
        status="available",
        model={
            "name": getattr(model, "model_name", "unknown"),
            "classes": [str(label) for label in getattr(model, "classes_", [])],
            "artifact_ready": True,
        },
        cache={
            "backend": settings.cache_backend,
            "default_ttl_seconds": settings.cache_default_ttl_seconds,
        },
        artifacts={
            "versions_file_present": VERSIONS_PATH.exists(),
            "baseline_metrics_present": BASELINE_METRICS_PATH.exists(),
            "fairness_report_present": FAIRNESS_REPORT_PATH.exists(),
            "cross_validation_present": CROSS_VALIDATION_PATH.exists(),
            "manifest_present": MANIFEST_PATH.exists(),
        },
        saved_metrics={
            "accuracy": _safe_float(baseline_metrics.get("accuracy")),
            "weighted_f1": _safe_float(baseline_metrics.get("weighted_f1")),
            "cross_validation_mean_accuracy": _safe_float(cross_validation.get("mean_accuracy")),
            "cross_validation_std_accuracy": _safe_float(cross_validation.get("std_accuracy")),
            "fairness_dataset_rows": _safe_int(fairness_report.get("dataset_rows")),
            "overall_selection_rate": _safe_float(fairness_report.get("overall_selection_rate")),
        },
    )


def _load_json_if_present(path: Path) -> dict[str, object]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _safe_float(value: object) -> float | None:
    if value is None:
        return None
    return float(value)


def _safe_int(value: object) -> int | None:
    if value is None:
        return None
    return int(value)
