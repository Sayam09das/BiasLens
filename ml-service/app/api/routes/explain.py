"""Explainability endpoints."""

from fastapi import APIRouter, HTTPException

from app.api.schemas import (
    EXPLAIN_RESPONSE_EXAMPLE,
    ExplainRequest,
    ExplainResponse,
    ExtractedFeaturesResponse,
)
from app.api.services import build_features_from_resume_text
from app.dependencies import get_lime_explainer, get_model, get_shap_explainer
from app.predictor import build_input_frame, predict_with_probabilities
from core.explainability import (
    attribute_proxy_signals,
    build_lime_like_explanation,
    build_shap_like_explanation,
    format_prediction_explanation,
)

router = APIRouter(prefix="/explain", tags=["explain"])


@router.post(
    "",
    response_model=ExplainResponse,
    responses={
        200: {
            "description": "Prediction explanation generated successfully",
            "content": {"application/json": {"example": EXPLAIN_RESPONSE_EXAMPLE}},
        }
    },
)
def explain(request: ExplainRequest) -> ExplainResponse:
    try:
        model = get_model()
        shap_explainer = get_shap_explainer()
        lime_explainer = get_lime_explainer()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    extracted_features = build_features_from_resume_text(
        resume_text=request.resume_text,
        job_role=request.job_role,
    )
    input_df = build_input_frame(
        skills=str(extracted_features["skills"]),
        experience_years=float(extracted_features["experience_years"]),
        job_role=str(extracted_features["job_role"]),
        ai_score=float(extracted_features["ai_score"]),
    )
    prediction = predict_with_probabilities(model, input_df)
    shap_explanation = build_shap_like_explanation(
        model=model,
        extracted_features=extracted_features,
        input_frame=input_df,
        explainer_artifact=shap_explainer,
    )
    lime_explanation = build_lime_like_explanation(
        model=model,
        extracted_features=extracted_features,
        input_frame=input_df,
        explainer_artifact=lime_explainer,
    )
    proxy_attribution = attribute_proxy_signals(
        resume_text=request.resume_text,
        extracted_features=extracted_features,
    )
    formatted = format_prediction_explanation(
        prediction=prediction,
        shap_explanation=shap_explanation,
        lime_explanation=lime_explanation,
        proxy_attribution=proxy_attribution,
    )
    return ExplainResponse(
        prediction=formatted["prediction"],
        top_probability=formatted["top_probability"],
        extracted_features=ExtractedFeaturesResponse(**extracted_features),
        shap=formatted["shap"],
        lime=formatted["lime"],
        proxy_attribution=formatted["proxy_attribution"],
    )
