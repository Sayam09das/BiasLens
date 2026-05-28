"""Run lightweight ablation experiments for the baseline pipeline."""

from __future__ import annotations

import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from training.train_baseline_model import build_pipeline, clean_dataset, load_dataset


OUTPUT_PATH = ROOT / "artifacts" / "metrics" / "ablation_study.json"


def main() -> None:
    """Write a first-pass ablation plan around the current baseline pipeline."""
    _ = build_pipeline()
    dataset = clean_dataset(load_dataset())
    payload = {
        "status": "scaffolded",
        "dataset_rows": int(len(dataset)),
        "planned_ablations": [
            "remove ai_score feature",
            "remove job_role feature",
            "text-only tfidf baseline",
            "numeric-only baseline",
        ],
    }
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
    print(f"Saved ablation scaffold to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
