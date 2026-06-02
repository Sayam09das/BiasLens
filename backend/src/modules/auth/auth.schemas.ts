import { z } from "zod";

import { getPasswordPolicyIssues } from "./auth.password-policy.js";

const objectIdPattern = /^[a-f0-9]{24}$/i;

export const authSchemas = {
  registerBody: z
    .object({
      fullName: z.string().trim().min(2).max(120),
      email: z.email().transform((value) => value.trim().toLowerCase()),
      password: z.string().min(8).max(128),
      role: z.string().trim().min(2).max(40).optional(),
    })
    .superRefine((value, context) => {
      const issues = getPasswordPolicyIssues(value.password, value.email);

      issues.forEach((issue) => {
        context.addIssue({
          code: "custom",
          path: ["password"],
          message: issue,
        });
      });
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
  resetPasswordBody: z
    .object({
      token: z.string().trim().min(16),
      password: z.string().min(8).max(128),
    })
    .superRefine((value, context) => {
      const issues = getPasswordPolicyIssues(value.password);

      issues.forEach((issue) => {
        context.addIssue({
          code: "custom",
          path: ["password"],
          message: issue,
        });
      });
    }),
  userParams: z.object({
    id: z.string().regex(objectIdPattern, "A valid user id is required."),
  }),
  updateUserBody: z
    .object({
      fullName: z.string().trim().min(2).max(120).optional(),
      jobTitle: z.string().trim().max(120).optional(),
      company: z.string().trim().max(120).optional(),
      phoneNumber: z.string().trim().max(30).optional(),
      role: z.string().trim().min(2).max(40).optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (value) =>
        value.fullName !== undefined || value.role !== undefined || value.isActive !== undefined ||
        value.jobTitle !== undefined || value.company !== undefined || value.phoneNumber !== undefined,
      "At least one user field must be provided."
    ),
};
