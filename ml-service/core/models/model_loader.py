"""Artifact loading helpers with lightweight version metadata."""

from __future__ import annotations

from dataclasses import dataclass
import pickle
from pathlib import Path


@dataclass(frozen=True)
class ModelArtifactInfo:
    """Description of a saved model artifact on disk."""

    model_name: str
    version: str
    artifact_path: Path


DEFAULT_MODEL_ARTIFACT = ModelArtifactInfo(
    model_name="logistic_regression",
    version="v1",
    artifact_path=Path(__file__).resolve().parents[2]
    / "artifacts"
    / "models"
    / "baseline_resume_screening_model.pkl",
)


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
