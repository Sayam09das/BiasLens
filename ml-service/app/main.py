"""Minimal FastAPI app for baseline resume screening predictions."""

from __future__ import annotations

import json
from pathlib import Path
from tempfile import NamedTemporaryFile
import sys

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.model_utils import (
    estimate_ai_score,
    extract_experience_years,
    extract_skills_from_text,
    extract_text_from_resume_file,
)
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

ROLE_COMPARISON_REQUEST_EXAMPLE = {
    "resume_text": "Data Scientist with 3 years of experience in Python, SQL, Tableau, machine learning, and data analysis. Built dashboards and predictive models.",
    "job_roles": ["Data Scientist", "Full Stack Developer", "Machine Learning Engineer"],
}

ROLE_COMPARISON_RESPONSE_EXAMPLE = {
    "comparisons": [
        {
            "prediction": PREDICTION_RESPONSE_EXAMPLE,
            "extracted_features": {
                "skills": "data analysis, machine learning, python, sql, tableau",
                "experience_years": 3.0,
                "job_role": "Data Scientist",
                "ai_score": 72.0,
            },
        },
        {
            "prediction": {
                "prediction": "Hire",
                "probabilities": {"Hire": 0.8124, "Reject": 0.1876},
            },
            "extracted_features": {
                "skills": "javascript, next.js, node.js, python, react, sql, typescript",
                "experience_years": 3.0,
                "job_role": "Full Stack Developer",
                "ai_score": 78.0,
            },
        },
    ],
    "fairness": FAIRNESS_RESPONSE_EXAMPLE,
}

TEXT_REPORT_REQUEST_EXAMPLE = {
    "resume_text": "Data Scientist with 3 years of experience in Python, SQL, Tableau, machine learning, and data analysis. Built dashboards and predictive models.",
    "job_role": "Data Scientist",
}

TEXT_REPORT_RESPONSE_EXAMPLE = {
    "prediction": PREDICTION_RESPONSE_EXAMPLE,
    "fairness": FAIRNESS_RESPONSE_EXAMPLE,
    "extracted_features": {
        "skills": "data analysis, machine learning, python, sql, tableau",
        "experience_years": 3.0,
        "job_role": "Data Scientist",
        "ai_score": 72.0,
    },
}

