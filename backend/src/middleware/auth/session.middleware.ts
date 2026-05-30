import type { NextFunction, Request, Response } from "express";

import { prisma } from "../../config/prisma.js";
import type { AuthenticatedRequestUser } from "./jwt.middleware.js";
import { UnauthorizedError } from "../../utils/errors.js";

export async function requireActiveSession(
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authUser = response.locals.authUser as AuthenticatedRequestUser | undefined;

    if (!authUser) {
      next(new UnauthorizedError("Authenticated user context is missing."));
      return;
    }

    const activeSession = await prisma.session.findFirst({
      where: {
        userId: authUser.id,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: { id: true },
    });

    if (!activeSession) {
      next(new UnauthorizedError("No active session found for this user."));
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}
