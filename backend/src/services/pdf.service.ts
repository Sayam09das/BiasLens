import puppeteer from "puppeteer";
import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";
import { reportService } from "./report.service.js";

const PDF_EXPIRY_SECONDS = 60 * 60; // 1 hour signed URL

function buildHtml(report: {
  id: string;
  title: string;
  predictionLabel: string | null;
  topProbability: number | null;
  fairnessSnapshot: unknown;
  createdAt: Date;
}): string {
  const fairness =
    report.fairnessSnapshot && typeof report.fairnessSnapshot === "object"
      ? JSON.stringify(report.fairnessSnapshot, null, 2)
      : "No fairness data available.";

  const probability =
    report.topProbability != null
      ? `${(report.topProbability * 100).toFixed(1)}%`
      : "—";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BiasLens Report — ${report.title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
           background: #fff; color: #101828; padding: 48px; font-size: 14px; line-height: 1.6; }
    .header { border-bottom: 2px solid #1463ff; padding-bottom: 24px; margin-bottom: 32px; }
    .brand { font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
             text-transform: uppercase; color: #1463ff; margin-bottom: 8px; }
    h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.03em; color: #101828; }
    .meta { margin-top: 8px; font-size: 12px; color: #667085; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 13px; font-weight: 700; letter-spacing: 0.14em;
                     text-transform: uppercase; color: #1463ff; margin-bottom: 12px; }
    .card { border: 1px solid #d9e2ec; border-radius: 12px; padding: 20px; background: #f8fbff; }
    .score-row { display: flex; gap: 24px; margin-bottom: 24px; }
    .score-box { flex: 1; border: 1px solid #d9e2ec; border-radius: 12px;
                 padding: 16px; background: #fff; text-align: center; }
    .score-label { font-size: 11px; font-weight: 600; color: #667085;
                   text-transform: uppercase; letter-spacing: 0.12em; }
    .score-value { font-size: 32px; font-weight: 700; color: #1463ff;
                   letter-spacing: -0.04em; margin-top: 4px; }
    pre { background: #f3f7fc; border: 1px solid #d9e2ec; border-radius: 8px;
          padding: 16px; font-size: 12px; overflow-wrap: break-word;
          white-space: pre-wrap; color: #344054; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #d9e2ec;
              font-size: 11px; color: #667085; display: flex; justify-content: space-between; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px;
             font-size: 11px; font-weight: 600; background: #dbe8ff; color: #1463ff; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">BiasLens · Audit Report</div>
    <h1>${report.title}</h1>
    <div class="meta">
      Report ID: ${report.id} &nbsp;·&nbsp;
      Generated: ${report.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Prediction Summary</div>
    <div class="score-row">
      <div class="score-box">
        <div class="score-label">Prediction</div>
        <div class="score-value" style="font-size:18px">${report.predictionLabel ?? "—"}</div>
      </div>
      <div class="score-box">
        <div class="score-label">Confidence</div>
        <div class="score-value">${probability}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Fairness Analysis</div>
    <div class="card">
      <pre>${fairness}</pre>
    </div>
  </div>

  <div class="footer">
    <span>BiasLens — Responsible Hiring Intelligence</span>
    <span class="badge">Confidential · View Only</span>
  </div>
</body>
</html>`;
}

function escapePdfText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildFallbackPdf(report: {
  id: string;
  title: string;
  predictionLabel: string | null;
  topProbability: number | null;
  fairnessSnapshot: unknown;
  createdAt: Date;
}): Buffer {
  const probability =
    report.topProbability != null
      ? `${(report.topProbability * 100).toFixed(1)}%`
      : "N/A";
  const fairness =
    report.fairnessSnapshot && typeof report.fairnessSnapshot === "object"
      ? JSON.stringify(report.fairnessSnapshot, null, 2)
      : "No fairness data available.";

  const lines = [
    "BiasLens Audit Report",
    `Title: ${report.title}`,
    `Report ID: ${report.id}`,
    `Generated: ${report.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    `Prediction: ${report.predictionLabel ?? "N/A"}`,
    `Confidence: ${probability}`,
    "Fairness Snapshot:",
    ...fairness.split("\n"),
  ];

  const maxLines = 34;
  const trimmedLines = lines.slice(0, maxLines);
  const streamLines = trimmedLines.map((line, index) => {
    const y = 760 - index * 20;
    return `BT /F1 12 Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`;
  });
  const content = streamLines.join("\n");

  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${Buffer.byteLength(content, "utf8")} >> stream\n${content}\nendstream endobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${object}\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

async function renderPdfBuffer(report: {
  id: string;
  title: string;
  predictionLabel: string | null;
  topProbability: number | null;
  fairnessSnapshot: unknown;
  createdAt: Date;
}) {
  const html = buildHtml(report);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    return Buffer.from(
      await page.pdf({ format: "A4", printBackground: true, margin: { top: "0", bottom: "0", left: "0", right: "0" } })
    );
  } finally {
    await browser.close();
  }
}

async function uploadPdfOrInline(reportId: string, pdfBuffer: Buffer) {
  const fileName = `biaslens-report-${reportId}.pdf`;
  const cloudinaryConfigured =
    Boolean(env.CLOUDINARY_CLOUD_NAME) &&
    Boolean(env.CLOUDINARY_API_KEY) &&
    Boolean(env.CLOUDINARY_API_SECRET);

  if (!cloudinaryConfigured) {
    return {
      fileName,
      downloadUrl: `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
      cloudinaryPublicId: "inline-data-url",
    };
  }

  const uploadResult = await new Promise<{ public_id: string; secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "biaslens/reports",
          public_id: `report-${reportId}`,
          resource_type: "raw",
          format: "pdf",
          overwrite: true,
        },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error("Cloudinary upload failed"));
          resolve(result as { public_id: string; secure_url: string });
        }
      );
      stream.end(pdfBuffer);
    }
  );

  return {
    fileName,
    cloudinaryPublicId: uploadResult.public_id,
    downloadUrl: cloudinary.url(uploadResult.public_id, {
      resource_type: "raw",
      type: "upload",
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + PDF_EXPIRY_SECONDS,
    }),
  };
}

export const pdfService = {
  async exportReportPdf(reportId: string, requestingUserId: string) {
    // 1. Load report and verify ownership
    const resolved = await reportService.resolveReport(reportId);
    const report = await prisma.report.findUnique({ where: { id: resolved.id } });
    if (!report) throw new NotFoundError("Report not found.");
    if (report.userId && report.userId !== requestingUserId) {
      throw new ForbiddenError("You do not have permission to export this report.");
    }

    // 2. Generate PDF with graceful local fallback
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await renderPdfBuffer(report);
    } catch (error) {
      logger.warn({ reportId: report.id, error }, "Falling back to inline PDF generation");
      pdfBuffer = buildFallbackPdf(report);
    }

    // 3. Upload to Cloudinary when configured, otherwise return inline data URL
    const uploaded = await uploadPdfOrInline(report.id, pdfBuffer);

    // 4. Persist export record
    const expiresAt = new Date(Date.now() + PDF_EXPIRY_SECONDS * 1000);
    await prisma.reportExport.create({
      data: {
        reportId: report.id,
        userId: requestingUserId,
        fileName: uploaded.fileName,
        cloudinaryPublicId: uploaded.cloudinaryPublicId,
        downloadUrl: uploaded.downloadUrl,
        expiresAt,
      },
    });

    // 5. Write audit log
    await prisma.auditLog.create({
      data: {
        action: "REPORT_EXPORTED_PDF",
        entityType: "Report",
        entityId: report.id,
        userId: requestingUserId,
        metadata: { fileName: uploaded.fileName, expiresAt },
      },
    });

    logger.info({ reportId: report.id, sourceId: reportId, userId: requestingUserId }, "Report PDF exported");

    return { downloadUrl: uploaded.downloadUrl, fileName: uploaded.fileName };
  },
};
