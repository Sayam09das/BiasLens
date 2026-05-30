import { sendTransactionalEmail } from "../config/brevo.js";

export const notificationService = {
  async sendEmail(input: {
    to: { email: string; name?: string };
    subject: string;
    htmlContent: string;
    textContent?: string;
  }) {
    return sendTransactionalEmail(input);
  },
};
