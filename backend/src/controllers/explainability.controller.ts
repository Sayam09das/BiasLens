import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { explainabilityService } from "../services/explainability.service.js";
import { successResponse } from "../utils/api-response.js";
import type { AuthenticatedRequestUser } from "../middleware/auth/jwt.middleware.js";

export async function getExplainabilitySummaryController(
  _req: Request,
  res: Response
): Promise<void> {
  const user = res.locals.authUser as AuthenticatedRequestUser;
  const summary = await explainabilityService.getSummary(user.id);
  res.status(StatusCodes.OK).json(successResponse(summary, "Explainability summary loaded."));
}
