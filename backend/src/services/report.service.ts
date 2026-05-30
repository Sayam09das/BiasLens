import { reportRepository } from "../repositories/report.repository.js";
import { NotFoundError } from "../utils/errors.js";

export const reportService = {
  async getReportById(id: string) {
    const report = await reportRepository.findById(id);

    if (!report) {
      throw new NotFoundError("Report not found.");
    }

    return report;
  },

  async downloadReport(id: string) {
    const report = await reportRepository.findById(id);

    if (!report) {
      throw new NotFoundError("Report not found.");
    }

    return {
      filename: `report-${report.id}.json`,
      contentType: "application/json",
      content: JSON.stringify(report, null, 2),
    };
  },
};
