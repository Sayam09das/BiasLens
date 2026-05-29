"""Integration test for fairness analysis."""


def test_fairness_endpoint_returns_summary(client) -> None:
    response = client.get("/fairness")
    assert response.status_code == 200
    payload = response.json()
    assert "overall_selection_rate" in payload
