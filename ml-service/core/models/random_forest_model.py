"""Wrapper for random-forest-based resume models."""

from __future__ import annotations

import pandas as pd

from core.models.base_model import BaseResumeModel


class RandomForestResumeModel(BaseResumeModel):
    """Adapter for random forest artifacts when they are added."""

    model_name = "random_forest"

    def predict(self, input_frame: pd.DataFrame):
        return self.artifact.predict(input_frame)
