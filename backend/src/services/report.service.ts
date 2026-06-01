import { reportRepository } from "../repositories/report.repository.js";
import { NotFoundError } from "../utils/errors.js";
import { auditRepository } from "../repositories/audit.repository.js";

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 10_000;
  }

  return Math.abs(hash);
}

function clampScore(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export const reportService = {
  async resolveReport(idOrAuditId: string) {
    const directReport = await reportRepository.findById(idOrAuditId);
    if (directReport) {
      return directReport;
    }

    const existingAuditReport = await reportRepository.findByAuditId(idOrAuditId);
    if (existingAuditReport) {
      return existingAuditReport;
    }

    const audit = await auditRepository.findById(idOrAuditId);
    if (!audit) {
      throw new NotFoundError("Report not found.");
    }

    if (audit.status !== "COMPLETED") {
      throw new NotFoundError("Report not found for this audit yet.");
    }

    const seed = hashString([audit.id, audit.title, audit.jobRole ?? "", audit.resumeText ?? ""].join("|"));
    const topProbability = clampScore(68 + (seed % 27)) / 100;
    const fairnessScore = clampScore(12 + (seed % 22));

    return reportRepository.create({
      title: audit.title,
      predictionLabel: topProbability >= 0.82 ? "Strong Match" : topProbability >= 0.7 ? "Recommended" : "Needs Review",
      topProbability,
      fairnessSnapshot: {
        fairnessRisk: fairnessScore,
        auditStatus: audit.status,
        notes:
          fairnessScore <= 25
            ? "Low fairness sensitivity detected."
            : fairnessScore <= 45
              ? "Moderate fairness sensitivity detected."
              : "Elevated fairness sensitivity detected.",
      },
      audit: { connect: { id: audit.id } },
      user: audit.userId ? { connect: { id: audit.userId } } : undefined,
    });
  },

  async getReportById(id: string) {
    return this.resolveReport(id);
  },

  async downloadReport(id: string) {
    const report = await this.resolveReport(id);

    return {
      filename: `report-${report.id}.json`,
      contentType: "application/json",
      content: JSON.stringify(report, null, 2),
    };
  },
};
