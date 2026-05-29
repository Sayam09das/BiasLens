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
        "method": "tree_shap",
        "available": True,
        "message": "Real SHAP values were computed from the active model and saved explainer metadata.",
        "feature_contributions": [
            {
                "feature": "numeric__AI Score (0-100)",
                "value": -1.2631,
                "importance": 0.5336,
                "reason": "Negative SHAP contribution toward the current prediction.",
            }
        ],
        "model_name": "random_forest",
    },
    "lime": {
        "method": "lime_tabular",
        "available": True,
        "message": "Real LIME local explanations were computed from the active model and saved explainer metadata.",
        "top_local_features": [
            {
                "feature": "numeric__AI Score (0-100) <= -1.00",
                "value": "numeric__AI Score (0-100) <= -1.00",
                "importance": 0.41,
                "reason": "Negative LIME contribution toward the local prediction.",
            }
        ],
        "model_name": "random_forest",
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
