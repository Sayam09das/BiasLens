"""Schema package exports for the BiasLens ML service API."""

from app.api.schemas.error_schema import ErrorResponse
from app.api.schemas.fairness_schema import (
    FAIRNESS_RESPONSE_EXAMPLE,
    FairnessResponse,
    GroupMetric,
)
from app.api.schemas.health_schema import HealthResponse, RootResponse
from app.api.schemas.prediction_schema import (
    PREDICTION_REQUEST_EXAMPLE,
    PREDICTION_RESPONSE_EXAMPLE,
    PredictionRequest,
    PredictionResponse,
)
from app.api.schemas.report_schema import (
    REPORT_RESPONSE_EXAMPLE,
    ROLE_COMPARISON_REQUEST_EXAMPLE,
    ROLE_COMPARISON_RESPONSE_EXAMPLE,
    TEXT_REPORT_REQUEST_EXAMPLE,
    TEXT_REPORT_RESPONSE_EXAMPLE,
    UPLOAD_REPORT_RESPONSE_EXAMPLE,
    UPLOAD_ROLE_COMPARISON_RESPONSE_EXAMPLE,
    ExtractedFeaturesResponse,
    ReportResponse,
    RoleComparisonItem,
    RoleComparisonRequest,
    RoleComparisonResponse,
    RoleFitExplanation,
    TextReportRequest,
    TextReportResponse,
    UploadReportResponse,
    UploadRoleComparisonResponse,
)
from app.api.schemas.resume_schema import ParseUploadResponse

__all__ = [
    "ErrorResponse",
    "FAIRNESS_RESPONSE_EXAMPLE",
    "FairnessResponse",
    "GroupMetric",
    "HealthResponse",
    "RootResponse",
    "PREDICTION_REQUEST_EXAMPLE",
    "PREDICTION_RESPONSE_EXAMPLE",
    "PredictionRequest",
    "PredictionResponse",
    "REPORT_RESPONSE_EXAMPLE",
    "ROLE_COMPARISON_REQUEST_EXAMPLE",
    "ROLE_COMPARISON_RESPONSE_EXAMPLE",
    "TEXT_REPORT_REQUEST_EXAMPLE",
    "TEXT_REPORT_RESPONSE_EXAMPLE",
    "UPLOAD_REPORT_RESPONSE_EXAMPLE",
    "UPLOAD_ROLE_COMPARISON_RESPONSE_EXAMPLE",
    "ExtractedFeaturesResponse",
    "ParseUploadResponse",
    "ReportResponse",
    "RoleComparisonItem",
    "RoleComparisonRequest",
    "RoleComparisonResponse",
    "RoleFitExplanation",
    "TextReportRequest",
    "TextReportResponse",
    "UploadReportResponse",
    "UploadRoleComparisonResponse",
]
