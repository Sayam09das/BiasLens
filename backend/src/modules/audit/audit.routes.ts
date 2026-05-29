import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { AUDIT_STATUS, AUDIT_STATE_TRANSITIONS } from "../../constants/audit.constants.js";

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

export { router as auditRoutes };
