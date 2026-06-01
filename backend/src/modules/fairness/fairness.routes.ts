import { Router } from "express";
import { getFairnessSummaryController } from "../../controllers/fairness.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/fairness/summary", requireAuth, (req, res, next) => {
  getFairnessSummaryController(req, res).catch(next);
});

export { router as fairnessRoutes };
