import { Router } from "express";

import {
  createAuditController,
  getAuditByIdController,
  getAuditLogByIdController,
  getAuditStatusesController,
  listAuditsController,
  listAuditLogsController,
} from "../../controllers/audit.controller.js";
import { requireRole } from "../../middleware/authorization.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { auditSchemas } from "./audit.schemas.js";

const router = Router();

router.get("/audits/statuses", getAuditStatusesController);
router.get("/audits",     requireAuth, listAuditsController);
router.get("/audits/:id", requireAuth, getAuditByIdController);
router.post("/audits",    requireAuth, createAuditController);

router.get(
  "/audit-logs",
  requireAuth,
  requireRole("admin"),
  validateRequest({ query: auditSchemas.auditLogListQuery }),
  listAuditLogsController
);

router.get(
  "/audit-logs/:id",
  requireAuth,
  requireRole("admin"),
  validateRequest({ params: auditSchemas.auditLogParams }),
  getAuditLogByIdController
);

export { router as auditRoutes };
