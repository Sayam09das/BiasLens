import { AUDIT_STATE_TRANSITIONS, AUDIT_STATUS } from "../constants/audit.constants.js";
import {
  emitAuditCompleted,
  emitAuditFailed,
  emitAuditStarted,
} from "../events/audit.events.js";
import { auditReadService } from "../modules/audit/audit.read.service.js";
import { auditRepository } from "../repositories/audit.repository.js";

const NON_TERMINAL_STATUSES = new Set(["QUEUED", "PROCESSING"]);

async function completeAuditLifecycle(auditId: string, userId?: string | null) {
  await auditRepository.updateStatus(auditId, "PROCESSING");
  emitAuditStarted({
    auditId,
    status: AUDIT_STATUS.PROCESSING,
    userId,
  });

  const completedAudit = await auditRepository.updateStatus(auditId, "COMPLETED");
  emitAuditCompleted({
    auditId,
    status: AUDIT_STATUS.COMPLETED,
    userId,
  });

  return completedAudit;
}

async function normalizeAudit(audit: Awaited<ReturnType<typeof auditRepository.findById>>) {
  if (!audit || !NON_TERMINAL_STATUSES.has(audit.status)) {
    return audit;
  }

  return completeAuditLifecycle(audit.id, audit.userId);
}

export const auditService = {
  getStatuses() {
    return {
      statuses: AUDIT_STATUS,
      transitions: AUDIT_STATE_TRANSITIONS,
    };
  },

  async createAudit(payload: Record<string, unknown>) {
    try {
      const audit = await auditRepository.create({
        title: typeof payload.title === "string" ? payload.title : `Audit ${Date.now()}`,
        resumeText: typeof payload.resumeText === "string" ? payload.resumeText : null,
        jobRole: typeof payload.jobRole === "string" ? payload.jobRole : null,
        status: "QUEUED",
        user: undefined,
        report: undefined,
      });

      return completeAuditLifecycle(audit.id, audit.userId);
    } catch (error) {
      emitAuditFailed({
        auditId: "unknown",
        error: error instanceof Error ? error.message : "Unknown audit creation error",
      });
      throw error;
    }
  },

  listAuditLogs: auditReadService.listAuditLogs,
  getAuditLogById: auditReadService.getAuditLogById,

  async listAudits(filters: { status?: string; userId?: string } = {}) {
    const audits = await auditRepository.list(filters);
    return Promise.all(audits.map((audit) => normalizeAudit(audit)));
  },

  async getAuditById(id: string) {
    const audit = await auditRepository.findById(id);
    return normalizeAudit(audit);
  },
};
