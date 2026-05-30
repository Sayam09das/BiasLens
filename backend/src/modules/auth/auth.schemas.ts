import { z } from "zod";

const objectIdPattern = /^[a-f0-9]{24}$/i;

export const authSchemas = {
  registerBody: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.email().transform((value) => value.trim().toLowerCase()),
    password: z.string().min(8).max(128),
    role: z.string().trim().min(2).max(40).optional(),
  }),
  loginBody: z.object({
    email: z.email().transform((value) => value.trim().toLowerCase()),
    password: z.string().min(8).max(128),
  }),
  verifyEmailQuery: z.object({
    token: z.string().trim().min(16),
  }),
  emailOnlyBody: z.object({
    email: z.email().transform((value) => value.trim().toLowerCase()),
  }),
  refreshBody: z.object({
    refreshToken: z.string().trim().min(20).optional(),
  }),
  logoutBody: z.object({
    refreshToken: z.string().trim().min(20).optional(),
  }),
  resetPasswordBody: z.object({
    token: z.string().trim().min(16),
    password: z.string().min(8).max(128),
  }),
  userParams: z.object({
    id: z.string().regex(objectIdPattern, "A valid user id is required."),
  }),
  updateUserBody: z
    .object({
      fullName: z.string().trim().min(2).max(120).optional(),
      role: z.string().trim().min(2).max(40).optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (value) =>
        value.fullName !== undefined || value.role !== undefined || value.isActive !== undefined,
      "At least one user field must be provided."
    ),
};
