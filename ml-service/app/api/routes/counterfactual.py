"""Counterfactual endpoints."""

from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.api.schemas import (
    COUNTERFACTUAL_RESPONSE_EXAMPLE,
    CounterfactualCandidateResponse,
    CounterfactualEvaluationResponse,
    CounterfactualRequest,
    CounterfactualResponse,
    ExtractedFeaturesResponse,
    PredictionResponse,
    UPLOAD_COUNTERFACTUAL_RESPONSE_EXAMPLE,
    UploadCounterfactualResponse,
)
from app.api.services import build_features_from_resume_text, build_resume_text_preview
from app.dependencies import get_model
from app.model_utils import extract_text_from_resume_file
from app.predictor import build_input_frame, predict_with_probabilities
from core.counterfactual import generate_role_counterfactuals
from core.counterfactual.evaluation import evaluate_counterfactual_result

router = APIRouter(prefix="/counterfactual", tags=["counterfactual"])


@router.post(
    "",
    response_model=CounterfactualResponse,
    responses={
        200: {
            "description": "Counterfactual candidates generated successfully",
            "content": {"application/json": {"example": COUNTERFACTUAL_RESPONSE_EXAMPLE}},
        }
    },
)
def counterfactual(request: CounterfactualRequest) -> CounterfactualResponse:
    try:
        model = get_model()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return _build_counterfactual_response(
        model=model,
        resume_text=request.resume_text,
        job_role=request.job_role,
    )


@router.post(
    "/upload",
    response_model=UploadCounterfactualResponse,
    responses={
        200: {
            "description": "Counterfactual candidates generated from an uploaded resume file",
            "content": {"application/json": {"example": UPLOAD_COUNTERFACTUAL_RESPONSE_EXAMPLE}},
        }
    },
)
async def counterfactual_upload(
    file: UploadFile = File(...),
    job_role: str = Form(...),
) -> UploadCounterfactualResponse:
    try:
        model = get_model()
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
        response = _build_counterfactual_response(
            model=model,
            resume_text=resume_text,
            job_role=job_role,
        )
        return UploadCounterfactualResponse(
            original_features=response.original_features,
            original_prediction=response.original_prediction,
            candidates=response.candidates,
            best_candidate_index=response.best_candidate_index,
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


def _build_counterfactual_response(
    *,
    model,
    resume_text: str,
    job_role: str,
) -> CounterfactualResponse:
    """Build the counterfactual response for either text or uploaded resume input."""

    original_features = build_features_from_resume_text(
        resume_text=resume_text,
        job_role=job_role,
    )
    original_input_df = build_input_frame(
        skills=str(original_features["skills"]),
        experience_years=float(original_features["experience_years"]),
        job_role=str(original_features["job_role"]),
        ai_score=float(original_features["ai_score"]),
    )
    original_prediction = predict_with_probabilities(model, original_input_df)

    generated_candidates = generate_role_counterfactuals(
        extracted_features=original_features,
        target_role=job_role,
    )

    response_candidates: list[CounterfactualCandidateResponse] = []
    best_candidate_index: int | None = None
    best_improvement_score = float("-inf")
    original_probabilities = original_prediction.get("probabilities") or {}
    original_hire_score = (
        float(original_probabilities.get("Hire", 0.0))
        if isinstance(original_probabilities, dict)
        else 0.0
    )

    for index, candidate_features in enumerate(generated_candidates):
        candidate_input_df = build_input_frame(
            skills=str(candidate_features["skills"]),
            experience_years=float(candidate_features["experience_years"]),
            job_role=str(candidate_features["job_role"]),
            ai_score=float(candidate_features["ai_score"]),
        )
        candidate_prediction = predict_with_probabilities(model, candidate_input_df)
        evaluation = evaluate_counterfactual_result(
            original_prediction=original_prediction,
            counterfactual_prediction=candidate_prediction,
        )

        probabilities = candidate_prediction.get("probabilities") or {}
        hire_score = float(probabilities.get("Hire", 0.0)) if isinstance(probabilities, dict) else 0.0
        hire_improvement = hire_score - original_hire_score
        outcome_changed = bool(evaluation.get("outcome_changed"))
        ranking_score = hire_improvement + (1.0 if outcome_changed else 0.0)
        if ranking_score > best_improvement_score:
            best_improvement_score = ranking_score
            best_candidate_index = index

        response_candidates.append(
            CounterfactualCandidateResponse(
                candidate_features=ExtractedFeaturesResponse(**candidate_features),
                prediction=PredictionResponse(**candidate_prediction),
                evaluation=CounterfactualEvaluationResponse(**evaluation),
                summary=_build_candidate_summary(
                    original_features=original_features,
                    candidate_features=candidate_features,
                    candidate_prediction=candidate_prediction,
                ),
            )
        )

    return CounterfactualResponse(
        original_features=ExtractedFeaturesResponse(**original_features),
        original_prediction=PredictionResponse(**original_prediction),
        candidates=response_candidates,
        best_candidate_index=best_candidate_index,
    )


def _build_candidate_summary(
    *,
    original_features: dict[str, object],
    candidate_features: dict[str, object],
    candidate_prediction: dict[str, object],
) -> str:
    original_skills = {
        skill.strip()
        for skill in str(original_features.get("skills", "")).split(",")
        if skill.strip()
    }
    candidate_skills = {
        skill.strip()
        for skill in str(candidate_features.get("skills", "")).split(",")
        if skill.strip()
    }
    added_skills = sorted(candidate_skills - original_skills)
    experience_delta = float(candidate_features.get("experience_years", 0.0)) - float(
        original_features.get("experience_years", 0.0)
    )
    decision = str(candidate_prediction.get("prediction", ""))

    parts: list[str] = []
    if added_skills:
        parts.append(f"Added skills: {', '.join(added_skills[:3])}")
    if experience_delta > 0:
        parts.append(f"Increased experience by {experience_delta:.1f} year(s)")
    if not parts:
        parts.append("Adjusted feature mix")
    parts.append(f"new outcome: {decision}")
    return ". ".join(parts) + "."
