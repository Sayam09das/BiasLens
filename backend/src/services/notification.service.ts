import { sendTransactionalEmail } from "../config/brevo.js";
import { emitEmailSend } from "../events/notification.events.js";

export const notificationService = {
  async sendEmail(input: {
    to: { email: string; name?: string };
    subject: string;
    htmlContent: string;
    textContent?: string;
  }) {
    emitEmailSend({
      recipient: input.to.email,
      subject: input.subject,
    });

    return sendTransactionalEmail(input);
  },
};
