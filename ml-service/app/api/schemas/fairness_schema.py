"""Fairness-related schemas."""

from pydantic import BaseModel


FAIRNESS_RESPONSE_EXAMPLE = {
    "dataset_rows": 2000,
    "overall_selection_rate": 0.4025,
    "by_gender": {
        "female": {
            "rows": 984,
            "selection_rate": 0.42073170731707316,
            "average_screening_score": 70.3668024545096,
        },
        "male": {
            "rows": 1016,
            "selection_rate": 0.38484251968503935,
            "average_screening_score": 70.04126798138351,
        },
    },
    "by_age_group": {
        "18-29": {
            "rows": 613,
            "selection_rate": 0.3964110929853181,
            "average_screening_score": 70.28181058995548,
        },
        "30-39": {
            "rows": 686,
            "selection_rate": 0.4096209912536443,
            "average_screening_score": 70.00355587296603,
        },
        "40-49": {
            "rows": 701,
            "selection_rate": 0.4008559201141227,
            "average_screening_score": 70.32478268734046,
        },
    },
    "gender_demographic_parity_difference": 0.0358891876320338,
    "age_demographic_parity_difference": 0.013209898268326192,
    "gender_disparate_impact_ratio": 0.9146981627296588,
    "age_disparate_impact_ratio": 0.9677509245122001,
}


class GroupMetric(BaseModel):
    rows: int
    selection_rate: float | None = None
    average_screening_score: float | None = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "rows": 984,
                "selection_rate": 0.42073170731707316,
                "average_screening_score": 70.3668024545096,
            }
        }
    }


class FairnessResponse(BaseModel):
    dataset_rows: int
    overall_selection_rate: float
    by_gender: dict[str, GroupMetric]
    by_age_group: dict[str, GroupMetric]
    gender_demographic_parity_difference: float
    age_demographic_parity_difference: float
    gender_disparate_impact_ratio: float | None = None
    age_disparate_impact_ratio: float | None = None

    model_config = {"json_schema_extra": {"example": FAIRNESS_RESPONSE_EXAMPLE}}
