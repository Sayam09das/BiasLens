"""LIME integration with a safe fallback for the current ML service."""

from __future__ import annotations

import json
import pickle
from pathlib import Path

import numpy as np

from core.explainability.feature_importance import estimate_feature_importance

try:
    from lime.lime_tabular import LimeTabularExplainer  # type: ignore
except Exception:  # pragma: no cover - optional dependency fallback
    LimeTabularExplainer = None


ROOT = Path(__file__).resolve().parents[2]
VERSIONS_PATH = ROOT / "artifacts" / "versions.json"
DEFAULT_LIME_ARTIFACT_PATH = ROOT / "artifacts" / "explainers" / "lime-explainer-v1.pkl"


def load_active_lime_artifact() -> dict[str, object] | None:
    """Load the active LIME artifact metadata when present."""
    artifact_path = _get_active_lime_artifact_path()
    if artifact_path is None or not artifact_path.exists():
        return None
    if artifact_path.stat().st_size == 0:
        return None

    try:
        with artifact_path.open("rb") as handle:
            artifact = pickle.load(handle)
    except (EOFError, pickle.UnpicklingError):
        return None
    return artifact if isinstance(artifact, dict) else None


def save_lime_artifact(
    *,
    model,
    sample_frame,
    output_path: Path = DEFAULT_LIME_ARTIFACT_PATH,
) -> Path:
    """Persist the transformed background data needed for real LIME explanations."""
    pipeline = getattr(model, "artifact", model)
    preprocessor = pipeline.named_steps["preprocessor"]
    transformed = preprocessor.transform(sample_frame)
    if hasattr(transformed, "toarray"):
        background = transformed.toarray()
    else:
        background = np.asarray(transformed)

    artifact = {
        "model_name": getattr(model, "model_name", "unknown"),
        "feature_names": _extract_feature_names(preprocessor),
        "background_data": np.asarray(background, dtype=float),
        "class_names": [str(label) for label in getattr(model, "classes_", [])],
        "status": "ready",
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("wb") as handle:
        pickle.dump(artifact, handle)
    return output_path


def build_lime_like_explanation(
    *,
    model,
    extracted_features: dict[str, object],
    input_frame=None,
    explainer_artifact: dict[str, object] | None = None,
) -> dict[str, object]:
    """Return a real LIME explanation when possible, otherwise a safe fallback."""
    if LimeTabularExplainer is None:
        return _build_fallback_explanation(
            model=model,
            extracted_features=extracted_features,
            message="The 'lime' package is not installed, so heuristic local explanations are being used instead.",
        )

    if input_frame is None:
        return _build_fallback_explanation(
            model=model,
            extracted_features=extracted_features,
            message="No prepared input frame was provided for LIME computation, so heuristic local explanations are being used instead.",
        )

    artifact = explainer_artifact or load_active_lime_artifact()
    if not artifact:
        return _build_fallback_explanation(
            model=model,
            extracted_features=extracted_features,
            message="No saved LIME explainer artifact was found, so heuristic local explanations are being used instead.",
        )

    try:
        pipeline = getattr(model, "artifact", model)
        preprocessor = pipeline.named_steps["preprocessor"]
        classifier = pipeline.named_steps["classifier"]
        transformed = preprocessor.transform(input_frame)
        instance = _to_dense_matrix(transformed).astype(float)[0]

        feature_names = artifact.get("feature_names") or []
        class_names = artifact.get("class_names") or [str(label) for label in getattr(model, "classes_", [])]
        background_data = np.asarray(artifact["background_data"], dtype=float)

        explainer = LimeTabularExplainer(
            training_data=background_data,
            feature_names=list(feature_names),
            class_names=list(class_names),
            discretize_continuous=False,
            mode="classification",
        )
        explanation = explainer.explain_instance(
            instance,
            classifier.predict_proba,
            num_features=min(5, len(feature_names)),
        )

        top_items = []
        for feature_text, weight in explanation.as_list():
            top_items.append(
                {
                    "feature": str(feature_text),
                    "value": str(feature_text),
                    "importance": round(abs(float(weight)), 4),
                    "reason": (
                        "Positive LIME contribution toward the local prediction."
                        if float(weight) >= 0
                        else "Negative LIME contribution toward the local prediction."
                    ),
                }
            )

        return {
            "method": "lime_tabular",
            "available": True,
            "message": "Real LIME local explanations were computed from the active model and saved explainer metadata.",
            "top_local_features": top_items,
            "model_name": getattr(model, "model_name", "unknown"),
        }
    except Exception as exc:  # pragma: no cover - runtime fallback path
        return _build_fallback_explanation(
            model=model,
            extracted_features=extracted_features,
            message=f"Real LIME computation failed ({exc}); heuristic local explanations are being used instead.",
        )


def _build_fallback_explanation(
    *,
    model,
    extracted_features: dict[str, object],
    message: str,
) -> dict[str, object]:
    top_items = estimate_feature_importance(extracted_features=extracted_features)[:5]
    return {
        "method": "lime_like_fallback",
        "available": False,
        "message": message,
        "top_local_features": top_items,
        "model_name": getattr(model, "model_name", "unknown"),
    }


def _get_active_lime_artifact_path() -> Path | None:
    if not VERSIONS_PATH.exists():
        return DEFAULT_LIME_ARTIFACT_PATH if DEFAULT_LIME_ARTIFACT_PATH.exists() else None

    with VERSIONS_PATH.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)

    explainer_info = payload.get("active", {}).get("lime_explainer")
    if not isinstance(explainer_info, dict):
        return DEFAULT_LIME_ARTIFACT_PATH if DEFAULT_LIME_ARTIFACT_PATH.exists() else None

    relative_path = explainer_info.get("path")
    if not isinstance(relative_path, str) or not relative_path.strip():
        return DEFAULT_LIME_ARTIFACT_PATH if DEFAULT_LIME_ARTIFACT_PATH.exists() else None
    return ROOT / relative_path


def _to_dense_matrix(transformed) -> np.ndarray:
    if hasattr(transformed, "toarray"):
        dense = transformed.toarray()
    else:
        dense = np.asarray(transformed)
    return np.asarray(dense)


def _extract_feature_names(preprocessor) -> list[str]:
    feature_names: list[str] = []

    text_pipeline = preprocessor.named_transformers_.get("text")
    if text_pipeline is not None:
        tfidf = text_pipeline.named_steps.get("tfidf")
        if tfidf is not None:
            feature_names.extend([f"text__{name}" for name in tfidf.get_feature_names_out()])

    numeric_columns = ["Experience (Years)", "AI Score (0-100)"]
    feature_names.extend([f"numeric__{name}" for name in numeric_columns])

    categorical_pipeline = preprocessor.named_transformers_.get("job_role_onehot")
    if categorical_pipeline is not None:
        onehot = categorical_pipeline.named_steps.get("onehot")
        if onehot is not None:
            feature_names.extend(
                [f"job_role_onehot__{name}" for name in onehot.get_feature_names_out(["Job Role"])]
            )

    return feature_names
