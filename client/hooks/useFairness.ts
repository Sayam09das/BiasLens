"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "@/lib/api";

type HeatSeverity = "low" | "medium" | "high";

export type FairnessSummary = {
  metrics: {
    demographicParityGap: number;
    equalizedOddsDifference: number;
    counterfactualConsistency: number;
    fairnessScore: number;
    biasRiskLevel: "Low" | "Medium" | "High";
    groupScoreVariance: number;
  };
  trend: {
    label: string;
    fairnessScore: number;
    parityGap: number;
    equalizedOdds: number;
    counterfactualConsistency: number;
  }[];
  groupComparison: { group: string; score: number }[];
  heatmap: Record<string, Record<string, { severity: HeatSeverity; riskLabel: string }>>;
  counterfactuals: {
    originalSignal: string;
    counterfactualSignal: string;
    originalScorePct: number;
    counterfactualScorePct: number;
    interpretation: string;
  }[];
  stats: {
    overallFairnessScore: number;
    highestRiskSignal: string;
    counterfactualStability: number;
    totalReports: number;
  };
};

const POLL_INTERVAL = 30_000; // 30 seconds

export function useFairness() {
  const [data,      setData]      = useState<FairnessSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const summary = await apiFetch<FairnessSummary>("/v1/fairness/summary");
      setData(summary);
      setLastFetch(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load fairness data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetch();
    timerRef.current = setInterval(() => fetch(true), POLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetch]);

  return { data, isLoading, error, lastFetch, refetch: () => fetch() };
}
