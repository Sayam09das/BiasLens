"""Counterfactual endpoints placeholder."""

from fastapi import APIRouter


router = APIRouter(prefix="/counterfactual", tags=["counterfactual"])


@router.get("")
def counterfactual_status() -> dict[str, str]:
    return {"status": "not_implemented", "message": "Counterfactual generation is not implemented yet."}
