"""Comprehensive evaluation for the active baseline model."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASELINE_METRICS_PATH = ROOT / "artifacts" / "metrics" / "baseline_resume_screening_metrics.json"
FAIRNESS_METRICS_PATH = ROOT / "artifacts" / "metrics" / "fairness_evaluation.json"
OUTPUT_PATH = ROOT / "artifacts" / "metrics" / "comprehensive_evaluation.json"


def _load_json(path: Path) -> dict[str, object]:
    if not path.exists():
        raise FileNotFoundError(f"Missing required evaluation input: {path}")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def main() -> None:
    """Merge saved predictive and fairness metrics into one evaluation artifact."""
    baseline_metrics = _load_json(BASELINE_METRICS_PATH)
    fairness_metrics = _load_json(FAIRNESS_METRICS_PATH)

    payload = {
        "prediction_metrics": baseline_metrics,
        "fairness_metrics": fairness_metrics,
        "status": "ready",
    }
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
    print(f"Saved comprehensive evaluation to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
