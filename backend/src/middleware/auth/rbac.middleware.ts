import type { NextFunction, Request, Response } from "express";

import type { AuthenticatedRequestUser } from "./jwt.middleware.js";
import { ForbiddenError } from "../../utils/errors.js";

function getAuthUser(response: Response): AuthenticatedRequestUser {
  const authUser = response.locals.authUser as AuthenticatedRequestUser | undefined;

  if (!authUser) {
    throw new ForbiddenError("Authenticated user context is missing.");
  }

  return authUser;
}

export function requireRole(...roles: string[]) {
  return (_request: Request, response: Response, next: NextFunction): void => {
    try {
      const authUser = getAuthUser(response);

      if (!roles.includes(authUser.role)) {
        next(new ForbiddenError("You do not have permission to access this resource."));
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function authorizeSelfOrRole(paramKey: string, ...roles: string[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    try {
      const authUser = getAuthUser(response);
      const resourceUserId = String(request.params[paramKey] ?? "");

      if (authUser.id === resourceUserId || roles.includes(authUser.role)) {
        next();
        return;
      }

      next(new ForbiddenError("You do not have permission to access this resource."));
    } catch (error) {
      next(error);
    }
  };
}
