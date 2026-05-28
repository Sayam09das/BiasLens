"""Report and comparison schemas."""

from pydantic import BaseModel, Field

from app.api.schemas.fairness_schema import FAIRNESS_RESPONSE_EXAMPLE, FairnessResponse
from app.api.schemas.prediction_schema import (
    PREDICTION_RESPONSE_EXAMPLE,
    PredictionResponse,
)


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


class ExtractedFeaturesResponse(BaseModel):
    skills: str
    experience_years: float
    job_role: str
    ai_score: float


class ReportResponse(BaseModel):
    prediction: PredictionResponse
    fairness: FairnessResponse

    model_config = {"json_schema_extra": {"example": REPORT_RESPONSE_EXAMPLE}}


class TextReportRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_role: str = Field(..., example="Data Scientist")

    model_config = {"json_schema_extra": {"example": TEXT_REPORT_REQUEST_EXAMPLE}}


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


class RoleComparisonRequest(BaseModel):
    resume_text: str = Field(..., min_length=20)
    job_roles: list[str] = Field(..., min_length=2, max_length=6)

    model_config = {"json_schema_extra": {"example": ROLE_COMPARISON_REQUEST_EXAMPLE}}


class RoleComparisonResponse(BaseModel):
    comparisons: list[RoleComparisonItem]
    fairness: FairnessResponse

    model_config = {"json_schema_extra": {"example": ROLE_COMPARISON_RESPONSE_EXAMPLE}}


class UploadRoleComparisonResponse(RoleComparisonResponse):
    source_filename: str
    extracted_resume_text_preview: str

    model_config = {"json_schema_extra": {"example": UPLOAD_ROLE_COMPARISON_RESPONSE_EXAMPLE}}
