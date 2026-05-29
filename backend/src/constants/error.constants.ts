import { StatusCodes } from "http-status-codes";

export const ERROR_CONSTANTS = {
  ROUTE_NOT_FOUND: {
    code: "ROUTE_NOT_FOUND",
    message: "Route not found",
    status: StatusCodes.NOT_FOUND,
  },
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  },
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    status: StatusCodes.BAD_REQUEST,
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "Authentication required",
    status: StatusCodes.UNAUTHORIZED,
  },
} as const;
