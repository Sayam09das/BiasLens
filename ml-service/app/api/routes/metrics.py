"""Metrics endpoint placeholder."""

from fastapi import APIRouter


router = APIRouter(tags=["metrics"])


@router.get("/metrics")
def metrics_status() -> dict[str, object]:
    return {
        "status": "available",
        "message": "Prometheus-style metrics are not wired yet.",
        "counters": {},
    }
