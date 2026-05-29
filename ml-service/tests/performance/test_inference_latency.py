"""Lightweight latency guardrails."""

from time import perf_counter


def test_predict_endpoint_completes_quickly(client) -> None:
    started_at = perf_counter()
    response = client.post(
        "/predict",
        json={
            "skills": "python, sql, tableau",
            "experience_years": 3,
            "job_role": "Data Scientist",
            "ai_score": 58,
        },
    )
    elapsed = perf_counter() - started_at
    assert response.status_code == 200
    assert elapsed < 5
