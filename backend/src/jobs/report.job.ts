import { logger } from "../config/logger.js";
import { reportService } from "../services/report.service.js";

type ReportJobPayload = {
  reportId: string;
};

export async function processReportJob(payload: ReportJobPayload) {
  logger.info({ payload }, "Processing report job");
  return reportService.downloadReport(payload.reportId);
}
