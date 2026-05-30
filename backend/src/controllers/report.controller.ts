import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { reportService } from "../services/report.service.js";
import { successResponse } from "../utils/api-response.js";

export async function getReportController(
  request: Request,
  response: Response
): Promise<void> {
  const report = await reportService.getReportById(String(request.params.id));

  response
    .status(StatusCodes.OK)
    .json(successResponse(report, "Report loaded successfully."));
}

export async function downloadReportController(
  request: Request,
  response: Response
): Promise<void> {
  const file = await reportService.downloadReport(String(request.params.id));

  response.setHeader("Content-Type", file.contentType);
  response.setHeader("Content-Disposition", `attachment; filename=\"${file.filename}\"`);
  response.status(StatusCodes.OK).send(file.content);
}
