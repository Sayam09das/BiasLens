import type { NextFunction, Request, Response } from "express";

import { logger } from "../../config/logger.js";

export function requestAuditLogMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const startedAt = Date.now();

  response.on("finish", () => {
    logger.info(
      {
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs: Date.now() - startedAt,
        ipAddress: request.ip,
      },
      "Request audit trail captured"
    );
  });

  next();
}
