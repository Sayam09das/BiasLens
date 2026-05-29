"""Simple repeated-request throughput smoke test."""


def test_multiple_predict_requests_succeed(client) -> None:
    for _ in range(3):
        response = client.post(
            "/predict",
            json={
                "skills": "python, sql, tableau",
                "experience_years": 3,
                "job_role": "Data Scientist",
                "ai_score": 58,
            },
        )
        assert response.status_code == 200
