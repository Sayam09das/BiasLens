"""Evaluate simple fairness metrics from the processed recruitment dataset.

Run manually from the project root:
    python3 ml-service/training/evaluate_fairness.py
"""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
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


def compute_selection_rates(df: pd.DataFrame, column: str) -> dict[str, dict[str, float]]:
    """Measure how often each group is shortlisted."""
    results: dict[str, dict[str, float]] = {}
    grouped = df.groupby(column)

    for group_name, group_df in grouped:
        group_key = str(group_name)
        selection_rate = float(group_df["shortlisted"].mean())
        average_score = float(group_df["screening_score"].mean())
        results[group_key] = {
            "rows": int(len(group_df)),
            "selection_rate": selection_rate,
            "average_screening_score": average_score,
        }

    return results


def demographic_parity_difference(group_metrics: dict[str, dict[str, float]]) -> float:
    """Return max selection-rate gap between any two groups."""
    rates = [values["selection_rate"] for values in group_metrics.values()]
    return float(max(rates) - min(rates)) if rates else 0.0


def disparate_impact_ratio(group_metrics: dict[str, dict[str, float]]) -> float | None:
    """Return min/max selection-rate ratio as a simple disparate-impact signal."""
    rates = [values["selection_rate"] for values in group_metrics.values() if values["selection_rate"] > 0]
    if len(rates) < 2:
        return None
    return float(min(rates) / max(rates))


def build_report(df: pd.DataFrame) -> dict[str, object]:
    """Create a compact fairness summary for gender and age groups."""
    gender_metrics = compute_selection_rates(df, "gender")
    age_metrics = compute_selection_rates(df, "age_group")

    report = {
        "dataset_rows": int(len(df)),
        "overall_selection_rate": float(df["shortlisted"].mean()),
        "by_gender": gender_metrics,
        "by_age_group": age_metrics,
        "gender_demographic_parity_difference": demographic_parity_difference(
            gender_metrics
        ),
        "age_demographic_parity_difference": demographic_parity_difference(age_metrics),
        "gender_disparate_impact_ratio": disparate_impact_ratio(gender_metrics),
        "age_disparate_impact_ratio": disparate_impact_ratio(age_metrics),
    }
    return report


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
