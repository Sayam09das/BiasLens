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


def build_sample_input() -> pd.DataFrame:
    """Build one sample row using the same columns seen during training."""
    sample = pd.DataFrame(
        [
            {
                "Skills": "Python, SQL, Tableau, Machine Learning, Data Analysis",
                "Experience (Years)": 3,
                "Job Role": "Data Scientist",
                "AI Score (0-100)": 82,
            }
        ]
    )

    print("Sample input:")
    print(sample.to_string(index=False))
    return sample


def predict_decision(model, input_df: pd.DataFrame) -> None:
    """Run the model on the sample input and print the prediction."""
    prediction = model.predict(input_df)[0]

    print("\nPrediction result:")
    print(f"Predicted Recruiter Decision: {prediction}")

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(input_df)[0]
        labels = model.classes_
        print("\nPrediction probabilities:")
        for label, probability in zip(labels, probabilities):
            print(f"{label}: {probability:.4f}")


def main() -> None:
    model = load_model()
    sample_input = build_sample_input()
    predict_decision(model, sample_input)


if __name__ == "__main__":
    main()
