import { logger } from "../config/logger.js";
import { eventBus } from "./event-bus.js";

export const AUDIT_EVENTS = {
  STARTED: "audit.started",
  COMPLETED: "audit.completed",
  FAILED: "audit.failed",
} as const;

type AuditLifecyclePayload = {
  auditId: string;
  status?: string;
  error?: string;
  userId?: string | null;
};

export function emitAuditStarted(payload: AuditLifecyclePayload): void {
  eventBus.emit(AUDIT_EVENTS.STARTED, payload);
}

export function emitAuditCompleted(payload: AuditLifecyclePayload): void {
  eventBus.emit(AUDIT_EVENTS.COMPLETED, payload);
}

export function emitAuditFailed(payload: AuditLifecyclePayload): void {
  eventBus.emit(AUDIT_EVENTS.FAILED, payload);
}

export function registerAuditEventListeners(): void {
  if (eventBus.listenerCount(AUDIT_EVENTS.STARTED) === 0) {
    eventBus.on(AUDIT_EVENTS.STARTED, (payload: AuditLifecyclePayload) => {
      logger.info({ event: AUDIT_EVENTS.STARTED, payload }, "Audit lifecycle event");
    });
  }

  if (eventBus.listenerCount(AUDIT_EVENTS.COMPLETED) === 0) {
    eventBus.on(AUDIT_EVENTS.COMPLETED, (payload: AuditLifecyclePayload) => {
      logger.info({ event: AUDIT_EVENTS.COMPLETED, payload }, "Audit lifecycle event");
    });
  }

  if (eventBus.listenerCount(AUDIT_EVENTS.FAILED) === 0) {
    eventBus.on(AUDIT_EVENTS.FAILED, (payload: AuditLifecyclePayload) => {
      logger.warn({ event: AUDIT_EVENTS.FAILED, payload }, "Audit lifecycle event");
    });
  }
}
