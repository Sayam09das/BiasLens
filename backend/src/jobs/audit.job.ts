import { logger } from "../config/logger.js";
import { auditService } from "../services/audit.service.js";

type AuditJobPayload = {
  title?: string;
  resumeText?: string;
  jobRole?: string;
};

export async function processAuditJob(payload: AuditJobPayload) {
  logger.info({ payload }, "Processing audit job");
  return auditService.createAudit(payload);
}
