import type { NextFunction, Request, Response } from "express";

import { logger } from "../../config/logger.js";

export function metricsMiddleware(request: Request, response: Response, next: NextFunction): void {
  const startedAt = performance.now();

  response.on("finish", () => {
    const durationMs = Number((performance.now() - startedAt).toFixed(2));
    logger.debug(
      {
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs,
      },
      "Request metrics recorded"
    );
  });

  next();
}
