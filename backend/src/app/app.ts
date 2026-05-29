import compression from "compression";
import express from "express";
import { pinoHttp } from "pino-http";

import { corsMiddleware } from "../config/cors.js";
import { logger } from "../config/logger.js";
import { securityMiddleware } from "../config/security.js";
import { errorHandler, notFoundHandler } from "../middleware/error-handler.js";
import { registerRoutes } from "./routes.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(securityMiddleware.helmet);
  app.use(corsMiddleware);
  app.use(securityMiddleware.rateLimit);
  app.use(pinoHttp({ logger }));
  app.use(compression());
  app.use(securityMiddleware.cookies);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
