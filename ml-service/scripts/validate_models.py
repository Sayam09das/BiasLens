"""Validate active model metadata and artifact presence."""

from __future__ import annotations

from core.models.model_loader import get_active_prediction_model_config


def main() -> None:
    config = get_active_prediction_model_config()
    print(f"Active model: {config['name']}")
    print(f"Artifact path: {config['path']}")
    print(f"Status: {config.get('status', 'unknown')}")


if __name__ == "__main__":
    main()
