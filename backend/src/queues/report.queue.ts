import { processReportJob } from "../jobs/report.job.js";
import { createQueue } from "./queue-config.js";

export const reportQueue = createQueue("report.queue", processReportJob);
