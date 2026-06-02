import { prisma } from "../../config/prisma.js";

type NotificationPreferences = {
  emailAuditComplete: boolean;
  emailFairnessAlert: boolean;
  emailReportShared: boolean;
  emailWeeklyDigest: boolean;
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;
  inAppAuditComplete: boolean;
  inAppFairnessAlert: boolean;
  inAppReportShared: boolean;
  inAppTeamActivity: boolean;
  digestFrequency: "realtime" | "daily" | "weekly";
  quietHoursEnabled: boolean;
  quietFrom: string;
  quietTo: string;
};

type NotificationItem = {
  id: string;
  kind: "audit" | "fairness" | "report" | "activity";
  title: string;
  message: string;
  createdAt: string;
  severity: "info" | "success" | "warning";
};

type UserSettingsRecord = {
  notifications?: Partial<NotificationPreferences>;
};

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  emailAuditComplete: true,
  emailFairnessAlert: true,
  emailReportShared: true,
  emailWeeklyDigest: true,
  emailProductUpdates: false,
  emailSecurityAlerts: true,
  inAppAuditComplete: true,
  inAppFairnessAlert: true,
  inAppReportShared: false,
  inAppTeamActivity: true,
  digestFrequency: "daily",
  quietHoursEnabled: false,
  quietFrom: "22:00",
  quietTo: "08:00",
};

function normalizeNotificationPreferences(
  settings: UserSettingsRecord | null | undefined,
): NotificationPreferences {
  const stored = settings?.notifications ?? {};

  return {
    emailAuditComplete: stored.emailAuditComplete ?? DEFAULT_NOTIFICATION_PREFERENCES.emailAuditComplete,
    emailFairnessAlert: stored.emailFairnessAlert ?? DEFAULT_NOTIFICATION_PREFERENCES.emailFairnessAlert,
    emailReportShared: stored.emailReportShared ?? DEFAULT_NOTIFICATION_PREFERENCES.emailReportShared,
    emailWeeklyDigest: stored.emailWeeklyDigest ?? DEFAULT_NOTIFICATION_PREFERENCES.emailWeeklyDigest,
    emailProductUpdates: stored.emailProductUpdates ?? DEFAULT_NOTIFICATION_PREFERENCES.emailProductUpdates,
    emailSecurityAlerts: stored.emailSecurityAlerts ?? DEFAULT_NOTIFICATION_PREFERENCES.emailSecurityAlerts,
    inAppAuditComplete: stored.inAppAuditComplete ?? DEFAULT_NOTIFICATION_PREFERENCES.inAppAuditComplete,
    inAppFairnessAlert: stored.inAppFairnessAlert ?? DEFAULT_NOTIFICATION_PREFERENCES.inAppFairnessAlert,
    inAppReportShared: stored.inAppReportShared ?? DEFAULT_NOTIFICATION_PREFERENCES.inAppReportShared,
    inAppTeamActivity: stored.inAppTeamActivity ?? DEFAULT_NOTIFICATION_PREFERENCES.inAppTeamActivity,
    digestFrequency: stored.digestFrequency ?? DEFAULT_NOTIFICATION_PREFERENCES.digestFrequency,
    quietHoursEnabled: stored.quietHoursEnabled ?? DEFAULT_NOTIFICATION_PREFERENCES.quietHoursEnabled,
    quietFrom: stored.quietFrom ?? DEFAULT_NOTIFICATION_PREFERENCES.quietFrom,
    quietTo: stored.quietTo ?? DEFAULT_NOTIFICATION_PREFERENCES.quietTo,
  };
}

export async function getNotificationSummary(userId: string) {
  const [user, audits, reports] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    }),
    prisma.audit.findMany({
      where: { userId },
      select: { id: true, title: true, status: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.report.findMany({
      where: { userId },
      select: { id: true, title: true, fairnessSnapshot: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
  ]);

  const preferences = normalizeNotificationPreferences((user?.settings as UserSettingsRecord | null | undefined) ?? null);

  const items: NotificationItem[] = [];

  for (const audit of audits) {
    if (preferences.inAppAuditComplete && audit.status === "COMPLETED") {
      items.push({
        id: `audit-complete-${audit.id}`,
        kind: "audit",
        title: "Audit completed",
        message: `${audit.title} finished processing and is ready to review.`,
        createdAt: audit.updatedAt.toISOString(),
        severity: "success",
      });
    }

    if (preferences.inAppTeamActivity && audit.status === "QUEUED") {
      items.push({
        id: `audit-queued-${audit.id}`,
        kind: "activity",
        title: "New audit queued",
        message: `${audit.title} was added to your review pipeline.`,
        createdAt: audit.createdAt.toISOString(),
        severity: "info",
      });
    }
  }

  for (const report of reports) {
    if (preferences.inAppReportShared) {
      items.push({
        id: `report-${report.id}`,
        kind: "report",
        title: "Report available",
        message: `${report.title} is ready to export or share.`,
        createdAt: report.updatedAt.toISOString(),
        severity: "info",
      });
    }

    const fairnessSnapshot = report.fairnessSnapshot as { severity?: string; riskLevel?: string } | null;
    const risk = fairnessSnapshot?.severity ?? fairnessSnapshot?.riskLevel ?? "";

    if (
      preferences.inAppFairnessAlert &&
      typeof risk === "string" &&
      ["high", "elevated", "warning", "critical"].includes(risk.toLowerCase())
    ) {
      items.push({
        id: `fairness-${report.id}`,
        kind: "fairness",
        title: "Fairness alert",
        message: `${report.title} contains elevated fairness risk signals.`,
        createdAt: report.updatedAt.toISOString(),
        severity: "warning",
      });
    }
  }

  const recentItems = items
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 8);

  const unreadCutoff = Date.now() - 1000 * 60 * 60 * 72;
  const unreadCount = recentItems.filter((item) => new Date(item.createdAt).getTime() >= unreadCutoff).length;

  return {
    unreadCount,
    preferences,
    items: recentItems,
  };
}
