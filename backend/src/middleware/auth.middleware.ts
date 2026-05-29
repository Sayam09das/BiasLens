import type { NextFunction, Request, Response } from "express";

import { authConfig } from "../config/security.js";
import { tokenService, type AuthTokenPayload } from "../modules/auth/token.service.js";
import { UnauthorizedError } from "../utils/errors.js";

export type AuthenticatedRequestUser = {
  id: string;
  email: string;
  role: string;
};

function getAccessToken(request: Request): string | undefined {
  const bearerHeader = request.get("authorization");

  if (bearerHeader?.startsWith("Bearer ")) {
    return bearerHeader.slice(7).trim();
  }

  return request.cookies?.[authConfig.accessTokenCookieName];
}

function toAuthenticatedUser(payload: AuthTokenPayload): AuthenticatedRequestUser {
  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    next(new UnauthorizedError("Access token is required."));
    return;
  }

  try {
    const payload = tokenService.verifyToken(accessToken, "access");
    response.locals.authUser = toAuthenticatedUser(payload);
    next();
  } catch (error) {
    next(error);
  }
}
