"""Integration test for the prediction flow."""


def test_predict_endpoint_returns_prediction(client) -> None:
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
    assert "prediction" in response.json()
