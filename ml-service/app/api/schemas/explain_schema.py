"""Explainability schemas."""

from pydantic import BaseModel, Field

from app.api.schemas.report_schema import (
    TEXT_REPORT_REQUEST_EXAMPLE,
    ExtractedFeaturesResponse,
)


EXPLAIN_RESPONSE_EXAMPLE = {
    "prediction": "Hire",
    "top_probability": {
        "label": "Hire",
        "score": 0.9969,
    },
    "extracted_features": {
        "skills": "data analysis, machine learning, python, sql, tableau",
        "experience_years": 3.0,
        "job_role": "Data Scientist",
        "ai_score": 72.0,
    },
    "shap": {
        "method": "shap_like_fallback",
        "available": False,
        "message": "True SHAP computation is not wired yet; returning heuristic contribution estimates instead.",
        "feature_contributions": [
            {
                "feature": "ai_score",
                "value": 72.0,
                "importance": 0.72,
                "reason": "The heuristic AI score is a direct strong signal in the baseline model input.",
            }
        ],
        "model_name": "logistic_regression",
    },
    "lime": {
        "method": "lime_like_fallback",
        "available": False,
        "message": "True LIME sampling is not wired yet; returning a local heuristic explanation instead.",
        "top_local_features": [
            {
                "feature": "ai_score",
                "value": 72.0,
                "importance": 0.72,
                "reason": "The heuristic AI score is a direct strong signal in the baseline model input.",
            }
        ],
        "model_name": "logistic_regression",
    },
    "proxy_attribution": {
        "proxy_signal_count": 0,
        "signals": [],
        "risk_summary": "No obvious proxy-sensitive signals were detected by the heuristic scanner.",
    },
}


class TopProbabilityResponse(BaseModel):
    label: str
    score: float


class FeatureContribution(BaseModel):
    feature: str
    value: str | float
    importance: float
    reason: str


class ExplainerMethodResponse(BaseModel):
    method: str
    available: bool
    message: str
    model_name: str


class ShapExplanationResponse(ExplainerMethodResponse):
    feature_contributions: list[FeatureContribution]


class LimeExplanationResponse(ExplainerMethodResponse):
    top_local_features: list[FeatureContribution]


class ProxySignalResponse(BaseModel):
    name: str
    value: str
    reason: str


class ProxyAttributionResponse(BaseModel):
    proxy_signal_count: int
    signals: list[ProxySignalResponse]
    risk_summary: str


class ExplainRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_role: str = Field(..., example="Data Scientist")

    model_config = {"json_schema_extra": {"example": TEXT_REPORT_REQUEST_EXAMPLE}}


class ExplainResponse(BaseModel):
    prediction: str
    top_probability: TopProbabilityResponse | None = None
    extracted_features: ExtractedFeaturesResponse
    shap: ShapExplanationResponse
    lime: LimeExplanationResponse
    proxy_attribution: ProxyAttributionResponse

    model_config = {"json_schema_extra": {"example": EXPLAIN_RESPONSE_EXAMPLE}}
