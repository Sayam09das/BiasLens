import { ApiError } from "@/lib/api";

export type AuthUser = {
  settings?: {
    defaultDashboardView: string;
    emailNotifications: boolean;
    productUpdateEmails: boolean;
    auditReportEmails: boolean;
    weeklySummaryEmails: boolean;
    workspaceName: string;
    organizationType: string;
    teamSize: string;
    hiringVolume: string;
    notifications?: {
      emailAuditComplete: boolean;
      emailFairnessAlert: boolean;
      emailReportShared: boolean;
      emailWeeklyDigest: boolean;
      emailProductUpdates: boolean;
      emailSecurityAlerts: boolean;
      inAppAuditComplete: boolean;
      inAppFairnessAlert: boolean;
      inAppReportShared: boolean;
      inAppTeamActivity: boolean;
      digestFrequency: "realtime" | "daily" | "weekly";
      quietHoursEnabled: boolean;
      quietFrom: string;
      quietTo: string;
    };
    apiKeys?: Array<{
      id: string;
      name: string;
      keyPreview: string;
      createdAt: string;
      lastUsedAt: string | null;
      active: boolean;
    }>;
    billing?: {
      currentInvoiceAmount: string;
      currentInvoiceDue: string;
      subscriptionPlan: string;
      subscriptionDescription: string;
      nextRenewal: string;
      paymentMethods: Array<{
        id: string;
        brand: string;
        last4: string;
        exp: string;
        primary: boolean;
      }>;
      invoices: Array<{
        id: string;
        date: string;
        amount: string;
        status: string;
      }>;
    };
    team?: {
      members: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
        status: string;
      }>;
    };
    danger?: {
      lastExportAt: string | null;
      lastExportStatus: string | null;
      workspaceDisabled: boolean;
      deletionRequestedAt: string | null;
    };
  } | null;
  id: string;
  email: string;
  fullName: string;
  role: string;
  jobTitle?: string | null;
  company?: string | null;
  phoneNumber?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

type SuccessEnvelope<T> = {
  success: true;
  message: string;
  data: T;
};

type ErrorEnvelope = {
  success: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  message?: string;
};

async function authProxyFetch<T>(
  action:
    | "register"
    | "login"
    | "refresh"
    | "me"
    | "logout"
    | "verify-email"
    | "resend-verification"
    | "forgot-password"
    | "reset-password",
  options: {
    method: "GET" | "POST";
    body?: unknown;
    params?: Record<string, string>;
  },
): Promise<T> {
  const searchParams = new URLSearchParams({ action });
  Object.entries(options.params ?? {}).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  const response = await fetch(`/api/auth?${searchParams.toString()}`, {
    method: options.method,
    credentials: "include",
    headers: options.method === "GET" ? undefined : { "Content-Type": "application/json" },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json().catch(() => null)) as
    | SuccessEnvelope<T>
    | ErrorEnvelope
    | null;

  if (!response.ok) {
    const message =
      payload && "error" in payload && payload.error?.message
        ? payload.error.message
        : payload && "message" in payload && typeof payload.message === "string"
          ? payload.message
          : "Request failed.";

    const details = payload && "error" in payload ? payload.error?.details : undefined;
    throw new ApiError(message, response.status, details);
  }

  if (!payload || !("data" in payload)) {
    throw new ApiError("The server returned an unexpected response.", response.status);
  }

  return payload.data;
}

export async function registerWithEmail(payload: RegisterPayload) {
  return authProxyFetch<{
    user: AuthUser;
    verification: {
      emailSent: boolean;
    };
  }>("register", { method: "POST", body: payload });
}

export async function loginWithEmail(payload: LoginPayload) {
  return authProxyFetch<{
    user: AuthUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }>("login", { method: "POST", body: payload });
}

export async function refreshAuthSession() {
  return authProxyFetch<{
    user: AuthUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }>("refresh", { method: "POST", body: {} });
}

export async function getCurrentSession() {
  return authProxyFetch<{
    user: AuthUser;
  }>("me", { method: "GET" });
}

export async function logoutSession() {
  return authProxyFetch<{
    loggedOut: boolean;
  }>("logout", { method: "POST", body: {} });
}

export async function verifyEmailToken(token: string) {
  return authProxyFetch<AuthUser>("verify-email", {
    method: "GET",
    params: { token },
  });
}

export async function resendVerificationEmail(payload: ForgotPasswordPayload) {
  return authProxyFetch<{
    emailSent: boolean;
  }>("resend-verification", { method: "POST", body: payload });
}

export async function requestPasswordReset(payload: ForgotPasswordPayload) {
  return authProxyFetch<{
    emailSent: boolean;
  }>("forgot-password", { method: "POST", body: payload });
}

export async function resetPasswordWithToken(payload: ResetPasswordPayload) {
  return authProxyFetch<{
    passwordReset: boolean;
  }>("reset-password", { method: "POST", body: payload });
}
