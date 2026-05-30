import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export function requestIdMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const incomingRequestId = request.get("x-request-id")?.trim();
  const requestId = incomingRequestId || crypto.randomUUID();

  response.locals.requestId = requestId;
  response.setHeader("X-Request-ID", requestId);

  next();
}
