"""Counterfactual analysis schemas."""

from pydantic import BaseModel, Field

from app.api.schemas.prediction_schema import PredictionResponse
from app.api.schemas.report_schema import TEXT_REPORT_REQUEST_EXAMPLE, ExtractedFeaturesResponse


COUNTERFACTUAL_RESPONSE_EXAMPLE = {
    "original_features": {
        "skills": "data analysis, machine learning, python, sql, tableau",
        "experience_years": 3.0,
        "job_role": "Data Scientist",
        "ai_score": 58.0,
    },
    "original_prediction": {
        "prediction": "Reject",
        "probabilities": {
            "Hire": 0.5617,
            "Reject": 0.4383
        }
    },
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
                "confidence_delta": 0.1804,
                "hire_probability_delta": 0.1804
            },
            "summary": "Added skills: statistics, scikit-learn. Increased experience by 1.0 year(s). new outcome: Hire."
        }
    ],
    "best_candidate_index": 0
}

UPLOAD_COUNTERFACTUAL_RESPONSE_EXAMPLE = {
    **COUNTERFACTUAL_RESPONSE_EXAMPLE,
    "source_filename": "resume.pdf",
    "extracted_resume_text_preview": "Experienced engineer with Python, SQL, React, Node.js, and machine learning project work..."
}


class CounterfactualRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_role: str = Field(..., json_schema_extra={"example": "Data Scientist"})

    model_config = {"json_schema_extra": {"example": TEXT_REPORT_REQUEST_EXAMPLE}}


class CounterfactualEvaluationResponse(BaseModel):
    outcome_changed: bool
    original_prediction: str
    counterfactual_prediction: str
    confidence_delta: float | None = None
    hire_probability_delta: float | None = None


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


class UploadCounterfactualResponse(CounterfactualResponse):
    source_filename: str
    extracted_resume_text_preview: str

    model_config = {"json_schema_extra": {"example": UPLOAD_COUNTERFACTUAL_RESPONSE_EXAMPLE}}
