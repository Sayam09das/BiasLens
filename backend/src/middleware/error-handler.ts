import type { NextFunction, Request, Response } from "express";

import { ERROR_CONSTANTS } from "../constants/error.constants.js";
import { errorResponse } from "../utils/api-response.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res
    .status(ERROR_CONSTANTS.ROUTE_NOT_FOUND.status)
    .json(
      errorResponse(
        ERROR_CONSTANTS.ROUTE_NOT_FOUND.code,
        ERROR_CONSTANTS.ROUTE_NOT_FOUND.message
      )
    );
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({ error }, "Unhandled backend error");

  if (error instanceof AppError) {
    res.status(error.statusCode).json(errorResponse(error.errorCode, error.message, error.details));
    return;
  }

  res
    .status(ERROR_CONSTANTS.INTERNAL_SERVER_ERROR.status)
    .json(
      errorResponse(
        ERROR_CONSTANTS.INTERNAL_SERVER_ERROR.code,
        ERROR_CONSTANTS.INTERNAL_SERVER_ERROR.message
      )
    );
}
