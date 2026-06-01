import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { reportService } from "../services/report.service.js";
import { pdfService } from "../services/pdf.service.js";
import { shareService, type ShareExpiry } from "../services/share.service.js";
import { successResponse } from "../utils/api-response.js";
import type { AuthenticatedRequestUser } from "../middleware/auth/jwt.middleware.js";

function authUser(res: Response): AuthenticatedRequestUser {
  return res.locals.authUser as AuthenticatedRequestUser;
}

// ── Existing ──────────────────────────────────────────────────────────────────

export async function getReportController(req: Request, res: Response): Promise<void> {
  const report = await reportService.getReportById(String(req.params.id));
  res.status(StatusCodes.OK).json(successResponse(report, "Report loaded successfully."));
}

export async function downloadReportController(req: Request, res: Response): Promise<void> {
  const file = await reportService.downloadReport(String(req.params.id));
  res.setHeader("Content-Type", file.contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
  res.status(StatusCodes.OK).send(file.content);
}

// ── PDF Export ────────────────────────────────────────────────────────────────

export async function exportReportPdfController(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const user = authUser(res);

  const result = await pdfService.exportReportPdf(id, user.id);

  res.status(StatusCodes.OK).json(
    successResponse(
      { downloadUrl: result.downloadUrl, fileName: result.fileName },
      "PDF export ready."
    )
  );
}

// ── Share ─────────────────────────────────────────────────────────────────────

export async function createShareController(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const user   = authUser(res);
  const expiry = (req.body?.expiry as ShareExpiry | undefined) ?? "7d";

  const result = await shareService.createShareLink(id, user.id, expiry);

  res.status(StatusCodes.CREATED).json(
    successResponse(result, "Share link created.")
  );
}

export async function revokeShareController(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const user   = authUser(res);

  await shareService.revokeShareLink(id, user.id);

  res.status(StatusCodes.OK).json(successResponse(null, "Share link revoked."));
}

export async function listSharesController(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const user   = authUser(res);

  const shares = await shareService.listShareLinks(id, user.id);

  res.status(StatusCodes.OK).json(successResponse(shares, "Share links loaded."));
}

export async function viewSharedReportController(req: Request, res: Response): Promise<void> {
  const token = String(req.params.token);
  const { report, permission } = await shareService.resolveShareToken(token);

  res.status(StatusCodes.OK).json(
    successResponse({ report, permission }, "Shared report loaded.")
  );
}
