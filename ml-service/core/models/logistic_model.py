"""Wrapper for logistic-regression-style screening models."""

from __future__ import annotations

import pandas as pd

from core.models.base_model import BaseResumeModel


class LogisticResumeModel(BaseResumeModel):
    """Adapter for a logistic-regression classifier pipeline."""

    model_name = "logistic_regression"

    def predict(self, input_frame: pd.DataFrame):
        return self.artifact.predict(input_frame)
