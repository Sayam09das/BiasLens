import type { Audit, Prisma } from "@prisma/client";

export type AuditModel = Audit;
export type CreateAuditInput = Prisma.AuditCreateInput;
export type UpdateAuditInput = Prisma.AuditUpdateInput;

export const auditSelect = {
  id: true,
  title: true,
  status: true,
  resumeText: true,
  jobRole: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
} satisfies Prisma.AuditSelect;
