"""Report generation endpoints."""

from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.api.schemas import (
    FairnessResponse,
    REPORT_RESPONSE_EXAMPLE,
    ROLE_COMPARISON_RESPONSE_EXAMPLE,
    TEXT_REPORT_RESPONSE_EXAMPLE,
    UPLOAD_REPORT_RESPONSE_EXAMPLE,
    UPLOAD_ROLE_COMPARISON_RESPONSE_EXAMPLE,
    ReportResponse,
    RoleComparisonRequest,
    RoleComparisonResponse,
    TextReportRequest,
    TextReportResponse,
    UploadReportResponse,
    UploadRoleComparisonResponse,
)
from app.api.services import (
    build_features_from_resume_text,
    build_prediction_from_features,
    build_report_payload_from_features,
    build_resume_text_preview,
    clean_distinct_roles,
)
from app.dependencies import get_fairness_report, get_model
from app.model_utils import extract_text_from_resume_file


router = APIRouter(tags=["report"])


@router.post(
    "/report",
    response_model=ReportResponse,
    responses={
        200: {
            "description": "Combined prediction and fairness report",
            "content": {"application/json": {"example": REPORT_RESPONSE_EXAMPLE}},
        }
    },
)
def report(request: TextReportRequest) -> ReportResponse:
    try:
        model = get_model()
        fairness_report = get_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    extracted_features = build_features_from_resume_text(
        resume_text=request.resume_text,
        job_role=request.job_role,
    )
    report_payload = build_report_payload_from_features(
        model=model,
        fairness_report=fairness_report,
        extracted_features=extracted_features,
    )
    return ReportResponse(
        prediction=report_payload.prediction,
        fairness=report_payload.fairness,
    )


@router.post(
    "/report-from-text",
    response_model=TextReportResponse,
    responses={
        200: {
            "description": "Combined report generated from raw resume text",
            "content": {"application/json": {"example": TEXT_REPORT_RESPONSE_EXAMPLE}},
        }
    },
)
def report_from_text(request: TextReportRequest) -> TextReportResponse:
    try:
        model = get_model()
        fairness_report = get_fairness_report()
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


@router.post(
    "/compare-roles",
    response_model=RoleComparisonResponse,
    responses={
        200: {
            "description": "Side-by-side role comparison for one resume",
            "content": {"application/json": {"example": ROLE_COMPARISON_RESPONSE_EXAMPLE}},
        }
    },
)
def compare_roles(request: RoleComparisonRequest) -> RoleComparisonResponse:
    try:
        model = get_model()
        fairness_report = get_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    cleaned_roles = clean_distinct_roles(request.job_roles)
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


@router.post(
    "/compare-upload-resume",
    response_model=UploadRoleComparisonResponse,
    responses={
        200: {
            "description": "Side-by-side role comparison for an uploaded resume file",
            "content": {"application/json": {"example": UPLOAD_ROLE_COMPARISON_RESPONSE_EXAMPLE}},
        }
    },
)
async def compare_upload_resume(
    file: UploadFile = File(...),
    job_roles: str = Form(...),
) -> UploadRoleComparisonResponse:
    try:
        model = get_model()
        fairness_report = get_fairness_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    filename = file.filename or "uploaded_resume"
    suffix = Path(filename).suffix.lower()
    if suffix not in {".pdf", ".docx", ".txt"}:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload a .pdf, .docx, or .txt resume.",
        )

    cleaned_roles = clean_distinct_roles(job_roles.split(","))
    if len(cleaned_roles) < 2:
        raise HTTPException(
            status_code=400,
            detail="Provide at least two distinct job roles for comparison.",
        )

    temp_path: Path | None = None
    try:
        file_bytes = await file.read()
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(file_bytes)
            temp_path = Path(temp_file.name)

        resume_text = extract_text_from_resume_file(temp_path)
        comparisons = []
        for role in cleaned_roles:
            extracted_features = build_features_from_resume_text(
                resume_text=resume_text,
                job_role=role,
            )
            comparisons.append(build_prediction_from_features(model, extracted_features))

        return UploadRoleComparisonResponse(
            comparisons=comparisons,
            fairness=FairnessResponse(**fairness_report),
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


@router.post(
    "/upload-resume",
    response_model=UploadReportResponse,
    responses={
        200: {
            "description": "Combined report generated from an uploaded resume file",
            "content": {"application/json": {"example": UPLOAD_REPORT_RESPONSE_EXAMPLE}},
        }
    },
)
async def upload_resume(
    file: UploadFile = File(...),
    job_role: str = Form(...),
) -> UploadReportResponse:
    try:
        model = get_model()
        fairness_report = get_fairness_report()
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
