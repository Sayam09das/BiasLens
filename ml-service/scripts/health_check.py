"""Basic service health check helper."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app


def main() -> None:
    with TestClient(app) as client:
        response = client.get("/health")
    print(response.json())


if __name__ == "__main__":
    main()
