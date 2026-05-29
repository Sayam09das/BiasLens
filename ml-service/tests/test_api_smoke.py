"""Smoke tests for the main BiasLens API flows."""

from __future__ import annotations


PREDICTION_PAYLOAD = {
    "skills": "Python, SQL, Tableau, Machine Learning, Data Analysis",
    "experience_years": 3,
    "job_role": "Data Scientist",
    "ai_score": 82,
}

TEXT_PAYLOAD = {
    "resume_text": (
        "Data Scientist with 3 years of experience in Python, SQL, Tableau, "
        "machine learning, and data analysis. Built dashboards and predictive models."
    ),
    "job_role": "Data Scientist",
}


def test_root_endpoint(client) -> None:
    response = client.get("/")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ready"


def test_health_endpoint(client) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_endpoint(client) -> None:
    response = client.post("/predict", json=PREDICTION_PAYLOAD)
    assert response.status_code == 200
    payload = response.json()
    assert payload["prediction"] in {"Hire", "Reject"}
    assert set(payload["probabilities"]) == {"Hire", "Reject"}


def test_fairness_endpoint(client) -> None:
    response = client.get("/fairness")
    assert response.status_code == 200
    payload = response.json()
    assert payload["dataset_rows"] > 0
    assert "by_gender" in payload


def test_report_from_text_endpoint(client) -> None:
    response = client.post("/report-from-text", json=TEXT_PAYLOAD)
    assert response.status_code == 200
    payload = response.json()
    assert payload["prediction"]["prediction"] in {"Hire", "Reject"}
    assert payload["extracted_features"]["job_role"] == "Data Scientist"


def test_explain_endpoint(client) -> None:
    response = client.post("/explain", json=TEXT_PAYLOAD)
    assert response.status_code == 200
    payload = response.json()
    assert payload["prediction"] in {"Hire", "Reject"}
    assert payload["shap"]["model_name"] in {"random_forest", "logistic_regression"}
    assert "feature_contributions" in payload["shap"]
    assert "top_local_features" in payload["lime"]


def test_counterfactual_endpoint(client) -> None:
    response = client.post("/counterfactual", json=TEXT_PAYLOAD)
    assert response.status_code == 200
    payload = response.json()
    assert payload["original_prediction"]["prediction"] in {"Hire", "Reject"}
    assert isinstance(payload["candidates"], list)
    assert len(payload["candidates"]) >= 1


def test_metrics_endpoint(client) -> None:
    response = client.get("/metrics")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "available"
    assert payload["model"]["name"] in {"random_forest", "logistic_regression"}


def test_upload_resume_endpoint_with_txt_file(client) -> None:
    files = {
        "file": ("sample_resume.txt", b"Python SQL Tableau machine learning with 3 years experience", "text/plain")
    }
    data = {"job_role": "Data Scientist"}
    response = client.post("/upload-resume", files=files, data=data)
    assert response.status_code == 200
    payload = response.json()
    assert payload["source_filename"] == "sample_resume.txt"
    assert payload["prediction"]["prediction"] in {"Hire", "Reject"}


def test_counterfactual_upload_endpoint_with_txt_file(client) -> None:
    files = {
        "file": (
            "sample_resume.txt",
            b"Python SQL Tableau machine learning with 3 years experience and dashboard work",
            "text/plain",
        )
    }
    data = {"job_role": "Data Scientist"}
    response = client.post("/counterfactual/upload", files=files, data=data)
    assert response.status_code == 200
    payload = response.json()
    assert payload["source_filename"] == "sample_resume.txt"
    assert len(payload["candidates"]) >= 1
