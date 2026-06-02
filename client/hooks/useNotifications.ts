"use client";

import * as React from "react";

import { apiFetch } from "@/lib/api";

export type NotificationPreferences = {
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

export type NotificationSummaryItem = {
  id: string;
  kind: "audit" | "fairness" | "report" | "activity";
  title: string;
  message: string;
  createdAt: string;
  severity: "info" | "success" | "warning";
};

export type NotificationSummary = {
  unreadCount: number;
  preferences: NotificationPreferences;
  items: NotificationSummaryItem[];
};

export function useNotifications(autoRefreshMs = 30000, enabled = true) {
  const [data, setData] = React.useState<NotificationSummary | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      setError(null);
      const summary = await apiFetch<NotificationSummary>("/v1/notifications/summary");
      setData(summary);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const kickoff = window.setTimeout(() => {
      void load();
    }, 0);

    const intervalId = window.setInterval(() => {
      void load();
    }, autoRefreshMs);

    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(intervalId);
    };
  }, [autoRefreshMs, enabled, load]);

  return {
    data,
    isLoading: enabled ? isLoading : false,
    error,
    refresh: load,
  };
}
