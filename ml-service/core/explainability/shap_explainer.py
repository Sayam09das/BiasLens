"""SHAP integration with a safe fallback for the current ML service."""

from __future__ import annotations

import json
import pickle
from pathlib import Path

import numpy as np

from core.explainability.feature_importance import estimate_feature_importance

try:
    import shap  # type: ignore
except Exception:  # pragma: no cover - optional dependency fallback
    shap = None


ROOT = Path(__file__).resolve().parents[2]
VERSIONS_PATH = ROOT / "artifacts" / "versions.json"
DEFAULT_SHAP_ARTIFACT_PATH = ROOT / "artifacts" / "explainers" / "shap-explainer-v1.pkl"


def load_active_shap_artifact() -> dict[str, object] | None:
    """Load the active SHAP artifact metadata when present."""
    artifact_path = _get_active_shap_artifact_path()
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


def save_shap_artifact(
    *,
    model,
    sample_frame,
    output_path: Path = DEFAULT_SHAP_ARTIFACT_PATH,
) -> Path:
    """Persist the feature-name metadata needed for real SHAP explanations."""
    pipeline = getattr(model, "artifact", model)
    preprocessor = pipeline.named_steps["preprocessor"]
    feature_names = _extract_feature_names(preprocessor)

    artifact = {
        "model_name": getattr(model, "model_name", "unknown"),
        "feature_names": feature_names,
        "sample_rows": int(len(sample_frame)),
        "artifact_type": "tree_shap_metadata",
        "status": "ready",
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("wb") as handle:
        pickle.dump(artifact, handle)
    return output_path


def build_shap_like_explanation(
    *,
    model,
    extracted_features: dict[str, object],
    input_frame=None,
    explainer_artifact: dict[str, object] | None = None,
) -> dict[str, object]:
    """Return a real SHAP explanation when possible, otherwise a safe fallback."""
    if shap is None:
        return _build_fallback_explanation(
            model=model,
            extracted_features=extracted_features,
            message="The 'shap' package is not installed, so heuristic contribution estimates are being used instead.",
        )

    if input_frame is None:
        return _build_fallback_explanation(
            model=model,
            extracted_features=extracted_features,
            message="No prepared input frame was provided for SHAP computation, so heuristic estimates are being used instead.",
        )

    artifact = explainer_artifact or load_active_shap_artifact()
    if not artifact:
        return _build_fallback_explanation(
            model=model,
            extracted_features=extracted_features,
            message="No saved SHAP explainer artifact was found, so heuristic contribution estimates are being used instead.",
        )

    try:
        pipeline = getattr(model, "artifact", model)
        preprocessor = pipeline.named_steps["preprocessor"]
        classifier = pipeline.named_steps["classifier"]
        transformed = preprocessor.transform(input_frame)
        transformed_dense = _to_dense_matrix(transformed).astype(float)
        feature_names = artifact.get("feature_names") or preprocessor.get_feature_names_out().tolist()

        explainer = shap.TreeExplainer(classifier)
        shap_values = explainer.shap_values(transformed_dense)
        shap_vector = _extract_shap_vector(shap_values, getattr(model, "classes_", []))
        transformed_vector = transformed_dense[0]
        contributions = _build_contributions(
            feature_names=feature_names,
            transformed_vector=transformed_vector,
            shap_vector=shap_vector,
        )

        return {
            "method": "tree_shap",
            "available": True,
            "message": "Real SHAP values were computed from the active model and saved explainer metadata.",
            "feature_contributions": contributions,
            "model_name": getattr(model, "model_name", "unknown"),
        }
    except Exception as exc:  # pragma: no cover - runtime fallback path
        return _build_fallback_explanation(
            model=model,
            extracted_features=extracted_features,
            message=f"Real SHAP computation failed ({exc}); heuristic contribution estimates are being used instead.",
        )


def _build_fallback_explanation(
    *,
    model,
    extracted_features: dict[str, object],
    message: str,
) -> dict[str, object]:
    return {
        "method": "shap_like_fallback",
        "available": False,
        "message": message,
        "feature_contributions": estimate_feature_importance(extracted_features=extracted_features),
        "model_name": getattr(model, "model_name", "unknown"),
    }


def _get_active_shap_artifact_path() -> Path | None:
    if not VERSIONS_PATH.exists():
        return DEFAULT_SHAP_ARTIFACT_PATH if DEFAULT_SHAP_ARTIFACT_PATH.exists() else None

    with VERSIONS_PATH.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)

    explainer_info = payload.get("active", {}).get("explainer")
    if not isinstance(explainer_info, dict):
        return DEFAULT_SHAP_ARTIFACT_PATH if DEFAULT_SHAP_ARTIFACT_PATH.exists() else None

    relative_path = explainer_info.get("path")
    if not isinstance(relative_path, str) or not relative_path.strip():
        return DEFAULT_SHAP_ARTIFACT_PATH if DEFAULT_SHAP_ARTIFACT_PATH.exists() else None
    return ROOT / relative_path


def _extract_shap_vector(shap_values, classes: list[object]) -> np.ndarray:
    class_labels = [str(label) for label in classes]
    target_index = class_labels.index("Hire") if "Hire" in class_labels else min(len(class_labels) - 1, 0)

    if isinstance(shap_values, list):
        return np.asarray(shap_values[target_index][0])

    values = np.asarray(shap_values)
    if values.ndim == 3:
        return np.asarray(values[0, :, target_index])
    return np.asarray(values[0])


def _to_dense_vector(transformed) -> np.ndarray:
    if hasattr(transformed, "toarray"):
        dense = transformed.toarray()
    else:
        dense = np.asarray(transformed)
    return np.asarray(dense[0]).ravel()


def _to_dense_matrix(transformed) -> np.ndarray:
    """Convert sparse or matrix-like transformed features into a dense float array."""
    if hasattr(transformed, "toarray"):
        dense = transformed.toarray()
    else:
        dense = np.asarray(transformed)
    return np.asarray(dense)


def _build_contributions(
    *,
    feature_names,
    transformed_vector: np.ndarray,
    shap_vector: np.ndarray,
) -> list[dict[str, object]]:
    ranked_indices = np.argsort(np.abs(shap_vector))[::-1][:8]
    contributions: list[dict[str, object]] = []
    for index in ranked_indices:
        feature_name = str(feature_names[index]) if index < len(feature_names) else f"feature_{index}"
        contribution = float(shap_vector[index])
        direction = "positive" if contribution >= 0 else "negative"
        contributions.append(
            {
                "feature": feature_name,
                "value": round(float(transformed_vector[index]), 4),
                "importance": round(abs(contribution), 4),
                "reason": f"{direction.capitalize()} SHAP contribution toward the current prediction.",
            }
        )
    return contributions


def _extract_feature_names(preprocessor) -> list[str]:
    """Build stable feature names from the fitted column transformer."""
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
