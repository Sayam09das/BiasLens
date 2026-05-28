"""Resume parsing input/output schemas."""

from pydantic import BaseModel

from app.api.schemas.report_schema import ExtractedFeaturesResponse


class ParseUploadResponse(BaseModel):
    source_filename: str
    extracted_resume_text_preview: str
    extracted_features: ExtractedFeaturesResponse
