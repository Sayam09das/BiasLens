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

export const AUTH_AUDIT_ACTIONS = {
  REGISTERED: "auth.registered",
  EMAIL_VERIFIED: "auth.email_verified",
  VERIFICATION_RESENT: "auth.verification_resent",
  LOGIN_SUCCEEDED: "auth.login_succeeded",
  TOKEN_REFRESHED: "auth.token_refreshed",
  LOGOUT_SUCCEEDED: "auth.logout_succeeded",
  PASSWORD_RESET_REQUESTED: "auth.password_reset_requested",
  PASSWORD_RESET_COMPLETED: "auth.password_reset_completed",
} as const;
