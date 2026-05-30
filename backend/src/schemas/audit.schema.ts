import { z } from "zod";

import { paginationSchema } from "./pagination.schema.js";
import { auditSchemas } from "../modules/audit/audit.schemas.js";

export const createAuditSchema = z.object({
  title: z.string().trim().min(2).max(160).optional(),
  resumeText: z.string().trim().min(10).max(50_000).optional(),
  jobRole: z.string().trim().min(2).max(120).optional(),
});

export const auditLogListSchema = paginationSchema.extend({
  action: z.string().trim().min(1).max(120).optional(),
  entityType: z.string().trim().min(1).max(120).optional(),
  userId: z.string().trim().length(24).optional(),
});

export { auditSchemas };
