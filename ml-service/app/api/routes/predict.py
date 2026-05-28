"""Prediction endpoints."""

from fastapi import APIRouter, HTTPException

from app.api.schemas import (
    PREDICTION_RESPONSE_EXAMPLE,
    PredictionRequest,
    PredictionResponse,
)
from app.dependencies import get_model
from app.predictor import build_input_frame, predict_with_probabilities


router = APIRouter(tags=["predict"])


@router.post(
    "/predict",
    response_model=PredictionResponse,
    responses={
        200: {
            "description": "Prediction generated successfully",
            "content": {"application/json": {"example": PREDICTION_RESPONSE_EXAMPLE}},
        }
    },
)
def predict(request: PredictionRequest) -> PredictionResponse:
    try:
        model = get_model()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    input_df = build_input_frame(
        skills=request.skills,
        experience_years=request.experience_years,
        job_role=request.job_role,
        ai_score=request.ai_score,
    )
    result = predict_with_probabilities(model, input_df)
    return PredictionResponse(**result)
