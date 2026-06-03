import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";

import { authConfig } from "../../config/security.js";
import { ForbiddenError } from "../../utils/errors.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_HEADER_NAME = "x-csrf-token";

function ensureCsrfCookie(request: Request, response: Response): string {
  const existingToken = request.cookies?.[authConfig.csrfTokenCookieName];

  if (existingToken) {
    return existingToken;
  }

  const token = crypto.randomBytes(24).toString("hex");
  response.cookie(authConfig.csrfTokenCookieName, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return token;
}

export function csrfMiddleware(request: Request, response: Response, next: NextFunction): void {
  const cookieToken = ensureCsrfCookie(request, response);

  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    next();
    return;
  }

  const headerToken = request.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    next(new ForbiddenError("CSRF token validation failed."));
    return;
  }

  next();
}
