import type { NextFunction, Request, Response } from "express";

import { ERROR_CONSTANTS } from "../constants/error.constants.js";
import { logger } from "../lib/logger.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(ERROR_CONSTANTS.ROUTE_NOT_FOUND.status).json({
    code: ERROR_CONSTANTS.ROUTE_NOT_FOUND.code,
    message: ERROR_CONSTANTS.ROUTE_NOT_FOUND.message,
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({ error }, "Unhandled backend error");

  res.status(ERROR_CONSTANTS.INTERNAL_SERVER_ERROR.status).json({
    code: ERROR_CONSTANTS.INTERNAL_SERVER_ERROR.code,
    message: ERROR_CONSTANTS.INTERNAL_SERVER_ERROR.message,
  });
}
