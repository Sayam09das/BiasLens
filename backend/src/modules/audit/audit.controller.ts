import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { successResponse } from "../../utils/api-response.js";
import { auditReadService } from "./audit.read.service.js";

export async function listAuditLogsController(
  request: Request,
  response: Response
): Promise<void> {
  const result = await auditReadService.listAuditLogs({
    page: Number(request.query.page ?? 1),
    limit: Number(request.query.limit ?? 20),
    action: typeof request.query.action === "string" ? request.query.action : undefined,
    entityType:
      typeof request.query.entityType === "string" ? request.query.entityType : undefined,
    userId: typeof request.query.userId === "string" ? request.query.userId : undefined,
  });

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "Audit logs loaded successfully."));
}

export async function getAuditLogByIdController(
  request: Request,
  response: Response
): Promise<void> {
  const result = await auditReadService.getAuditLogById(String(request.params.id));

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "Audit log loaded successfully."));
}
