import { ERROR_CONSTANTS } from "../constants/error.constants.js";

export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  details?: unknown;

  constructor(
    message: string,
    statusCode: number = ERROR_CONSTANTS.INTERNAL_SERVER_ERROR.status,
    errorCode: string = ERROR_CONSTANTS.INTERNAL_SERVER_ERROR.code,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string = ERROR_CONSTANTS.VALIDATION_ERROR.message, details?: unknown) {
    super(
      message,
      ERROR_CONSTANTS.VALIDATION_ERROR.status,
      ERROR_CONSTANTS.VALIDATION_ERROR.code,
      details
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = ERROR_CONSTANTS.UNAUTHORIZED.message, details?: unknown) {
    super(
      message,
      ERROR_CONSTANTS.UNAUTHORIZED.status,
      ERROR_CONSTANTS.UNAUTHORIZED.code,
      details
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_CONSTANTS.FORBIDDEN.message, details?: unknown) {
    super(
      message,
      ERROR_CONSTANTS.FORBIDDEN.status,
      ERROR_CONSTANTS.FORBIDDEN.code,
      details
    );
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ERROR_CONSTANTS.NOT_FOUND.message, details?: unknown) {
    super(
      message,
      ERROR_CONSTANTS.NOT_FOUND.status,
      ERROR_CONSTANTS.NOT_FOUND.code,
      details
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string = ERROR_CONSTANTS.CONFLICT.message, details?: unknown) {
    super(
      message,
      ERROR_CONSTANTS.CONFLICT.status,
      ERROR_CONSTANTS.CONFLICT.code,
      details
    );
  }
}
