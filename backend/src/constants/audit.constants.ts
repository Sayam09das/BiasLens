export const AUDIT_STATUS = {
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const AUDIT_STATE_TRANSITIONS = {
  queued: ["processing", "failed"],
  processing: ["completed", "failed"],
  completed: [],
  failed: [],
} as const;
