import { createServer } from "node:http";

import { connectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { connectPrisma } from "../config/prisma.js";
import { initializeTelemetry } from "../config/telemetry.js";
import { createApp } from "./app.js";
import { registerShutdown } from "./shutdown.js";

async function bootstrap() {
  initializeTelemetry();
  await connectDatabase();
  await connectPrisma();

  const app = createApp();
  const server = createServer(app);

  registerShutdown(server);

  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
      },
      "BiasLens backend server started"
    );
  });
}

bootstrap().catch((error) => {
  logger.error({ error }, "Failed to start backend server");
  process.exit(1);
});
