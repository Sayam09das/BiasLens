"""Fairness metrics endpoints."""

from fastapi import APIRouter, HTTPException

from app.api.schemas import FAIRNESS_RESPONSE_EXAMPLE, FairnessResponse
from app.dependencies import get_fairness_report


router = APIRouter(tags=["fairness"])


@router.get(
    "/fairness",
    response_model=FairnessResponse,
    responses={
        200: {
            "description": "Latest saved fairness analysis",
            "content": {"application/json": {"example": FAIRNESS_RESPONSE_EXAMPLE}},
        }
    },
)
def fairness() -> FairnessResponse:
    try:
        report = get_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return FairnessResponse(**report)
