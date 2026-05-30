import { Router } from "express";

import {
  downloadReportController,
  getReportController,
} from "../../controllers/report.controller.js";

const router = Router();

router.get("/reports/:id", (req, res, next) => {
  getReportController(req, res).catch(next);
});

router.get("/reports/:id/download", (req, res, next) => {
  downloadReportController(req, res).catch(next);
});

export { router as reportRoutes };
