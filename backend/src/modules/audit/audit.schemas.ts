import { z } from "zod";

const objectIdPattern = /^[a-f0-9]{24}$/i;

export const auditSchemas = {
  auditLogListQuery: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    action: z.string().trim().min(1).max(120).optional(),
    entityType: z.string().trim().min(1).max(120).optional(),
    userId: z.string().regex(objectIdPattern, "A valid user id is required.").optional(),
  }),
  auditLogParams: z.object({
    id: z.string().regex(objectIdPattern, "A valid audit log id is required."),
  }),
};
