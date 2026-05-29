"""Model mock helpers for future tests."""


class StaticProbabilityModel:
    """A tiny helper model for future contract and service tests."""

    classes_ = ["Hire", "Reject"]

    def predict(self, _rows):
        return ["Hire"]

    def predict_proba(self, _rows):
        return [[0.8, 0.2]]
