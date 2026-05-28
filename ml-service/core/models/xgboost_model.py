"""Wrapper for XGBoost-style resume models."""

from __future__ import annotations

import pandas as pd

from core.models.base_model import BaseResumeModel


class XGBoostResumeModel(BaseResumeModel):
    """Adapter for XGBoost artifacts when they are added."""

    model_name = "xgboost"

    def predict(self, input_frame: pd.DataFrame):
        return self.artifact.predict(input_frame)
