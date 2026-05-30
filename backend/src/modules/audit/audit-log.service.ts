import type { Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma.js";

type RecordAuditLogInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  userId?: string | null;
  metadata?: Prisma.InputJsonValue | null;
};

export const auditLogService = {
  async record(input: RecordAuditLogInput): Promise<void> {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        userId: input.userId ?? null,
        metadata: input.metadata ?? null,
      },
    });
  },
};
