"""Load the trained baseline model and run a sample prediction.

Run manually from the project root:
    python3 ml-service/app/predictor.py
"""

from __future__ import annotations

import pickle
from pathlib import Path
import sys

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "artifacts" / "models" / "baseline_resume_screening_model.pkl"

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.model_utils import combine_text_columns as _combine_text_columns  # noqa: F401


def load_model():
    """Load the trained baseline model pipeline from disk."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Trained model not found. Run "
            "'python3 ml-service/training/train_baseline_model.py' first."
        )

    with MODEL_PATH.open("rb") as handle:
        model = pickle.load(handle)

    print(f"Loaded model from: {MODEL_PATH}")
    return model


def build_input_frame(
    *,
    skills: str,
    experience_years: float,
    job_role: str,
    ai_score: float,
) -> pd.DataFrame:
    """Build one input row using the same columns seen during training."""
    return pd.DataFrame(
        [
            {
                "Skills": skills,
                "Experience (Years)": experience_years,
                "Job Role": job_role,
                "AI Score (0-100)": ai_score,
            }
        ]
    )


def build_sample_input() -> pd.DataFrame:
    """Build one sample row for local manual testing."""
    sample = build_input_frame(
        skills="Python, SQL, Tableau, Machine Learning, Data Analysis",
        experience_years=3,
        job_role="Data Scientist",
        ai_score=82,
    )

    print("Sample input:")
    print(sample.to_string(index=False))
    return sample


def predict_with_probabilities(model, input_df: pd.DataFrame) -> dict[str, object]:
    """Run the model and return the predicted label with class probabilities."""
    prediction = model.predict(input_df)[0]
    result: dict[str, object] = {"prediction": str(prediction)}

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(input_df)[0]
        labels = model.classes_
        result["probabilities"] = {
            str(label): float(probability)
            for label, probability in zip(labels, probabilities)
        }

    return result


def predict_decision(model, input_df: pd.DataFrame) -> None:
    """Run the model on the sample input and print the prediction."""
    result = predict_with_probabilities(model, input_df)

    print("\nPrediction result:")
    print(f"Predicted Recruiter Decision: {result['prediction']}")

    probabilities = result.get("probabilities")
    if isinstance(probabilities, dict):
        print("\nPrediction probabilities:")
        for label, probability in probabilities.items():
            print(f"{label}: {probability:.4f}")


def main() -> None:
    model = load_model()
    sample_input = build_sample_input()
    predict_decision(model, sample_input)


if __name__ == "__main__":
    main()
