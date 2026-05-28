"""Train the ATS proxy model.

This currently delegates to the baseline logistic pipeline, which is the active
ATS-style screening model in the project today.
"""

from __future__ import annotations

from training.train_baseline_model import main as train_baseline_main


def main() -> None:
    """Train the current ATS proxy model."""
    print("Training ATS proxy model via the baseline logistic pipeline...")
    train_baseline_main()


if __name__ == "__main__":
    main()
