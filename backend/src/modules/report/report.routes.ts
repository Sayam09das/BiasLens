import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  downloadReportController,
  exportReportPdfController,
  getReportController,
  createShareController,
  revokeShareController,
  listSharesController,
  viewSharedReportController,
} from "../../controllers/report.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

// Stricter rate limit for PDF export (expensive operation)
const exportRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many export requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const shareRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

// ── Report read ───────────────────────────────────────────────────────────────
router.get("/reports/:id", requireAuth, (req, res, next) => {
  getReportController(req, res).catch(next);
});

router.get("/reports/:id/download", requireAuth, (req, res, next) => {
  downloadReportController(req, res).catch(next);
});

// ── PDF export ────────────────────────────────────────────────────────────────
router.post("/reports/:id/export/pdf", requireAuth, exportRateLimit, (req, res, next) => {
  exportReportPdfController(req, res).catch(next);
});

// ── Share management ──────────────────────────────────────────────────────────
router.post("/reports/:id/share", requireAuth, shareRateLimit, (req, res, next) => {
  createShareController(req, res).catch(next);
});

router.delete("/reports/:id/share", requireAuth, (req, res, next) => {
  revokeShareController(req, res).catch(next);
});

router.get("/reports/:id/shares", requireAuth, (req, res, next) => {
  listSharesController(req, res).catch(next);
});

// ── Public shared report (no auth — token is the credential) ─────────────────
router.get("/shared/reports/:token", (req, res, next) => {
  viewSharedReportController(req, res).catch(next);
});

export { router as reportRoutes };
