"""Resume parsing endpoints."""

from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.api.schemas import (
    TEXT_REPORT_REQUEST_EXAMPLE,
    ExtractedFeaturesResponse,
    TextReportRequest,
)
from app.api.services import build_features_from_resume_text, build_resume_text_preview
from app.model_utils import extract_text_from_resume_file


router = APIRouter(tags=["parse"])


@router.post(
    "/parse-text",
    response_model=ExtractedFeaturesResponse,
    responses={
        200: {
            "description": "Extracted features generated from raw resume text",
            "content": {
                "application/json": {
                    "example": TEXT_REPORT_REQUEST_EXAMPLE,
                }
            },
        }
    },
)
def parse_text(request: TextReportRequest) -> ExtractedFeaturesResponse:
    extracted_features = build_features_from_resume_text(
        resume_text=request.resume_text,
        job_role=request.job_role,
    )
    return ExtractedFeaturesResponse(**extracted_features)


@router.post("/parse-upload")
async def parse_upload(
    file: UploadFile = File(...),
    job_role: str = Form(...),
) -> dict[str, object]:
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
        return {
            "source_filename": filename,
            "extracted_resume_text_preview": build_resume_text_preview(resume_text),
            "extracted_features": extracted_features,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc
    finally:
        if temp_path and temp_path.exists():
            temp_path.unlink(missing_ok=True)
