export type AuditLifecycleStatus = "queued" | "processing" | "completed" | "failed";

export type AuditLifecyclePayload = {
  auditId: string;
  status?: string;
  error?: string;
  userId?: string | null;
};
