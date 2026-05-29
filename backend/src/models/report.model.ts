import type { Prisma, Report } from "@prisma/client";

export type ReportModel = Report;
export type CreateReportInput = Prisma.ReportCreateInput;
export type UpdateReportInput = Prisma.ReportUpdateInput;

export const reportSelect = {
  id: true,
  title: true,
  predictionLabel: true,
  topProbability: true,
  fairnessSnapshot: true,
  createdAt: true,
  updatedAt: true,
  auditId: true,
  userId: true,
} satisfies Prisma.ReportSelect;
