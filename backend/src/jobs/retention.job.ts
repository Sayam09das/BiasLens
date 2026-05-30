import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";

const RETENTION_DAYS = 365;

export async function processRetentionJob() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

  const deletedAuditLogs = await prisma.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: cutoff,
      },
    },
  });

  logger.info(
    { deletedCount: deletedAuditLogs.count, retentionDays: RETENTION_DAYS },
    "Retention job removed expired audit logs"
  );

  return {
    deletedAuditLogs: deletedAuditLogs.count,
    cutoff,
  };
}
