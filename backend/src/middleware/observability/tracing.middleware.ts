import type { NextFunction, Request, Response } from "express";

export function tracingMiddleware(_request: Request, _response: Response, next: NextFunction): void {
  next();
}
