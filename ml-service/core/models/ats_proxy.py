"""Wrapper for the current ATS-style screening model."""

from __future__ import annotations

import pandas as pd

from core.models.base_model import BaseResumeModel


class AtsProxyModel(BaseResumeModel):
    """Thin adapter around the currently saved baseline screening pipeline."""

    model_name = "ats_proxy"

    def predict(self, input_frame: pd.DataFrame):
        return self.artifact.predict(input_frame)
