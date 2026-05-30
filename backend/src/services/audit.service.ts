import { AUDIT_STATE_TRANSITIONS, AUDIT_STATUS } from "../constants/audit.constants.js";
import { auditReadService } from "../modules/audit/audit.read.service.js";
import { auditRepository } from "../repositories/audit.repository.js";

export const auditService = {
  getStatuses() {
    return {
      statuses: AUDIT_STATUS,
      transitions: AUDIT_STATE_TRANSITIONS,
    };
  },

  async createAudit(payload: Record<string, unknown>) {
    return auditRepository.create({
      title: typeof payload.title === "string" ? payload.title : `Audit ${Date.now()}`,
      resumeText: typeof payload.resumeText === "string" ? payload.resumeText : null,
      jobRole: typeof payload.jobRole === "string" ? payload.jobRole : null,
      status: "QUEUED",
      user: undefined,
      report: undefined,
    });
  },

  listAuditLogs: auditReadService.listAuditLogs,
  getAuditLogById: auditReadService.getAuditLogById,
};
