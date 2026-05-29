"""Artifact loading helpers with lightweight version metadata."""

from __future__ import annotations

from dataclasses import dataclass
import json
import pickle
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
VERSIONS_PATH = ROOT / "artifacts" / "versions.json"


@dataclass(frozen=True)
class ModelArtifactInfo:
    """Description of a saved model artifact on disk."""

    model_name: str
    version: str
    artifact_path: Path
    wrapper_name: str | None = None


DEFAULT_MODEL_ARTIFACT = ModelArtifactInfo(
    model_name="logistic_regression",
    version="v1",
    artifact_path=ROOT / "artifacts" / "models" / "baseline_resume_screening_model.pkl",
    wrapper_name="logistic_regression",
)


def load_model_versions_metadata() -> dict:
    """Return raw versions metadata when available."""
    if not VERSIONS_PATH.exists():
        return {}

    with VERSIONS_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_model_artifact(info: ModelArtifactInfo):
    """Load a saved model artifact from disk."""
    if not info.artifact_path.exists():
        raise FileNotFoundError(
            f"Model artifact not found at {info.artifact_path}. "
            "Run the baseline training script first."
        )

    with info.artifact_path.open("rb") as handle:
        return pickle.load(handle)


def load_default_model_artifact():
    """Load the default saved model artifact used by the current API."""
    return load_model_artifact(DEFAULT_MODEL_ARTIFACT)


def load_active_model_info() -> ModelArtifactInfo:
    """Load the active model definition from versions.json when available."""
    payload = load_model_versions_metadata()
    if not payload:
        return DEFAULT_MODEL_ARTIFACT

    active_model = payload.get("active", {}).get("prediction_model")
    if not isinstance(active_model, dict):
        return DEFAULT_MODEL_ARTIFACT

    relative_path = active_model.get("path")
    if not isinstance(relative_path, str) or not relative_path.strip():
        return DEFAULT_MODEL_ARTIFACT

    return ModelArtifactInfo(
        model_name=str(active_model.get("name", DEFAULT_MODEL_ARTIFACT.model_name)),
        version=str(active_model.get("version", DEFAULT_MODEL_ARTIFACT.version)),
        artifact_path=ROOT / relative_path,
        wrapper_name=(
            str(active_model["wrapper_name"])
            if isinstance(active_model.get("wrapper_name"), str)
            else None
        ),
    )


def load_active_model_artifact():
    """Load the currently active model artifact from versions.json metadata."""
    return load_model_artifact(load_active_model_info())
