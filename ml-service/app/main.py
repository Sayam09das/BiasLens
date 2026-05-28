"""Minimal FastAPI app for baseline resume screening predictions."""

from __future__ import annotations

import json
from pathlib import Path
import sys

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.predictor import build_input_frame, load_model, predict_with_probabilities


app = FastAPI(title="BiasLens ML Service", version="0.1.0")
_model = None
FAIRNESS_REPORT_PATH = ROOT / "artifacts" / "metrics" / "fairness_evaluation.json"


class PredictionRequest(BaseModel):
    skills: str = Field(..., example="Python, SQL, Tableau, Machine Learning")
    experience_years: float = Field(..., ge=0, example=3)
    job_role: str = Field(..., example="Data Scientist")
    ai_score: float = Field(..., ge=0, le=100, example=82)


class PredictionResponse(BaseModel):
    prediction: str
    probabilities: dict[str, float] | None = None


class GroupMetric(BaseModel):
    rows: int
    selection_rate: float | None = None
    average_screening_score: float | None = None


class FairnessResponse(BaseModel):
    dataset_rows: int
    overall_selection_rate: float
    by_gender: dict[str, GroupMetric]
    by_age_group: dict[str, GroupMetric]
    gender_demographic_parity_difference: float
    age_demographic_parity_difference: float
    gender_disparate_impact_ratio: float | None = None
    age_disparate_impact_ratio: float | None = None


def get_model():
    """Load the model once and reuse it across requests."""
    global _model
    if _model is None:
        _model = load_model()
    return _model


def load_fairness_report() -> dict[str, object]:
    """Load the saved fairness report from disk."""
    if not FAIRNESS_REPORT_PATH.exists():
        raise FileNotFoundError(
            "Fairness report not found. Run "
            "'python3 ml-service/training/evaluate_fairness.py' first."
        )

    with FAIRNESS_REPORT_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


@app.get("/")
def root() -> dict[str, str]:
    """Simple metadata endpoint."""
    return {
        "service": "biaslens-ml-service",
        "status": "ready",
        "model": "baseline_resume_screening_model.pkl",
    }


@app.get("/health")
def health() -> dict[str, str]:
    """Quick health endpoint for local checks."""
    return {"status": "ok"}


@app.get("/fairness", response_model=FairnessResponse)
def fairness() -> FairnessResponse:
    """Return the latest saved fairness analysis."""
    try:
        report = load_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return FairnessResponse(**report)


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest) -> PredictionResponse:
    """Predict the recruiter decision from one resume-like payload."""
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
