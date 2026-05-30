import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { AUDIT_STATUS, AUDIT_STATE_TRANSITIONS } from "../../constants/audit.constants.js";
import { requireRole } from "../../middleware/authorization.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { getAuditLogByIdController, listAuditLogsController } from "./audit.controller.js";
import { auditSchemas } from "./audit.schemas.js";

const router = Router();

router.get("/audits/statuses", (_req, res) => {
  res.json({
    statuses: AUDIT_STATUS,
    transitions: AUDIT_STATE_TRANSITIONS,
  });
});

router.post("/audits", (req, res) => {
  res.status(StatusCodes.ACCEPTED).json({
    id: `audit_${Date.now()}`,
    status: AUDIT_STATUS.QUEUED,
    payload: req.body,
  });
});

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
