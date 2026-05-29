"""Shared test fixtures for API smoke tests."""

from __future__ import annotations

from fastapi.testclient import TestClient
import pytest

from app.main import app


@pytest.fixture
def client() -> TestClient:
    """Create a FastAPI test client with lifespan support."""
    with TestClient(app) as test_client:
        yield test_client
