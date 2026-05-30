import { z } from "zod";

export const uploadMetadataSchema = z.object({
  folder: z.string().trim().min(1).max(120).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
});
