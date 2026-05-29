"""Lightweight pipeline benchmark helper."""

from __future__ import annotations

from time import perf_counter

from app.api.services import predict_from_features


def main() -> None:
    started_at = perf_counter()
    result = predict_from_features(
        {
            "skills": "python, sql, tableau",
            "experience_years": 3,
            "job_role": "Data Scientist",
            "ai_score": 58,
        }
    )
    elapsed_ms = (perf_counter() - started_at) * 1000
    print(f"Prediction: {result['prediction']} ({elapsed_ms:.2f} ms)")


if __name__ == "__main__":
    main()
