"""Pydantic schemas and OpenAPI examples for API routes."""

from __future__ import annotations

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
            "fit_explanation": {
                "summary": "Strongest alignment comes from core Data Scientist skills such as python, sql, machine learning.",
                "matched_strengths": ["python", "sql", "machine learning", "data analysis", "tableau"],
                "weaker_alignment": ["statistics", "scikit-learn"],
            },
        }
    ],
    "fairness": FAIRNESS_RESPONSE_EXAMPLE,
}

UPLOAD_REPORT_RESPONSE_EXAMPLE = {
    **TEXT_REPORT_RESPONSE_EXAMPLE,
    "source_filename": "resume.docx",
    "extracted_resume_text_preview": "Experienced data scientist with 3 years of experience in Python, SQL, Tableau, and machine learning. Built dashboards and predictive models...",
}

UPLOAD_ROLE_COMPARISON_RESPONSE_EXAMPLE = {
    **ROLE_COMPARISON_RESPONSE_EXAMPLE,
    "source_filename": "resume.pdf",
    "extracted_resume_text_preview": "Experienced engineer with Python, SQL, React, Node.js, and machine learning project work...",
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

    model_config = {"json_schema_extra": {"example": FAIRNESS_RESPONSE_EXAMPLE}}


class ReportResponse(BaseModel):
    prediction: PredictionResponse
    fairness: FairnessResponse

    model_config = {"json_schema_extra": {"example": REPORT_RESPONSE_EXAMPLE}}


class TextReportRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_role: str = Field(..., example="Data Scientist")

    model_config = {"json_schema_extra": {"example": TEXT_REPORT_REQUEST_EXAMPLE}}


class RoleComparisonRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_roles: list[str] = Field(..., min_length=2, max_length=6)

    model_config = {"json_schema_extra": {"example": ROLE_COMPARISON_REQUEST_EXAMPLE}}


class ExtractedFeaturesResponse(BaseModel):
    skills: str
    experience_years: float
    job_role: str
    ai_score: float


class TextReportResponse(BaseModel):
    prediction: PredictionResponse
    fairness: FairnessResponse
    extracted_features: ExtractedFeaturesResponse

    model_config = {"json_schema_extra": {"example": TEXT_REPORT_RESPONSE_EXAMPLE}}


class UploadReportResponse(TextReportResponse):
    source_filename: str
    extracted_resume_text_preview: str

    model_config = {"json_schema_extra": {"example": UPLOAD_REPORT_RESPONSE_EXAMPLE}}


class RoleFitExplanation(BaseModel):
    summary: str
    matched_strengths: list[str]
    weaker_alignment: list[str]


class RoleComparisonItem(BaseModel):
    prediction: PredictionResponse
    extracted_features: ExtractedFeaturesResponse
    fit_explanation: RoleFitExplanation


class RoleComparisonResponse(BaseModel):
    comparisons: list[RoleComparisonItem]
    fairness: FairnessResponse

    model_config = {"json_schema_extra": {"example": ROLE_COMPARISON_RESPONSE_EXAMPLE}}


class UploadRoleComparisonResponse(RoleComparisonResponse):
    source_filename: str
    extracted_resume_text_preview: str

    model_config = {"json_schema_extra": {"example": UPLOAD_ROLE_COMPARISON_RESPONSE_EXAMPLE}}
