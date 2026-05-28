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

FAIRNESS_RESPONSE_EXAMPLE = {
    "dataset_rows": 2000,
    "overall_selection_rate": 0.4025,
    "by_gender": {
        "female": {
            "rows": 984,
            "selection_rate": 0.42073170731707316,
            "average_screening_score": 70.3668024545096,
        },
        "male": {
            "rows": 1016,
            "selection_rate": 0.38484251968503935,
            "average_screening_score": 70.04126798138351,
        },
    },
    "by_age_group": {
        "18-29": {
            "rows": 613,
            "selection_rate": 0.3964110929853181,
            "average_screening_score": 70.28181058995548,
        },
        "30-39": {
            "rows": 686,
            "selection_rate": 0.4096209912536443,
            "average_screening_score": 70.00355587296603,
        },
        "40-49": {
            "rows": 701,
            "selection_rate": 0.4008559201141227,
            "average_screening_score": 70.32478268734046,
        },
        "50+": {
            "rows": 0,
            "selection_rate": None,
            "average_screening_score": None,
        },
    },
    "gender_demographic_parity_difference": 0.0358891876320338,
    "age_demographic_parity_difference": 0.013209898268326192,
    "gender_disparate_impact_ratio": 0.9146981627296588,
    "age_disparate_impact_ratio": 0.9677509245122001,
}

REPORT_RESPONSE_EXAMPLE = {
    "prediction": PREDICTION_RESPONSE_EXAMPLE,
    "fairness": FAIRNESS_RESPONSE_EXAMPLE,
}


class PredictionRequest(BaseModel):
    skills: str = Field(..., example="Python, SQL, Tableau, Machine Learning")
    experience_years: float = Field(..., ge=0, example=3)
    job_role: str = Field(..., example="Data Scientist")
    ai_score: float = Field(..., ge=0, le=100, example=82)

    model_config = {
        "json_schema_extra": {
            "example": PREDICTION_REQUEST_EXAMPLE,
        }
    }


class PredictionResponse(BaseModel):
    prediction: str
    probabilities: dict[str, float] | None = None

    model_config = {
        "json_schema_extra": {
            "example": PREDICTION_RESPONSE_EXAMPLE,
        }
    }


class GroupMetric(BaseModel):
    rows: int
    selection_rate: float | None = None
    average_screening_score: float | None = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "rows": 984,
                "selection_rate": 0.42073170731707316,
                "average_screening_score": 70.3668024545096,
            }
        }
    }


class FairnessResponse(BaseModel):
    dataset_rows: int
    overall_selection_rate: float
    by_gender: dict[str, GroupMetric]
    by_age_group: dict[str, GroupMetric]
    gender_demographic_parity_difference: float
    age_demographic_parity_difference: float
    gender_disparate_impact_ratio: float | None = None
    age_disparate_impact_ratio: float | None = None

    model_config = {
        "json_schema_extra": {
            "example": FAIRNESS_RESPONSE_EXAMPLE,
        }
    }


class ReportResponse(BaseModel):
    prediction: PredictionResponse
    fairness: FairnessResponse

    model_config = {
        "json_schema_extra": {
            "example": REPORT_RESPONSE_EXAMPLE,
        }
    }


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


@app.get(
    "/fairness",
    response_model=FairnessResponse,
    responses={
        200: {
            "description": "Latest saved fairness analysis",
            "content": {
                "application/json": {
                    "example": FAIRNESS_RESPONSE_EXAMPLE,
                }
            },
        }
    },
)
def fairness() -> FairnessResponse:
    """Return the latest saved fairness analysis."""
    try:
        report = load_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return FairnessResponse(**report)


@app.post(
    "/predict",
    response_model=PredictionResponse,
    responses={
        200: {
            "description": "Prediction generated successfully",
            "content": {
                "application/json": {
                    "example": PREDICTION_RESPONSE_EXAMPLE,
                }
            },
        }
    },
)
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


@app.post(
    "/report",
    response_model=ReportResponse,
    responses={
        200: {
            "description": "Combined prediction and fairness report",
            "content": {
                "application/json": {
                    "example": REPORT_RESPONSE_EXAMPLE,
                }
            },
        }
    },
)
def report(request: PredictionRequest) -> ReportResponse:
    """Return a combined payload with prediction output and fairness context."""
    try:
        model = get_model()
        fairness_report = load_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    input_df = build_input_frame(
        skills=request.skills,
        experience_years=request.experience_years,
        job_role=request.job_role,
        ai_score=request.ai_score,
    )
    prediction_result = predict_with_probabilities(model, input_df)

    return ReportResponse(
        prediction=PredictionResponse(**prediction_result),
        fairness=FairnessResponse(**fairness_report),
    )
