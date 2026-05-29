type EmailTemplateInput = {
  recipientName: string;
  actionUrl: string;
};

type RenderedEmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createEmailLayout(input: {
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  body: string[];
  buttonLabel: string;
  buttonUrl: string;
  fallbackLabel: string;
  footerNote: string;
}): string {
  const paragraphs = input.body
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;color:#334155;font-size:16px;line-height:1.7;">${paragraph}</p>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(input.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;">
            <tr>
              <td style="padding:0 0 18px 0;text-align:left;">
                <div style="font-size:14px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#0f766e;">BiasLens</div>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;padding:40px 36px;box-shadow:0 20px 45px rgba(15,23,42,0.08);">
                <div style="display:inline-block;background:#ecfeff;color:#0f766e;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:999px;padding:8px 12px;margin-bottom:18px;">${escapeHtml(
                  input.eyebrow
                )}</div>
                <h1 style="margin:0 0 14px;color:#0f172a;font-size:32px;line-height:1.2;">${escapeHtml(
                  input.title
                )}</h1>
                <p style="margin:0 0 22px;color:#475569;font-size:17px;line-height:1.7;">${input.intro}</p>
                ${paragraphs}
                <div style="margin:28px 0 22px;">
                  <a href="${escapeHtml(
                    input.buttonUrl
                  )}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 24px;border-radius:12px;">${escapeHtml(
                    input.buttonLabel
                  )}</a>
                </div>
                <p style="margin:0 0 10px;color:#64748b;font-size:13px;line-height:1.6;">${escapeHtml(
                  input.fallbackLabel
                )}</p>
                <p style="margin:0;padding:14px 16px;background:#f8fafc;border-radius:12px;color:#0f172a;font-size:13px;line-height:1.7;word-break:break-word;">${escapeHtml(
                  input.buttonUrl
                )}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 8px 0 8px;color:#64748b;font-size:12px;line-height:1.7;text-align:left;">
                <p style="margin:0 0 8px;">${escapeHtml(input.footerNote)}</p>
                <p style="margin:0;">BiasLens Security Mailer</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderVerificationEmailTemplate(
  input: EmailTemplateInput
): RenderedEmailTemplate {
  const safeName = escapeHtml(input.recipientName);

  return {
    subject: "Verify your BiasLens account",
    html: createEmailLayout({
      preheader: "Verify your BiasLens email address to activate your account.",
      eyebrow: "Account Security",
      title: "Verify your email address",
      intro: `Hello ${safeName},`,
      body: [
        "Welcome to BiasLens. Before you can sign in and manage reports, please confirm that this email address belongs to you.",
        "This verification step helps us protect your account, your uploaded documents, and any future audit or reporting activity connected to your workspace.",
      ],
      buttonLabel: "Verify Email",
      buttonUrl: input.actionUrl,
      fallbackLabel: "If the button does not open, copy and paste this secure link into your browser:",
      footerNote: "If you did not create a BiasLens account, you can safely ignore this email.",
    }),
    text: [
      `Hello ${input.recipientName},`,
      "",
      "Welcome to BiasLens. Please verify your email address to activate your account.",
      "",
      `Verification link: ${input.actionUrl}`,
      "",
      "If you did not create a BiasLens account, you can safely ignore this email.",
    ].join("\n"),
  };
}

export function renderPasswordResetEmailTemplate(
  input: EmailTemplateInput
): RenderedEmailTemplate {
  const safeName = escapeHtml(input.recipientName);

  return {
    subject: "Reset your BiasLens password",
    html: createEmailLayout({
      preheader: "Use this secure link to reset your BiasLens password.",
      eyebrow: "Password Reset",
      title: "Reset your password",
      intro: `Hello ${safeName},`,
      body: [
        "We received a request to reset the password for your BiasLens account.",
        "Use the secure link below to choose a new password. For your protection, this link expires automatically and all previous sessions will be invalidated after the reset completes.",
      ],
      buttonLabel: "Reset Password",
      buttonUrl: input.actionUrl,
      fallbackLabel: "If the button does not open, copy and paste this secure link into your browser:",
      footerNote: "If you did not request a password reset, you can ignore this email and your current password will continue to work.",
    }),
    text: [
      `Hello ${input.recipientName},`,
      "",
      "We received a request to reset your BiasLens password.",
      "",
      `Reset link: ${input.actionUrl}`,
      "",
      "If you did not request this reset, you can ignore this email.",
    ].join("\n"),
  };
}
