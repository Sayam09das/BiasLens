import nodemailer from "nodemailer";

import { env } from "./env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendTransactionalEmail(input: {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  textContent?: string;
}) {
  return transporter.sendMail({
    from: env.MAIL_FROM,
    to: input.to.name ? `"${input.to.name}" <${input.to.email}>` : input.to.email,
    subject: input.subject,
    html: input.htmlContent,
    text: input.textContent,
  });
}
