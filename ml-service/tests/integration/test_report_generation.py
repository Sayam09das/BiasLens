"""Integration test for report generation."""


def test_report_from_text_endpoint_returns_features(client) -> None:
    response = client.post(
        "/report-from-text",
        json={
            "job_role": "Data Scientist",
            "resume_text": "Data Scientist with 3 years of experience in Python, SQL, Tableau, and machine learning.",
        },
    )
    assert response.status_code == 200
    assert "extracted_features" in response.json()
