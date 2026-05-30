import { prisma } from "../../config/prisma.js";
import { auditLogSelect } from "../../models/audit-log.model.js";
import { NotFoundError } from "../../utils/errors.js";

type ListAuditLogsInput = {
  page: number;
  limit: number;
  action?: string;
  entityType?: string;
  userId?: string;
};

export const auditReadService = {
  async listAuditLogs(input: ListAuditLogsInput) {
    const page = Math.max(1, input.page);
    const limit = Math.max(1, Math.min(100, input.limit));
    const skip = (page - 1) * limit;

    const where = {
      ...(input.action ? { action: input.action } : {}),
      ...(input.entityType ? { entityType: input.entityType } : {}),
      ...(input.userId ? { userId: input.userId } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        select: auditLogSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      filters: {
        action: input.action ?? null,
        entityType: input.entityType ?? null,
        userId: input.userId ?? null,
      },
    };
  },

  async getAuditLogById(id: string) {
    const auditLog = await prisma.auditLog.findUnique({
      where: { id },
      select: auditLogSelect,
    });

    if (!auditLog) {
      throw new NotFoundError("Audit log not found.");
    }

    return auditLog;
  },
};
