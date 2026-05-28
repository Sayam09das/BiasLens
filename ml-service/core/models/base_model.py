"""Abstract base interface for prediction models used in BiasLens."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

import pandas as pd


class BaseResumeModel(ABC):
    """Minimal interface all wrapped resume models should expose."""

    model_name = "base"

    def __init__(self, artifact: Any) -> None:
        self.artifact = artifact

    @abstractmethod
    def predict(self, input_frame: pd.DataFrame):
        """Predict one or more labels from a prepared input frame."""

    def predict_proba(self, input_frame: pd.DataFrame):
        """Predict class probabilities when supported by the wrapped model."""
        if hasattr(self.artifact, "predict_proba"):
            return self.artifact.predict_proba(input_frame)
        raise NotImplementedError(f"{self.__class__.__name__} does not support probability output.")

    @property
    def classes_(self):
        """Expose class labels when available."""
        return getattr(self.artifact, "classes_", [])
