"""Simple ensemble helpers for combining multiple wrapped models."""

from __future__ import annotations

from collections import Counter

import pandas as pd

from core.models.base_model import BaseResumeModel


class EnsembleResumeModel(BaseResumeModel):
    """Majority-vote ensemble over multiple wrapped model instances."""

    model_name = "ensemble"

    def __init__(self, models: list[BaseResumeModel]) -> None:
        super().__init__(artifact=models)
        self.models = models

    def predict(self, input_frame: pd.DataFrame):
        predictions = [str(model.predict(input_frame)[0]) for model in self.models]
        majority_label, _ = Counter(predictions).most_common(1)[0]
        return [majority_label]

    def predict_proba(self, input_frame: pd.DataFrame):
        probability_maps: list[dict[str, float]] = []
        for model in self.models:
            if not hasattr(model, "predict_proba"):
                continue
            probabilities = model.predict_proba(input_frame)[0]
            labels = getattr(model, "classes_", [])
            probability_maps.append(
                {
                    str(label): float(value)
                    for label, value in zip(labels, probabilities)
                }
            )

        if not probability_maps:
            raise NotImplementedError("No probability-capable models were supplied to the ensemble.")

        combined_labels = sorted({label for mapping in probability_maps for label in mapping})
        averaged = []
        for label in combined_labels:
            averaged.append(
                sum(mapping.get(label, 0.0) for mapping in probability_maps) / len(probability_maps)
            )
        return [averaged]
