import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";

export async function processCleanupJob() {
  const deletedSessions = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  logger.info({ deletedCount: deletedSessions.count }, "Cleanup job removed expired sessions");

  return {
    deletedSessions: deletedSessions.count,
  };
}
