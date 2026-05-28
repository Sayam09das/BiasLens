"""Cross-validation scaffold for the active baseline model."""

from __future__ import annotations

import json
from pathlib import Path
import sys

from sklearn.model_selection import StratifiedKFold, cross_val_score

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from training.train_baseline_model import build_pipeline, clean_dataset, load_dataset


OUTPUT_PATH = ROOT / "artifacts" / "metrics" / "cross_validation.json"


def main() -> None:
    """Run 5-fold accuracy cross-validation for the baseline pipeline."""
    df = clean_dataset(load_dataset())
    X = df[["Skills", "Experience (Years)", "Job Role", "AI Score (0-100)"]]
    y = df["Recruiter Decision"]

    pipeline = build_pipeline()
    splitter = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(pipeline, X, y, cv=splitter, scoring="accuracy")

    payload = {
        "fold_accuracies": [float(score) for score in scores],
        "mean_accuracy": float(scores.mean()),
        "std_accuracy": float(scores.std()),
    }
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
    print(f"Saved cross-validation results to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
