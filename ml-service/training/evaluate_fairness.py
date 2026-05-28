"""Evaluate simple fairness metrics from the processed recruitment dataset.

Run manually from the project root:
    python3 ml-service/training/evaluate_fairness.py
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from core.fairness.report_generator import generate_fairness_report_payload

DATA_PATH = ROOT / "data" / "processed" / "recruitment_bias_clean.csv"
METRICS_DIR = ROOT / "artifacts" / "metrics"
OUTPUT_PATH = METRICS_DIR / "fairness_evaluation.json"


def load_dataset() -> pd.DataFrame:
    """Load the fairness analysis dataset."""
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded dataset: {DATA_PATH}")
    print(f"Shape: {df.shape[0]} rows x {df.shape[1]} columns")
    return df


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """Coerce data into the types needed for group-based fairness metrics."""
    cleaned = df.copy()
    cleaned["gender"] = cleaned["gender"].fillna("unknown").astype(str).str.lower()
    cleaned["age"] = pd.to_numeric(cleaned["age"], errors="coerce")
    cleaned["experience_years"] = pd.to_numeric(
        cleaned["experience_years"], errors="coerce"
    )
    cleaned["screening_score"] = pd.to_numeric(
        cleaned["screening_score"], errors="coerce"
    )
    cleaned["shortlisted"] = pd.to_numeric(cleaned["shortlisted"], errors="coerce")

    cleaned = cleaned.dropna(
        subset=["gender", "age", "experience_years", "screening_score", "shortlisted"]
    )
    cleaned["shortlisted"] = cleaned["shortlisted"].astype(int)

    print(f"Rows after cleaning: {len(cleaned)}")
    return cleaned


def add_age_groups(df: pd.DataFrame) -> pd.DataFrame:
    """Bucket ages so fairness can be viewed across broad age ranges."""
    enriched = df.copy()
    enriched["age_group"] = pd.cut(
        enriched["age"],
        bins=[0, 29, 39, 49, 120],
        labels=["18-29", "30-39", "40-49", "50+"],
        include_lowest=True,
    )
    return enriched


def build_report(df: pd.DataFrame) -> dict[str, object]:
    """Create a compact fairness summary for gender and age groups."""
    report = generate_fairness_report_payload(df)
    return {
        "dataset_rows": report["dataset_rows"],
        "overall_selection_rate": report["overall_selection_rate"],
        "by_gender": report["by_gender"],
        "by_age_group": report["by_age_group"],
        "gender_demographic_parity_difference": report["gender_demographic_parity_difference"],
        "age_demographic_parity_difference": report["age_demographic_parity_difference"],
        "gender_disparate_impact_ratio": report["gender_disparate_impact_ratio"],
        "age_disparate_impact_ratio": report["age_disparate_impact_ratio"],
    }


def save_report(report: dict[str, object]) -> None:
    """Persist the fairness summary for later reporting or API usage."""
    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(report, handle, indent=2)

    print("Fairness summary:")
    print(json.dumps(report, indent=2))
    print(f"Saved fairness report to: {OUTPUT_PATH}")


def main() -> None:
    df = load_dataset()
    cleaned = clean_dataset(df)
    enriched = add_age_groups(cleaned)
    report = build_report(enriched)
    save_report(report)


if __name__ == "__main__":
    main()
