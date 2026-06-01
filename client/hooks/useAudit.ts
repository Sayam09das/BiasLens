import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export type AuditStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Audit {
  id: string;
  status: AuditStatus;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  result?: Record<string, unknown>;
}

export function useAudit(auditId?: string) {
  const qc = useQueryClient();

  const audit = useQuery({
    queryKey: ["audit", auditId],
    queryFn: () => apiFetch<Audit>(`/v1/audits/${auditId}`),
    enabled: !!auditId,
  });

  const audits = useQuery({
    queryKey: ["audits"],
    queryFn: () => apiFetch<Audit[]>("/v1/audits"),
  });

  const deleteAudit = useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/v1/audits/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["audits"] }),
  });

  return { audit, audits, deleteAudit };
}
