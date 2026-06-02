import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedRequestUser } from "../../middleware/auth.middleware.js";
import { successResponse } from "../../utils/api-response.js";
import { ForbiddenError } from "../../utils/errors.js";
import { getNotificationSummary } from "./notification.service.js";

function getAuthenticatedUser(response: Response): AuthenticatedRequestUser {
  const authUser = response.locals.authUser as AuthenticatedRequestUser | undefined;

  if (!authUser) {
    throw new ForbiddenError("Authenticated user context is missing.");
  }

  return authUser;
}

export async function getNotificationSummaryController(
  _request: Request,
  response: Response,
): Promise<void> {
  const authUser = getAuthenticatedUser(response);
  const summary = await getNotificationSummary(authUser.id);

  response
    .status(StatusCodes.OK)
    .json(successResponse(summary, "Notification summary loaded successfully."));
}
