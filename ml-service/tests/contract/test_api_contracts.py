"""API contract smoke tests."""


def test_metrics_contract_has_model_block(client) -> None:
    response = client.get("/metrics")
    assert response.status_code == 200
    payload = response.json()
    assert "model" in payload
    assert "name" in payload["model"]
