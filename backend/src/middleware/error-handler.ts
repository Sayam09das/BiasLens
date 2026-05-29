import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { logger } from "../lib/logger.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "Route not found",
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({ error }, "Unhandled backend error");

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
  });
}
