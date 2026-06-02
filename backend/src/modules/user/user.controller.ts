import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedRequestUser } from "../../middleware/auth.middleware.js";
import { prisma } from "../../config/prisma.js";
import { userSelect } from "../../models/user.model.js";
import { successResponse } from "../../utils/api-response.js";
import { ForbiddenError, NotFoundError, ValidationError } from "../../utils/errors.js";

function getAuthenticatedUser(response: Response): AuthenticatedRequestUser {
  const authUser = response.locals.authUser as AuthenticatedRequestUser | undefined;

  if (!authUser) {
    throw new ForbiddenError("Authenticated user context is missing.");
  }

  return authUser;
}

export async function getUserController(request: Request, response: Response): Promise<void> {
  const userId = String(request.params.id);
  const authUser = getAuthenticatedUser(response);

  if (authUser.id !== userId && authUser.role !== "admin") {
    throw new ForbiddenError("You do not have permission to view this user.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  response.status(StatusCodes.OK).json(successResponse(user, "User loaded successfully."));
}

export async function updateUserController(request: Request, response: Response): Promise<void> {
  const userId = String(request.params.id);
  const authUser = getAuthenticatedUser(response);
  const isAdmin = authUser.role === "admin";

  if (authUser.id !== userId && !isAdmin) {
    throw new ForbiddenError("You do not have permission to update this user.");
  }

  const updates: Record<string, unknown> = {};

  if (typeof request.body?.fullName === "string" && request.body.fullName.trim()) {
    updates.fullName = request.body.fullName.trim();
  }

  if (typeof request.body?.jobTitle === "string") {
    updates.jobTitle = request.body.jobTitle.trim() || null;
  }

  if (typeof request.body?.company === "string") {
    updates.company = request.body.company.trim() || null;
  }

  if (typeof request.body?.phoneNumber === "string") {
    updates.phoneNumber = request.body.phoneNumber.trim() || null;
  }

  if (typeof request.body?.role === "string" && request.body.role.trim()) {
    if (!isAdmin) {
      throw new ForbiddenError("Only admins can change user roles.");
    }

    updates.role = request.body.role.trim();
  }

  if (typeof request.body?.isActive === "boolean") {
    if (!isAdmin) {
      throw new ForbiddenError("Only admins can change account status.");
    }

    updates.isActive = request.body.isActive;
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError("At least one valid user field is required for update.");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: userSelect,
  });

  response
    .status(StatusCodes.ACCEPTED)
    .json(successResponse(user, "User updated successfully."));
}
