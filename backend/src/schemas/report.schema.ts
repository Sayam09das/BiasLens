import { z } from "zod";

export const reportParamsSchema = z.object({
  id: z.string().trim().length(24),
});

export const reportExportSchema = z.object({
  format: z.enum(["json", "pdf", "csv"]).default("json"),
});
