import { processAuditJob } from "../jobs/audit.job.js";
import { createQueue } from "./queue-config.js";

export const auditQueue = createQueue("audit.queue", processAuditJob);