UPLOAD_REPORT_RESPONSE_EXAMPLE = {
    **TEXT_REPORT_RESPONSE_EXAMPLE,
    "source_filename": "resume.docx",
    "extracted_resume_text_preview": "Experienced data scientist with 3 years of experience in Python, SQL, Tableau, and machine learning. Built dashboards and predictive models...",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


class TextReportRequest(BaseModel):
    resume_text: str = Field(
        ...,
        min_length=20,
        example="Data Scientist with 3 years of experience in Python, SQL, Tableau, and machine learning.",
    )
    job_role: str = Field(..., example="Data Scientist")

    model_config = {
        "json_schema_extra": {
            "example": TEXT_REPORT_REQUEST_EXAMPLE,
        }
    }


class RoleComparisonRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_roles: list[str] = Field(..., min_length=2, max_length=6)

    model_config = {
        "json_schema_extra": {
            "example": ROLE_COMPARISON_REQUEST_EXAMPLE,
        }
    }


class ExtractedFeaturesResponse(BaseModel):
    skills: str
    experience_years: float
    job_role: str
    ai_score: float


class TextReportResponse(BaseModel):
    prediction: PredictionResponse
    fairness: FairnessResponse
    extracted_features: ExtractedFeaturesResponse

    model_config = {
        "json_schema_extra": {
            "example": TEXT_REPORT_RESPONSE_EXAMPLE,
        }
    }


class UploadReportResponse(TextReportResponse):
    source_filename: str
    extracted_resume_text_preview: str

    model_config = {
        "json_schema_extra": {
            "example": UPLOAD_REPORT_RESPONSE_EXAMPLE,
        }
    }


class RoleComparisonItem(BaseModel):
    prediction: PredictionResponse
    extracted_features: ExtractedFeaturesResponse


class RoleComparisonResponse(BaseModel):
    comparisons: list[RoleComparisonItem]
    fairness: FairnessResponse

    model_config = {
        "json_schema_extra": {
            "example": ROLE_COMPARISON_RESPONSE_EXAMPLE,
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


def build_features_from_resume_text(
    *,
    resume_text: str,
    job_role: str,
) -> dict[str, object]:
    """Convert raw resume text into the structured fields used by the baseline model."""
    skills = extract_skills_from_text(resume_text)
    experience_years = extract_experience_years(resume_text)
    ai_score = estimate_ai_score(skills, experience_years, job_role)

    return {
        "skills": ", ".join(skills) if skills else "general experience",
        "experience_years": experience_years,
        "job_role": job_role,
        "ai_score": ai_score,
    }


def build_resume_text_preview(resume_text: str, limit: int = 320) -> str:
    """Return a trimmed preview of extracted resume text for debugging and trust."""
    compact = " ".join(resume_text.split())
    if len(compact) <= limit:
        return compact
    return f"{compact[:limit].rstrip()}..."


def build_report_payload_from_features(
    *,
    model,
    fairness_report: dict[str, object],
    extracted_features: dict[str, object],
) -> TextReportResponse:
    """Create a combined response after feature extraction has completed."""
    input_df = build_input_frame(
        skills=str(extracted_features["skills"]),
        experience_years=float(extracted_features["experience_years"]),
        job_role=str(extracted_features["job_role"]),
        ai_score=float(extracted_features["ai_score"]),
    )
    prediction_result = predict_with_probabilities(model, input_df)

    return TextReportResponse(
        prediction=PredictionResponse(**prediction_result),
        fairness=FairnessResponse(**fairness_report),
        extracted_features=ExtractedFeaturesResponse(**extracted_features),
    )


def build_prediction_from_features(model, extracted_features: dict[str, object]) -> RoleComparisonItem:
    """Return prediction and extracted features for one role-specific evaluation."""
    input_df = build_input_frame(
        skills=str(extracted_features["skills"]),
        experience_years=float(extracted_features["experience_years"]),
        job_role=str(extracted_features["job_role"]),
        ai_score=float(extracted_features["ai_score"]),
    )
    prediction_result = predict_with_probabilities(model, input_df)
    return RoleComparisonItem(
        prediction=PredictionResponse(**prediction_result),
        extracted_features=ExtractedFeaturesResponse(**extracted_features),
    )


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


@app.post(
    "/report-from-text",
    response_model=TextReportResponse,
    responses={
        200: {
            "description": "Combined report generated from raw resume text",
            "content": {
                "application/json": {
                    "example": TEXT_REPORT_RESPONSE_EXAMPLE,
                }
            },
        }
    },
)
def report_from_text(request: TextReportRequest) -> TextReportResponse:
    """Extract simple features from resume text, then return prediction and fairness."""
    try:
        model = get_model()
        fairness_report = load_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    extracted_features = build_features_from_resume_text(
        resume_text=request.resume_text,
        job_role=request.job_role,
    )
    return build_report_payload_from_features(
        model=model,
        fairness_report=fairness_report,
        extracted_features=extracted_features,
    )


@app.post(
    "/compare-roles",
    response_model=RoleComparisonResponse,
    responses={
        200: {
            "description": "Side-by-side role comparison for one resume",
            "content": {
                "application/json": {
                    "example": ROLE_COMPARISON_RESPONSE_EXAMPLE,
                }
            },
        }
    },
)
def compare_roles(request: RoleComparisonRequest) -> RoleComparisonResponse:
    """Compare the same resume text against multiple target roles."""
    try:
        model = get_model()
        fairness_report = load_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    cleaned_roles = []
    for role in request.job_roles:
        normalized = role.strip()
        if normalized and normalized not in cleaned_roles:
            cleaned_roles.append(normalized)

    if len(cleaned_roles) < 2:
        raise HTTPException(
            status_code=400,
            detail="Provide at least two distinct job roles for comparison.",
        )

    comparisons = []
    for role in cleaned_roles:
        extracted_features = build_features_from_resume_text(
            resume_text=request.resume_text,
            job_role=role,
        )
        comparisons.append(build_prediction_from_features(model, extracted_features))

    return RoleComparisonResponse(
        comparisons=comparisons,
        fairness=FairnessResponse(**fairness_report),
    )


@app.post(
    "/upload-resume",
    response_model=UploadReportResponse,
    responses={
        200: {
            "description": "Combined report generated from an uploaded resume file",
            "content": {
                "application/json": {
                    "example": UPLOAD_REPORT_RESPONSE_EXAMPLE,
                }
            },
        }
    },
)
async def upload_resume(
    file: UploadFile = File(...),
    job_role: str = Form(...),
) -> UploadReportResponse:
    """Extract resume text from an uploaded file, then return prediction and fairness."""
    try:
        model = get_model()
        fairness_report = load_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    filename = file.filename or "uploaded_resume"
    suffix = Path(filename).suffix.lower()
    if suffix not in {".pdf", ".docx", ".txt"}:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload a .pdf, .docx, or .txt resume.",
        )

    temp_path: Path | None = None
    try:
        file_bytes = await file.read()
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(file_bytes)
            temp_path = Path(temp_file.name)

        resume_text = extract_text_from_resume_file(temp_path)
        extracted_features = build_features_from_resume_text(
            resume_text=resume_text,
            job_role=job_role,
        )
        report_response = build_report_payload_from_features(
            model=model,
            fairness_report=fairness_report,
            extracted_features=extracted_features,
        )
        return UploadReportResponse(
            prediction=report_response.prediction,
            fairness=report_response.fairness,
            extracted_features=report_response.extracted_features,
            source_filename=filename,
            extracted_resume_text_preview=build_resume_text_preview(resume_text),
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc
    finally:
        if temp_path and temp_path.exists():
            temp_path.unlink(missing_ok=True)
