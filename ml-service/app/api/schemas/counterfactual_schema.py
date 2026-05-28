"""Counterfactual analysis schemas."""

from pydantic import BaseModel, Field

from app.api.schemas.prediction_schema import PREDICTION_RESPONSE_EXAMPLE, PredictionResponse
from app.api.schemas.report_schema import TEXT_REPORT_REQUEST_EXAMPLE, ExtractedFeaturesResponse


COUNTERFACTUAL_RESPONSE_EXAMPLE = {
    "original_features": {
        "skills": "data analysis, machine learning, python, sql, tableau",
        "experience_years": 3.0,
        "job_role": "Data Scientist",
        "ai_score": 58.0,
    },
    "original_prediction": PREDICTION_RESPONSE_EXAMPLE,
    "candidates": [
        {
            "candidate_features": {
                "skills": "data analysis, machine learning, python, sql, tableau, statistics, scikit-learn",
                "experience_years": 4.0,
                "job_role": "Data Scientist",
                "ai_score": 71.0,
            },
            "prediction": {
                "prediction": "Hire",
                "probabilities": {
                    "Hire": 0.7421,
                    "Reject": 0.2579
                }
            },
            "evaluation": {
                "outcome_changed": True,
                "original_prediction": "Reject",
                "counterfactual_prediction": "Hire",
                "confidence_delta": 0.1804
            },
            "summary": "Added skills: statistics, scikit-learn. Increased experience by 1.0 year(s). new outcome: Hire."
        }
    ],
    "best_candidate_index": 0
}


class CounterfactualRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_role: str = Field(..., example="Data Scientist")

    model_config = {"json_schema_extra": {"example": TEXT_REPORT_REQUEST_EXAMPLE}}


class CounterfactualEvaluationResponse(BaseModel):
    outcome_changed: bool
    original_prediction: str
    counterfactual_prediction: str
    confidence_delta: float | None = None


class CounterfactualCandidateResponse(BaseModel):
    candidate_features: ExtractedFeaturesResponse
    prediction: PredictionResponse
    evaluation: CounterfactualEvaluationResponse
    summary: str


class CounterfactualResponse(BaseModel):
    original_features: ExtractedFeaturesResponse
    original_prediction: PredictionResponse
    candidates: list[CounterfactualCandidateResponse]
    best_candidate_index: int | None = None

    model_config = {"json_schema_extra": {"example": COUNTERFACTUAL_RESPONSE_EXAMPLE}}
