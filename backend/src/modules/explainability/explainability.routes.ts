import { Router } from "express";
import { getExplainabilitySummaryController } from "../../controllers/explainability.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/explainability/summary", requireAuth, (req, res, next) => {
  getExplainabilitySummaryController(req, res).catch(next);
});

export { router as explainabilityRoutes };
