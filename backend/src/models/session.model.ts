import type { Prisma, Session } from "@prisma/client";

export type SessionModel = Session;
export type CreateSessionInput = Prisma.SessionCreateInput;
export type UpdateSessionInput = Prisma.SessionUpdateInput;

export const sessionSelect = {
  id: true,
  userAgent: true,
  ipAddress: true,
  refreshTokenHash: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
} satisfies Prisma.SessionSelect;
