"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { apiFetch } from "@/lib/api";

export type ExplainabilitySummary = {
  shap: {
    signal: string;
    value: number;
  }[];
  features: {
    key: string;
    label: string;
    category: "Experience" | "Skills" | "Impact" | "Education" | "Leadership" | "Evidence" | "Quality";
    importancePct: number;
    delta: "positive" | "negative" | "neutral";
    helperText: string;
  }[];
  proxySignals: {
    id: string;
    signal: string;
    category: string;
    risk: "Low" | "Medium" | "High";
    reason: string;
    recommendation: string;
    status: "Review" | "Action Needed" | "Monitor";
  }[];
  explanation: {
    summary: string;
    whyThisScore: string;
    positiveSignals: string[];
    negativeSignals: string[];
    missingEvidence: string[];
    confidence: string;
    confidenceReasoning: string;
    recommendedHumanReview: string;
  };
  stats: {
    topPositiveDriver: string;
    topNegativeDriver: string;
    proxySignalCount: number;
    totalReports: number;
  };
};

const POLL_INTERVAL = 30_000;

export function useExplainability() {
  const [data, setData] = useState<ExplainabilitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const summary = await apiFetch<ExplainabilitySummary>("/v1/explainability/summary");
      setData(summary);
      setLastFetch(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load explainability data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const kickoff = setTimeout(() => {
      void fetch();
    }, 0);
    timerRef.current = setInterval(() => fetch(true), POLL_INTERVAL);
    return () => {
      clearTimeout(kickoff);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetch]);

  return { data, isLoading, error, lastFetch, refetch: () => fetch() };
}
