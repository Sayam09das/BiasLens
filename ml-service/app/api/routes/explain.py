"""Explainability endpoints placeholder."""

from fastapi import APIRouter


router = APIRouter(prefix="/explain", tags=["explain"])


@router.get("")
def explain_status() -> dict[str, str]:
    return {"status": "not_implemented", "message": "Explainability endpoints are not implemented yet."}
