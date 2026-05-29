import { PrismaClient } from "@prisma/client";

import { logger } from "./logger.js";

declare global {
  // eslint-disable-next-line no-var
  var __biaslensPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__biaslensPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__biaslensPrisma__ = prisma;
}

export async function connectPrisma(): Promise<void> {
  await prisma.$connect();
  logger.info("Prisma connected successfully");
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
