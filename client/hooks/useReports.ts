"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { apiFetch } from "@/lib/api";

export type BackendReport = {
  id: string;
  title: string;
  predictionLabel: string | null;
  topProbability: number | null;
  fairnessSnapshot: unknown;
  createdAt: string;
  updatedAt: string;
  auditId: string | null;
  userId: string | null;
};

const POLL_INTERVAL = 30_000;

export function useReports() {
  const [data, setData] = useState<BackendReport[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const reports = await apiFetch<BackendReport[]>("/v1/reports");
      setData(reports);
      setLastFetch(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reports");
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
