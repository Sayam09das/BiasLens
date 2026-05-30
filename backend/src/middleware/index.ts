import express, { type Express } from "express";

import { securityMiddleware } from "../config/security.js";
import { compressionMiddleware } from "./integration/compression.middleware.js";
import { requestIdMiddleware } from "./integration/request-id.middleware.js";
import { corsMiddleware } from "./security/cors.middleware.js";
import { csrfMiddleware } from "./security/csrf.middleware.js";
import { helmetMiddleware } from "./security/helmet.middleware.js";
import { rateLimitMiddleware } from "./security/rate-limit.middleware.js";
import { requestAuditLogMiddleware } from "./observability/audit-log.middleware.js";
import { loggingMiddleware } from "./observability/logging.middleware.js";
import { metricsMiddleware } from "./observability/metrics.middleware.js";
import { tracingMiddleware } from "./observability/tracing.middleware.js";

export function registerMiddleware(app: Express): void {
  app.disable("x-powered-by");
  app.use(requestIdMiddleware);
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(rateLimitMiddleware);
  app.use(loggingMiddleware);
  app.use(tracingMiddleware);
  app.use(metricsMiddleware);
  app.use(requestAuditLogMiddleware);
  app.use(compressionMiddleware);
  app.use(securityMiddleware.cookies);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(csrfMiddleware);
}
