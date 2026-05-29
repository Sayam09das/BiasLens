import type { Server } from "node:http";

import mongoose from "mongoose";

import { logger } from "../lib/logger.js";

export function registerShutdown(server: Server): void {
  const shutdown = async (signal: NodeJS.Signals) => {
    logger.info({ signal }, "Received shutdown signal");

    server.close(async (closeError) => {
      if (closeError) {
        logger.error({ error: closeError }, "Failed to close HTTP server cleanly");
        process.exit(1);
      }

      try {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed");
        process.exit(0);
      } catch (error) {
        logger.error({ error }, "Failed to close MongoDB connection");
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
