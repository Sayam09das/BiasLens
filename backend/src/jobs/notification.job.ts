import { logger } from "../config/logger.js";
import { notificationService } from "../services/notification.service.js";

type NotificationJobPayload = {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  textContent?: string;
};

export async function processNotificationJob(payload: NotificationJobPayload) {
  logger.info({ email: payload.to.email, subject: payload.subject }, "Processing notification job");
  return notificationService.sendEmail(payload);
}
