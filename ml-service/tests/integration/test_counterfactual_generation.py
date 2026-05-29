"""Integration test for counterfactual generation."""


def test_counterfactual_endpoint_returns_candidates(client) -> None:
    response = client.post(
        "/counterfactual",
        json={
            "job_role": "Data Scientist",
            "resume_text": "Data Scientist with 3 years of experience in Python, SQL, Tableau, and machine learning.",
        },
    )
    assert response.status_code == 200
    assert "candidates" in response.json()
