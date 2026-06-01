import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";

export interface Report {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  auditId: string;
}

export function useReports() {
  const [filter, setFilter] = useState("");

  const { data: reports = [], ...query } = useQuery({
    queryKey: ["reports"],
    queryFn: () => apiFetch<Report[]>("/v1/reports"),
  });

  const filtered = useMemo(
    () =>
      filter
        ? reports.filter(
            (r) =>
              r.title.toLowerCase().includes(filter.toLowerCase()) ||
              r.status.toLowerCase().includes(filter.toLowerCase())
          )
        : reports,
    [reports, filter]
  );

  return { reports: filtered, filter, setFilter, ...query };
}
