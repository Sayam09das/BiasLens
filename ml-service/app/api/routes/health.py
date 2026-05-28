"""Health check endpoints."""

from fastapi import APIRouter


router = APIRouter(tags=["health"])


@router.get("/")
def root() -> dict[str, str]:
    return {
        "service": "biaslens-ml-service",
        "status": "ready",
        "model": "baseline_resume_screening_model.pkl",
    }


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
