import { logger } from "../config/logger.js";
import { eventBus } from "./event-bus.js";

export const NOTIFICATION_EVENTS = {
  EMAIL_SEND: "email.send",
  SMS_SEND: "sms.send",
} as const;

type NotificationPayload = {
  channel: "email" | "sms";
  recipient: string;
  subject?: string;
};

export function emitEmailSend(payload: Omit<NotificationPayload, "channel">): void {
  eventBus.emit(NOTIFICATION_EVENTS.EMAIL_SEND, {
    ...payload,
    channel: "email",
  });
}

export function emitSmsSend(payload: Omit<NotificationPayload, "channel">): void {
  eventBus.emit(NOTIFICATION_EVENTS.SMS_SEND, {
    ...payload,
    channel: "sms",
  });
}

export function registerNotificationEventListeners(): void {
  if (eventBus.listenerCount(NOTIFICATION_EVENTS.EMAIL_SEND) === 0) {
    eventBus.on(NOTIFICATION_EVENTS.EMAIL_SEND, (payload: NotificationPayload) => {
      logger.info({ event: NOTIFICATION_EVENTS.EMAIL_SEND, payload }, "Notification event");
    });
  }

  if (eventBus.listenerCount(NOTIFICATION_EVENTS.SMS_SEND) === 0) {
    eventBus.on(NOTIFICATION_EVENTS.SMS_SEND, (payload: NotificationPayload) => {
      logger.info({ event: NOTIFICATION_EVENTS.SMS_SEND, payload }, "Notification event");
    });
  }
}
