"""Route registry for the BiasLens ML service."""

from fastapi import APIRouter

from app.api.routes.counterfactual import router as counterfactual_router
from app.api.routes.explain import router as explain_router
from app.api.routes.fairness import router as fairness_router
from app.api.routes.health import router as health_router
from app.api.routes.metrics import router as metrics_router
from app.api.routes.parse import router as parse_router
from app.api.routes.predict import router as predict_router
from app.api.routes.report import router as report_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(parse_router)
api_router.include_router(predict_router)
api_router.include_router(fairness_router)
api_router.include_router(report_router)
api_router.include_router(counterfactual_router)
api_router.include_router(explain_router)
api_router.include_router(metrics_router)
