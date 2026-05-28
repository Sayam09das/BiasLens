"""Minimal app placeholder for the future ML service API."""


def get_app_metadata() -> dict[str, str]:
    """Return basic service metadata without external dependencies."""
    return {
        "service": "biaslens-ml-service",
        "status": "scaffolded",
        "next_step": "implement FastAPI routes after baseline data prep and training",
    }
