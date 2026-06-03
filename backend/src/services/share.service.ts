import { randomBytes, createHash } from "crypto";
import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";
import { reportService } from "./report.service.js";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://bias-lens-omega.vercel.app";

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type ShareExpiry = "1h" | "24h" | "7d" | "30d";

function expiryToMs(expiry: ShareExpiry): number {
  const map: Record<ShareExpiry, number> = {
    "1h":  1 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d":  7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  return map[expiry];
}

export const shareService = {
  async createShareLink(
    reportId: string,
    ownerId: string,
    expiry: ShareExpiry = "7d"
  ) {
    // Verify report ownership
    const resolved = await reportService.resolveReport(reportId);
    const report = await prisma.report.findUnique({ where: { id: resolved.id } });
    if (!report) throw new NotFoundError("Report not found.");
    if (report.userId && report.userId !== ownerId) {
      throw new ForbiddenError("You do not own this report.");
    }

    const token     = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + expiryToMs(expiry));

    await prisma.reportShare.create({
      data: {
        reportId,
        ownerId,
        tokenHash,
        permission: "view",
        expiresAt,
        revoked: false,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "REPORT_SHARED",
        entityType: "Report",
        entityId: report.id,
        userId: ownerId,
        metadata: { expiry, expiresAt },
      },
    });

    logger.info({ reportId: report.id, sourceId: reportId, ownerId, expiry }, "Report share link created");

    return {
      shareUrl: `${APP_URL}/shared/reports/${token}`,
      expiresAt,
    };
  },

  async resolveShareToken(token: string) {
    const tokenHash = hashToken(token);
    const share =
      await prisma.reportShare.findUnique({ where: { tokenHash } }) ??
      await prisma.reportShare.findUnique({ where: { tokenHash: token } });

    if (!share)           throw new NotFoundError("Share link not found.");
    if (share.revoked)    throw new ForbiddenError("This share link has been revoked.");
    if (share.expiresAt < new Date()) throw new ForbiddenError("This share link has expired.");

    const report = await prisma.report.findUnique({ where: { id: share.reportId } });
    if (!report) throw new NotFoundError("Report not found.");

    return { report, permission: share.permission };
  },

  async revokeShareLink(reportId: string, ownerId: string) {
    const resolved = await reportService.resolveReport(reportId);
    const share = await prisma.reportShare.findFirst({
      where: { reportId: resolved.id, ownerId, revoked: false },
    });

    if (!share) throw new NotFoundError("Active share link not found.");

    await prisma.reportShare.update({
      where: { id: share.id },
      data:  { revoked: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "REPORT_SHARE_REVOKED",
        entityType: "Report",
        entityId: resolved.id,
        userId: ownerId,
      },
    });

    logger.info({ reportId: resolved.id, sourceId: reportId, ownerId }, "Report share link revoked");
  },

  async listShareLinks(reportId: string, ownerId: string) {
    const resolved = await reportService.resolveReport(reportId);
    return prisma.reportShare.findMany({
      where: { reportId: resolved.id, ownerId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        permission: true,
        expiresAt: true,
        revoked: true,
        createdAt: true,
      },
    });
  },
};
