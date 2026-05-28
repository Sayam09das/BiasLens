"""Hyperparameter tuning scaffold for the baseline model."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "artifacts" / "metrics" / "hyperparameter_tuning_plan.json"


def main() -> None:
    """Persist a small tuning plan for the current baseline model family."""
    payload = {
        "status": "not_implemented",
        "search_space": {
            "classifier__C": [0.1, 1.0, 5.0, 10.0],
            "classifier__max_iter": [500, 1000, 2000],
            "preprocessor__text__tfidf__max_features": [500, 1000, 2000],
        },
        "strategy": "grid_search",
    }
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
    print(f"Saved hyperparameter tuning scaffold to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
