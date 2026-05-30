import type { NextFunction, Request, Response } from "express";

import { ForbiddenError } from "../../utils/errors.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_COOKIE_NAME = "biaslens_csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

export function csrfMiddleware(request: Request, _response: Response, next: NextFunction): void {
  if (process.env.NODE_ENV !== "production") {
    next();
    return;
  }

  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    next();
    return;
  }

  const cookieToken = request.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = request.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    next(new ForbiddenError("CSRF token validation failed."));
    return;
  }

  next();
}
