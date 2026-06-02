import { z } from "zod";

import { getPasswordPolicyIssues } from "./auth.password-policy.js";

const objectIdPattern = /^[a-f0-9]{24}$/i;
const notificationSettingsSchema = z.object({
  emailAuditComplete: z.boolean(),
  emailFairnessAlert: z.boolean(),
  emailReportShared: z.boolean(),
  emailWeeklyDigest: z.boolean(),
  emailProductUpdates: z.boolean(),
  emailSecurityAlerts: z.boolean(),
  inAppAuditComplete: z.boolean(),
  inAppFairnessAlert: z.boolean(),
  inAppReportShared: z.boolean(),
  inAppTeamActivity: z.boolean(),
  digestFrequency: z.enum(["realtime", "daily", "weekly"]),
  quietHoursEnabled: z.boolean(),
  quietFrom: z.string().trim().min(1).max(5),
  quietTo: z.string().trim().min(1).max(5),
});
const apiKeySchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(2).max(120),
  keyPreview: z.string().trim().min(6).max(80),
  createdAt: z.string().trim().min(1).max(80),
  lastUsedAt: z.string().trim().min(1).max(80).nullable(),
  active: z.boolean(),
});
const billingPaymentMethodSchema = z.object({
  id: z.string().trim().min(1).max(80),
  brand: z.string().trim().min(1).max(40),
  last4: z.string().trim().min(2).max(4),
  exp: z.string().trim().min(4).max(10),
  primary: z.boolean(),
});
const billingInvoiceSchema = z.object({
  id: z.string().trim().min(1).max(80),
  date: z.string().trim().min(1).max(80),
  amount: z.string().trim().min(1).max(40),
  status: z.string().trim().min(1).max(40),
});
const billingSettingsSchema = z.object({
  currentInvoiceAmount: z.string().trim().min(1).max(40),
  currentInvoiceDue: z.string().trim().min(1).max(80),
  subscriptionPlan: z.string().trim().min(1).max(80),
  subscriptionDescription: z.string().trim().min(1).max(200),
  nextRenewal: z.string().trim().min(1).max(80),
  paymentMethods: z.array(billingPaymentMethodSchema),
  invoices: z.array(billingInvoiceSchema),
});
const teamMemberSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  role: z.string().trim().min(1).max(40),
  status: z.string().trim().min(1).max(40),
});
const teamSettingsSchema = z.object({
  members: z.array(teamMemberSchema),
});
const dangerSettingsSchema = z.object({
  lastExportAt: z.string().trim().min(1).max(80).nullable(),
  lastExportStatus: z.string().trim().min(1).max(40).nullable(),
  workspaceDisabled: z.boolean(),
  deletionRequestedAt: z.string().trim().min(1).max(80).nullable(),
});
const userSettingsSchema = z.object({
  defaultDashboardView: z.string().trim().min(1).max(40),
  emailNotifications: z.boolean(),
  productUpdateEmails: z.boolean(),
  auditReportEmails: z.boolean(),
  weeklySummaryEmails: z.boolean(),
  workspaceName: z.string().trim().min(2).max(120),
  organizationType: z.string().trim().min(1).max(60),
  teamSize: z.string().trim().min(1).max(40),
  hiringVolume: z.string().trim().min(1).max(40),
  notifications: notificationSettingsSchema.optional(),
  apiKeys: z.array(apiKeySchema).optional(),
  billing: billingSettingsSchema.optional(),
  team: teamSettingsSchema.optional(),
  danger: dangerSettingsSchema.optional(),
});

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
      settings: userSettingsSchema.optional(),
      role: z.string().trim().min(2).max(40).optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (value) =>
        value.fullName !== undefined || value.role !== undefined || value.isActive !== undefined ||
        value.jobTitle !== undefined || value.company !== undefined || value.phoneNumber !== undefined ||
        value.settings !== undefined,
      "At least one user field must be provided."
    ),
};
