"""Prediction input/output schemas."""

from pydantic import BaseModel, Field


PREDICTION_REQUEST_EXAMPLE = {
    "skills": "Python, SQL, Tableau, Machine Learning, Data Analysis",
    "experience_years": 3,
    "job_role": "Data Scientist",
    "ai_score": 82,
}

PREDICTION_RESPONSE_EXAMPLE = {
    "prediction": "Hire",
    "probabilities": {
        "Hire": 0.9969,
        "Reject": 0.0031,
    },
}


class PredictionRequest(BaseModel):
    skills: str = Field(..., example="Python, SQL, Tableau, Machine Learning")
    experience_years: float = Field(..., ge=0, example=3)
    job_role: str = Field(..., example="Data Scientist")
    ai_score: float = Field(..., ge=0, le=100, example=82)

    model_config = {"json_schema_extra": {"example": PREDICTION_REQUEST_EXAMPLE}}


class PredictionResponse(BaseModel):
    prediction: str
    probabilities: dict[str, float] | None = None

    model_config = {"json_schema_extra": {"example": PREDICTION_RESPONSE_EXAMPLE}}
