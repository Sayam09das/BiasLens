import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { successResponse } from "../utils/api-response.js";
import { auditService } from "../services/audit.service.js";

export async function getAuditStatusesController(
  _request: Request,
  response: Response
): Promise<void> {
  response
    .status(StatusCodes.OK)
    .json(successResponse(auditService.getStatuses(), "Audit statuses loaded successfully."));
}

export async function createAuditController(
  request: Request,
  response: Response
): Promise<void> {
  const audit = await auditService.createAudit(request.body);

  response
    .status(StatusCodes.ACCEPTED)
    .json(successResponse(audit, "Audit created successfully."));
}

export async function listAuditsController(
  request: Request,
  response: Response
): Promise<void> {
  const audits = await auditService.listAudits({
    status: typeof request.query.status === "string" ? request.query.status : undefined,
    userId: typeof request.query.userId === "string" ? request.query.userId : undefined,
  });

  response
    .status(StatusCodes.OK)
    .json(successResponse(audits, "Audits loaded successfully."));
}

export async function getAuditByIdController(
  request: Request,
  response: Response
): Promise<void> {
  const audit = await auditService.getAuditById(String(request.params.id));

  if (!audit) {
    response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Audit not found." });
    return;
  }

  response
    .status(StatusCodes.OK)
    .json(successResponse(audit, "Audit loaded successfully."));
}

export async function listAuditLogsController(
  request: Request,
  response: Response
): Promise<void> {
  const result = await auditService.listAuditLogs({
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
  const result = await auditService.getAuditLogById(String(request.params.id));

  response
    .status(StatusCodes.OK)
    .json(successResponse(result, "Audit log loaded successfully."));
}
