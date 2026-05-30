const commonPasswords = new Set([
  "12345678",
  "123456789",
  "password",
  "password123",
  "qwerty123",
  "admin123",
  "welcome123",
  "letmein123",
  "iloveyou",
  "changeme",
]);

function getEmailLocalAndDomain(email: string): string[] {
  const normalized = email.trim().toLowerCase();
  const [localPart, domainPart] = normalized.split("@");
  const domainLabel = domainPart?.split(".")[0];

  return [localPart, domainPart, domainLabel].filter(
    (value): value is string => Boolean(value && value.length >= 3)
  );
}

export function getPasswordPolicyIssues(password: string, email?: string): string[] {
  const issues: string[] = [];
  const normalizedPassword = password.trim();
  const loweredPassword = normalizedPassword.toLowerCase();

  if (normalizedPassword.length < 8) {
    issues.push("Password must be at least 8 characters long.");
  }

  if (normalizedPassword.length > 128) {
    issues.push("Password must be at most 128 characters long.");
  }

  if (/\s/.test(password)) {
    issues.push("Password must not contain spaces.");
  }

  if (!/[A-Z]/.test(password)) {
    issues.push("Password must include at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    issues.push("Password must include at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    issues.push("Password must include at least one number.");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    issues.push("Password must include at least one special character from !@#$%^&*.");
  }

  if (commonPasswords.has(loweredPassword)) {
    issues.push("Password is too common. Choose a stronger password.");
  }

  if (email) {
    const emailTokens = getEmailLocalAndDomain(email);
    const containsEmailToken = emailTokens.some((token) => loweredPassword.includes(token));

    if (containsEmailToken) {
      issues.push("Password must not contain your email address.");
    }
  }

  return issues;
}
