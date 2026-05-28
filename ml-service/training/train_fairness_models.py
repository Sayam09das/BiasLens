"""Scaffold for fairness-aware model training."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "artifacts" / "metrics" / "fairness_model_training_plan.json"


def main() -> None:
    """Write a small plan artifact for future fairness-aware training runs."""
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "status": "not_implemented",
        "message": "Fairness-aware model training is scaffolded but not implemented yet.",
        "planned_approaches": [
            "reweighing",
            "threshold adjustment",
            "group-aware post-processing",
        ],
    }
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
    print(f"Saved fairness training scaffold to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
