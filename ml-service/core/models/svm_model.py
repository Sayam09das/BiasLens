"""Wrapper for SVM-based resume models."""

from __future__ import annotations

import pandas as pd

from core.models.base_model import BaseResumeModel


class SvmResumeModel(BaseResumeModel):
    """Adapter for support-vector-machine artifacts when they are added."""

    model_name = "svm"

    def predict(self, input_frame: pd.DataFrame):
        return self.artifact.predict(input_frame)
