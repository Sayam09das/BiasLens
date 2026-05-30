import type { AuditLifecyclePayload } from "./audit.types.js";

export type NotificationEventPayload = {
  channel: "email" | "sms";
  recipient: string;
  subject?: string;
};

export type BiasLensEventMap = {
  "audit.started": AuditLifecyclePayload;
  "audit.completed": AuditLifecyclePayload;
  "audit.failed": AuditLifecyclePayload;
  "email.send": NotificationEventPayload;
  "sms.send": NotificationEventPayload;
};
