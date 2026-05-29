import type { AuditLog, Prisma } from "@prisma/client";

export type AuditLogModel = AuditLog;
export type CreateAuditLogInput = Prisma.AuditLogCreateInput;

export const auditLogSelect = {
  id: true,
  action: true,
  entityType: true,
  entityId: true,
  metadata: true,
  createdAt: true,
  userId: true,
} satisfies Prisma.AuditLogSelect;
