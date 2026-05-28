"""Train a simple baseline screening model from the processed resume dataset.

Run manually from the project root:
    python3 ml-service/training/train_baseline_model.py
"""

from __future__ import annotations

import json
import pickle
from pathlib import Path

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer, OneHotEncoder, StandardScaler


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "processed" / "resume_screening_clean.csv"
ARTIFACTS_DIR = ROOT / "artifacts" / "models"
METRICS_DIR = ROOT / "artifacts" / "metrics"
MODEL_PATH = ARTIFACTS_DIR / "baseline_resume_screening_model.pkl"
METRICS_PATH = METRICS_DIR / "baseline_resume_screening_metrics.json"


def load_dataset() -> pd.DataFrame:
    """Load the prepared resume screening dataset."""
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded dataset: {DATA_PATH}")
    print(f"Shape: {df.shape[0]} rows x {df.shape[1]} columns")
    return df


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """Keep the columns needed for the first-pass model and remove bad rows."""
    selected = df[
        [
            "Skills",
            "Experience (Years)",
            "Job Role",
            "AI Score (0-100)",
            "Recruiter Decision",
        ]
    ].copy()

    selected["Skills"] = selected["Skills"].fillna("").astype(str)
    selected["Job Role"] = selected["Job Role"].fillna("Unknown").astype(str)
    selected["Experience (Years)"] = pd.to_numeric(
        selected["Experience (Years)"], errors="coerce"
    )
    selected["AI Score (0-100)"] = pd.to_numeric(
        selected["AI Score (0-100)"], errors="coerce"
    )
    selected["Recruiter Decision"] = selected["Recruiter Decision"].fillna("").astype(str)

    selected = selected[selected["Recruiter Decision"] != ""]
    selected = selected.dropna(subset=["Experience (Years)", "AI Score (0-100)"])

    print("After cleaning:")
    print(f"Remaining rows: {len(selected)}")
    print("Target distribution:")
    print(selected["Recruiter Decision"].value_counts().to_string())
    return selected


def build_pipeline() -> Pipeline:
    """Create a simple but explainable baseline model pipeline."""
    text_transformer = Pipeline(
        steps=[
            # Join text columns so one TF-IDF vectorizer can read the combined resume context.
            (
                "combine_text",
                FunctionTransformer(
                    lambda frame: (
                        frame["Skills"].fillna("") + " " + frame["Job Role"].fillna("")
                    ),
                    validate=False,
                ),
            ),
            ("tfidf", TfidfVectorizer(max_features=1000, ngram_range=(1, 2))),
        ]
    )

    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("text", text_transformer, ["Skills", "Job Role"]),
            ("numeric", numeric_transformer, ["Experience (Years)", "AI Score (0-100)"]),
            ("job_role_onehot", categorical_transformer, ["Job Role"]),
        ]
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(max_iter=1000)),
        ]
    )


def train_model(df: pd.DataFrame) -> tuple[Pipeline, dict[str, object]]:
    """Split the data, train the baseline, and collect simple metrics."""
    X = df[["Skills", "Experience (Years)", "Job Role", "AI Score (0-100)"]]
    y = df["Recruiter Decision"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    print(f"Train rows: {len(X_train)}")
    print(f"Test rows: {len(X_test)}")

    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    metrics = {
        "accuracy": accuracy_score(y_test, predictions),
        "weighted_f1": f1_score(y_test, predictions, average="weighted"),
        "labels": sorted(y.unique().tolist()),
        "classification_report": classification_report(
            y_test, predictions, output_dict=True
        ),
    }

    print("Evaluation:")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(f"Weighted F1: {metrics['weighted_f1']:.4f}")
    print(classification_report(y_test, predictions))

    return pipeline, metrics


def save_outputs(model: Pipeline, metrics: dict[str, object]) -> None:
    """Persist the trained pipeline and its metrics for later API use."""
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    METRICS_DIR.mkdir(parents=True, exist_ok=True)

    with MODEL_PATH.open("wb") as handle:
        pickle.dump(model, handle)

    with METRICS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(metrics, handle, indent=2)

    print(f"Saved model to: {MODEL_PATH}")
    print(f"Saved metrics to: {METRICS_PATH}")


def main() -> None:
    df = load_dataset()
    cleaned = clean_dataset(df)
    model, metrics = train_model(cleaned)
    save_outputs(model, metrics)


if __name__ == "__main__":
    main()
