"""Export a SHAP explainer metadata artifact for the active model.

Run manually from the project root:
    python3 ml-service/training/export_shap_explainer.py
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from core.explainability.shap_explainer import save_shap_artifact  # noqa: E402
from core.models.model_registry import get_default_model  # noqa: E402
from training.train_baseline_model import clean_dataset, load_dataset  # noqa: E402

OUTPUT_PATH = ROOT / "artifacts" / "explainers" / "shap-explainer-v1.pkl"
VERSIONS_PATH = ROOT / "artifacts" / "versions.json"


def main() -> None:
    """Export SHAP metadata for the currently active model and mark it active."""
    model = get_default_model()
    df = clean_dataset(load_dataset())
    sample_frame = df[["Skills", "Experience (Years)", "Job Role", "AI Score (0-100)"]].head(64)

    saved_path = save_shap_artifact(
        model=model,
        sample_frame=sample_frame,
        output_path=OUTPUT_PATH,
    )
    print(f"Saved SHAP explainer artifact to: {saved_path}")
    promote_versions_metadata()


def promote_versions_metadata() -> None:
    """Mark the SHAP explainer artifact as active and ready."""
    if not VERSIONS_PATH.exists():
        raise FileNotFoundError(f"versions.json not found at {VERSIONS_PATH}")

    with VERSIONS_PATH.open("r", encoding="utf-8") as handle:
        versions = json.load(handle)

    versions.setdefault("active", {})
    versions["active"]["explainer"] = {
        "name": "shap-explainer",
        "version": "v1",
        "path": "artifacts/explainers/shap-explainer-v1.pkl",
        "status": "ready",
    }

    for explainer_info in versions.get("registered", {}).get("explainers", []):
        if explainer_info.get("name") == "shap-explainer":
            explainer_info["status"] = "ready"
            explainer_info["path"] = "artifacts/explainers/shap-explainer-v1.pkl"

    with VERSIONS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(versions, handle, indent=2)
        handle.write("\n")

    print(f"Updated active explainer metadata in: {VERSIONS_PATH}")


if __name__ == "__main__":
    main()
