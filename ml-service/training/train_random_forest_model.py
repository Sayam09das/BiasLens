"""Train a random forest screening model and promote it in versions.json.

Run manually from the project root:
    python3 ml-service/training/train_random_forest_model.py
"""

from __future__ import annotations

import json
import pickle
from pathlib import Path
import sys

from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from training.train_baseline_model import (  # noqa: E402
    ARTIFACTS_DIR,
    METRICS_DIR,
    clean_dataset,
    load_dataset,
    train_model,
)
from training.train_baseline_model import build_pipeline as build_baseline_pipeline  # noqa: E402

MODEL_PATH = ARTIFACTS_DIR / "rf-model-v1.pkl"
METRICS_PATH = METRICS_DIR / "rf-model-v1-metrics.json"
VERSIONS_PATH = ROOT / "artifacts" / "versions.json"


def build_pipeline() -> Pipeline:
    """Create a random-forest version of the screening pipeline."""
    pipeline = build_baseline_pipeline()
    pipeline.set_params(
        classifier=RandomForestClassifier(
            n_estimators=300,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
            random_state=42,
            n_jobs=-1,
        )
    )
    return pipeline


def save_outputs(model: Pipeline, metrics: dict[str, object]) -> None:
    """Persist the trained random forest pipeline and its metrics."""
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    METRICS_DIR.mkdir(parents=True, exist_ok=True)

    with MODEL_PATH.open("wb") as handle:
        pickle.dump(model, handle)

    with METRICS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(metrics, handle, indent=2)

    print(f"Saved random forest model to: {MODEL_PATH}")
    print(f"Saved random forest metrics to: {METRICS_PATH}")


def promote_versions_metadata() -> None:
    """Point the active model metadata at the newly trained random forest artifact."""
    if not VERSIONS_PATH.exists():
        raise FileNotFoundError(f"versions.json not found at {VERSIONS_PATH}")

    with VERSIONS_PATH.open("r", encoding="utf-8") as handle:
        versions = json.load(handle)

    versions.setdefault("active", {})
    versions["active"]["prediction_model"] = {
        "name": "rf-model",
        "wrapper_name": "random_forest",
        "version": "v1",
        "path": "artifacts/models/rf-model-v1.pkl",
        "status": "ready",
    }
    versions["active"]["metrics"] = {
        "name": "rf-model-metrics",
        "version": "v1",
        "path": "artifacts/metrics/rf-model-v1-metrics.json",
        "status": "ready",
    }

    for model_info in versions.get("registered", {}).get("models", []):
        if model_info.get("name") == "rf-model":
            model_info["status"] = "ready"
            model_info["wrapper_name"] = "random_forest"
            model_info["path"] = "artifacts/models/rf-model-v1.pkl"

    with VERSIONS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(versions, handle, indent=2)
        handle.write("\n")

    print(f"Updated active model metadata in: {VERSIONS_PATH}")


def main() -> None:
    """Train and persist the random forest model, then promote it in versions.json."""
    df = load_dataset()
    cleaned = clean_dataset(df)

    # Reuse the same train/test evaluation flow as the baseline model.
    model, metrics = train_model(cleaned, pipeline_builder=build_pipeline)
    save_outputs(model, metrics)
    promote_versions_metadata()


if __name__ == "__main__":
    main()
