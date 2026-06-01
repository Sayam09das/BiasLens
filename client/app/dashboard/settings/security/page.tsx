"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  KeyRound,
  Laptop,
  ShieldCheck,
  ShieldX,
  Smartphone,
  Wifi,
  Globe,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Brand = {
  primary: "#2563EB";
  primaryHover: "#1D4ED8";
  background: "#FFFFFF";
  secondaryBackground: "#F6F8FB";
  text: "#0D0C22";
  mutedText: "#6E6D7A";
  border: "#E7E7E9";
  success: "#22C55E";
  warning: "#F59E0B";
  danger: "#EF4444";
};

const BRAND: Brand = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  background: "#FFFFFF",
  secondaryBackground: "#F6F8FB",
  text: "#0D0C22",
  mutedText: "#6E6D7A",
  border: "#E7E7E9",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]"
    >
      {children}
    </label>
  );
}

function FieldInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    "aria-invalid"?: boolean;
  },
) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={
        "w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] " +
        (className ?? "")
      }
    />
  );
}



function Meter({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(score)));
  const tone =
    pct >= 80
      ? BRAND.success
      : pct >= 55
        ? BRAND.warning
        : pct > 0
          ? BRAND.danger
          : "#BDBEC7";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[#6E6D7A]">Strength</p>
        <p className="text-xs font-semibold" style={{ color: tone }}>
          {pct === 0
            ? "—"
            : pct >= 80
              ? "Strong"
              : pct >= 55
                ? "Moderate"
                : "Weak"}
        </p>
      </div>
      <div className="h-2 w-full rounded-full bg-[#E7E7E9]" aria-hidden="true">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, background: tone }}
        />
      </div>
    </div>
  );
}

function ChecklistItem({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <span
        className="mt-0.5 grid h-5 w-5 place-items-center rounded-full border"
        style={{
          background: ok ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
          borderColor: ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)",
          color: ok ? BRAND.success : BRAND.danger,
        }}
        aria-hidden="true"
      >
        {ok ? <CheckCircle2 size={12} /> : <ShieldX size={12} />}
      </span>
      <span
        className={ok ? "text-sm text-[#0D0C22]" : "text-sm text-[#6E6D7A]"}
      >
        {children}
      </span>
    </li>
  );
}

type PasswordChecklist = {
  minLen: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
};

function evaluatePassword(password: string): PasswordChecklist {
  return {
    minLen: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function scorePassword(password: string) {
  const c = evaluatePassword(password);
  const passed = Object.values(c).filter(Boolean).length;
  if (!password) return 0;
  return Math.round((passed / 5) * 100);
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .refine(
        (v) => /[A-Z]/.test(v),
        "New password must include an uppercase letter.",
      )
      .refine(
        (v) => /[a-z]/.test(v),
        "New password must include a lowercase letter.",
      )
      .refine((v) => /[0-9]/.test(v), "New password must include a number.")
      .refine(
        (v) => /[^A-Za-z0-9]/.test(v),
        "New password must include a special character.",
      ),
    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
  })
  .superRefine(({ currentPassword, newPassword, confirmNewPassword }, ctx) => {
    if (currentPassword === newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "New password cannot be the same as your current password.",
      });
    }
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmNewPassword"],
        message: "Confirm password must match the new password.",
      });
    }
  });

type PasswordValues = z.infer<typeof passwordSchema>;

type TwoFactorForm = {
  code: string;
};

function FieldPasswordInputRHF({
  id,
  placeholder,
  autoComplete,
  ariaInvalid,
  disabled,
  className,
  register,
  buttonLabel,
  show,
  onToggle,
  label,
}: {
  id: string;
  placeholder: string;
  autoComplete: string;
  ariaInvalid?: boolean;
  disabled?: boolean;
  className?: string;
  register: (...args: unknown[]) => {
    name: string;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    ref: (instance: unknown) => void;
  };
  buttonLabel: string;
  show: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <FieldInput
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!ariaInvalid}
          disabled={disabled}
          className={"pr-12 " + (className ?? "")}
          {...(register(id) as unknown as Record<string, unknown>)}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-2 py-1 text-xs font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-60"
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

const twoFactorSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, "Enter the 6-digit verification code.")
    .max(8, "Enter the correct verification code.")
    .refine((v) => /^[0-9]+$/.test(v), "Verification code must be numeric."),
});

function Badge({
  tone,
  children,
}: {
  tone: "primary" | "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const styles: Record<
    typeof tone,
    { bg: string; fg: string; bd: string; label: string }
  > = {
    primary: {
      bg: "rgba(37,99,235,0.10)",
      fg: BRAND.primary,
      bd: "rgba(37,99,235,0.25)",
      label: "Active",
    },
    success: {
      bg: "rgba(34,197,94,0.10)",
      fg: BRAND.success,
      bd: "rgba(34,197,94,0.25)",
      label: "OK",
    },
    warning: {
      bg: "rgba(245,158,11,0.10)",
      fg: BRAND.warning,
      bd: "rgba(245,158,11,0.25)",
      label: "Review",
    },
    danger: {
      bg: "rgba(239,68,68,0.10)",
      fg: BRAND.danger,
      bd: "rgba(239,68,68,0.25)",
      label: "Risk",
    },
  };
  const s = styles[tone];
  return (
    <span
      className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.fg, borderColor: s.bd }}
    >
      {children}
    </span>
  );
}

export default function SecuritySettingsPage() {
  const mock = React.useMemo(
    () => ({
      security: {
        passwordStatus: "Strong" as const,
        twoFactorEnabled: false,
        activeSessions: [
          {
            id: "sess-1",
            device: "MacBook Air",
            browser: "Chrome",
            location: "Kolkata, India",
            ip: "203.0.113.24",
            lastActive: "Today",
            current: true,
          },
          {
            id: "sess-2",
            device: "iPhone",
            browser: "Safari",
            location: "Kolkata, India",
            ip: "198.51.100.9",
            lastActive: "Yesterday",
            current: false,
          },
          {
            id: "sess-3",
            device: "Windows PC",
            browser: "Edge",
            location: "Bangalore, India",
            ip: "192.0.2.41",
            lastActive: "3 days ago",
            current: false,
          },
        ],
      },
      loginHistory: [
        {
          id: "lh-1",
          type: "Successful login",
          at: "Today · 09:14",
          tone: "success" as const,
        },
        {
          id: "lh-2",
          type: "Password changed",
          at: "Yesterday · 18:02",
          tone: "primary" as const,
        },
        {
          id: "lh-3",
          type: "Failed login attempt",
          at: "Yesterday · 11:44",
          tone: "danger" as const,
        },
        {
          id: "lh-4",
          type: "2FA enabled",
          at: "Jan 14 · 15:22",
          tone: "warning" as const,
        },
        {
          id: "lh-5",
          type: "Session revoked",
          at: "Jan 02 · 08:31",
          tone: "primary" as const,
        },
      ],
      preferences: {
        emailNewLogin: true,
        emailPasswordChange: true,
        requireReauthExports: false,
        autoLogoutInactivity: true,
      },
    }),
    [],
  );

  const passwordChecklistFromWatch = (password: string) =>
    evaluatePassword(password);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    setError,
    clearErrors,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const watchedNewPassword = watchPassword("newPassword");
  const watchedCurrentPassword = watchPassword("currentPassword");
  const checklist = React.useMemo(
    () => passwordChecklistFromWatch(watchedNewPassword),
    [watchedNewPassword],
  );

  const strengthScore = React.useMemo(
    () => scorePassword(watchedNewPassword),
    [watchedNewPassword],
  );

  const [passwordMsg, setPasswordMsg] = React.useState<
    | { status: "idle" }
    | { status: "saving" }
    | { status: "success"; message: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const onSubmitPassword = async (data: PasswordValues) => {
    setPasswordMsg({ status: "saving" });
    clearErrors();

    // Mock async server action
    await new Promise((r) => setTimeout(r, 950));

    // Simple mock success criteria
    const looksCompromised = data.newPassword
      .toLowerCase()
      .includes("password");
    if (looksCompromised) {
      setError("newPassword", {
        message: "This new password looks unsafe. Choose a different one.",
      });
      setPasswordMsg({
        status: "error",
        message: "Update failed. Please review the highlighted fields.",
      });
      return;
    }

    if (data.newPassword === data.currentPassword) {
      setPasswordMsg({
        status: "error",
        message: "New password must be different from current password.",
      });
      return;
    }

    setPasswordMsg({
      status: "success",
      message: "Password changed successfully.",
    });
    await new Promise((r) => setTimeout(r, 900));
    resetPasswordForm();
    await new Promise((r) => setTimeout(r, 1200));
    setPasswordMsg({ status: "idle" });
  };

  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [twoFactorPhase, setTwoFactorPhase] = React.useState<
    "idle" | "verifying" | "enabled"
  >("idle");
  const [qrSeed] = React.useState(
    () => `biaslens-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
  );

  const {
    register: register2FA,
    handleSubmit: handleSubmit2FA,
    setError: set2FAError,
    clearErrors: clear2FAErrors,
    reset: reset2FA,
    watch: watch2FA,
    formState: { errors: twoFactorErrors, isSubmitting: is2FASubmitting },
  } = useForm<TwoFactorForm>({
    resolver: zodResolver(twoFactorSchema),
    mode: "onChange",
    defaultValues: { code: "" },
  });

  const watched2FAcode = watch2FA("code");
  const [twoFactorMsg, setTwoFactorMsg] = React.useState<
    | { status: "idle" }
    | { status: "saving" }
    | { status: "success"; message: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const onEnable2FA = async (values: TwoFactorForm) => {
    setTwoFactorMsg({ status: "saving" });
    clear2FAErrors();
    setTwoFactorPhase("verifying");

    await new Promise((r) => setTimeout(r, 900));

    // Mock verification: accept any 6 digits that are not all zeros.
    if (/^0{6}$/.test(values.code)) {
      set2FAError("code", { message: "That code didn’t work. Try again." });
      setTwoFactorPhase("idle");
      setTwoFactorMsg({ status: "error", message: "Verification failed." });
      return;
    }

    setTwoFactorEnabled(true);
    setTwoFactorPhase("enabled");
    setTwoFactorMsg({
      status: "success",
      message: "Two-factor authentication enabled.",
    });
    await new Promise((r) => setTimeout(r, 1100));
    setTwoFactorMsg({ status: "idle" });
    reset2FA();
    await new Promise((r) => setTimeout(r, 800));
    setTwoFactorPhase("idle");
  };

  const activeSessions = mock.security.activeSessions;

  const [sessions, setSessions] = React.useState(activeSessions);
  const currentSessionId = React.useMemo(
    () => sessions.find((s) => s.current)?.id ?? "",
    [sessions],
  );

  const [sessionMsg, setSessionMsg] = React.useState<
    | { status: "idle" }
    | { status: "success"; message: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const revokeSession = async (sessionId: string) => {
    await new Promise((r) => setTimeout(r, 650));

    if (sessionId === currentSessionId) {
      setSessionMsg({
        status: "error",
        message: "You can’t revoke your current session.",
      });
      return;
    }

    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setSessionMsg({ status: "success", message: "Session revoked." });
    await new Promise((r) => setTimeout(r, 1100));
    setSessionMsg({ status: "idle" });
  };

  const revokeAllOtherSessions = async () => {
    await new Promise((r) => setTimeout(r, 800));

    setSessions((prev) => prev.filter((s) => s.id === currentSessionId));
    setSessionMsg({
      status: "success",
      message: "All other sessions revoked.",
    });
    await new Promise((r) => setTimeout(r, 1100));
    setSessionMsg({ status: "idle" });
  };

  const [prefs, setPrefs] = React.useState({
    emailNewLogin: mock.preferences.emailNewLogin,
    emailPasswordChange: mock.preferences.emailPasswordChange,
    requireReauthExports: mock.preferences.requireReauthExports,
    autoLogoutInactivity: mock.preferences.autoLogoutInactivity,
  });

  const [prefsMsg, setPrefsMsg] = React.useState<
    | { status: "idle" }
    | { status: "saving" }
    | { status: "success"; message: string }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const savePreferences = async () => {
    setPrefsMsg({ status: "saving" });
    await new Promise((r) => setTimeout(r, 800));
    setPrefsMsg({
      status: "success",
      message: "Security preferences updated.",
    });
    await new Promise((r) => setTimeout(r, 1100));
    setPrefsMsg({ status: "idle" });
  };

  const passwordStatusTone =
    mock.security.passwordStatus === "Strong" ? "success" : "warning";

  const lastLogin = "Today";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
            Security
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
            Manage password, two-factor authentication, sessions, login history,
            and security preferences.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm text-[#6E6D7A]">
            <span className="font-semibold text-[#0D0C22]">Enterprise</span>{" "}
            security controls
          </div>
        </div>
      </div>

      {/* 1) Security Overview Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_24px_64px_rgba(13,12,34,0.03)] md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                <ShieldCheck
                  size={18}
                  className="text-[#2563EB]"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">
                  Password Status
                </p>
                <p
                  className="mt-2 text-sm font-semibold"
                  style={{
                    color:
                      passwordStatusTone === "success"
                        ? BRAND.success
                        : BRAND.warning,
                  }}
                >
                  {mock.security.passwordStatus}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_24px_64px_rgba(13,12,34,0.03)] md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                <KeyRound
                  size={18}
                  className="text-[#2563EB]"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">
                  Two-Factor Auth
                </p>
                <div className="mt-2">
                  {twoFactorEnabled ? (
                    <Badge tone="success">Enabled</Badge>
                  ) : (
                    <Badge tone="warning">Disabled</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_24px_64px_rgba(13,12,34,0.03)] md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                <Wifi size={18} className="text-[#2563EB]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">
                  Active Sessions
                </p>
                <p className="mt-2 text-sm font-semibold">{sessions.length}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_24px_64px_rgba(13,12,34,0.03)] md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                <Clock
                  size={18}
                  className="text-[#2563EB]"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">
                  Last Login
                </p>
                <p className="mt-2 text-sm font-semibold">{lastLogin}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main column */}
        <div className="lg:col-span-7 space-y-6">
          {/* 2) Change Password Form */}
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                  <KeyRound
                    size={18}
                    className="text-[#2563EB]"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    Change Password
                  </p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">
                    Strengthen your account with a strong password.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmitPassword(onSubmitPassword)}
              className="mt-6 space-y-5"
              aria-label="Change password form"
            >
              <PasswordFieldsRHF
                register={registerPassword}
                errors={passwordErrors}
                isSubmitting={isPasswordSubmitting}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                  <Meter score={strengthScore} />
                </div>
                <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                    Live checklist
                  </p>
                  <ul className="mt-4 space-y-3">
                    <ChecklistItem ok={checklist.minLen}>
                      Minimum 8 characters
                    </ChecklistItem>
                    <ChecklistItem ok={checklist.upper}>
                      At least 1 uppercase letter
                    </ChecklistItem>
                    <ChecklistItem ok={checklist.lower}>
                      At least 1 lowercase letter
                    </ChecklistItem>
                    <ChecklistItem ok={checklist.number}>
                      At least 1 number
                    </ChecklistItem>
                    <ChecklistItem ok={checklist.special}>
                      At least 1 special character
                    </ChecklistItem>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-[#6E6D7A]" aria-live="polite">
                  Use a unique password you don’t reuse elsewhere.
                </div>
                <Button
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8] disabled:opacity-60"
                >
                  {isPasswordSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </div>

              <div className="min-h-[52px]">
                <AnimatePresence>
                  {passwordMsg.status === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-[1.25rem] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] p-4"
                      role="status"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2
                          className="text-[#22C55E]"
                          size={18}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#0D0C22]">
                            Success
                          </p>
                          <p className="mt-1 text-sm text-[#6E6D7A]">
                            {passwordMsg.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}

                  {passwordMsg.status === "error" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-[1.25rem] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.10)] p-4"
                      role="alert"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className="text-[#EF4444]"
                          size={18}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#0D0C22]">
                            Could not update
                          </p>
                          <p className="mt-1 text-sm text-[#6E6D7A]">
                            {passwordMsg.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}

                  {passwordMsg.status === "saving" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4"
                      role="status"
                    >
                      <div className="flex items-start gap-3">
                        <ShieldCheck
                          className="text-[#2563EB]"
                          size={18}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#0D0C22]">
                            Updating
                          </p>
                          <p className="mt-1 text-sm text-[#6E6D7A]">
                            Validating and applying changes…
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </form>
          </Card>

          {/* 3) Two-Factor Authentication */}
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                  <ShieldCheck
                    size={18}
                    className="text-[#2563EB]"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    Two-Factor Authentication
                  </p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">
                    Add an extra layer of protection with 2FA.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">
                      Authenticator setup
                    </p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">
                      Scan the QR code with your authenticator app.
                    </p>
                  </div>
                  {!twoFactorEnabled ? (
                    <Badge tone="warning">Disabled</Badge>
                  ) : (
                    <Badge tone="success">Enabled</Badge>
                  )}
                </div>

                <div className="mt-4 rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                      QR code
                    </p>
                    <span className="text-xs font-semibold text-[#6E6D7A]">
                      Seed: {qrSeed}
                    </span>
                  </div>

                  <div
                    className="mt-3 flex h-44 items-center justify-center rounded-[1rem] border border-[#E7E7E9] bg-[#F6F8FB]"
                    aria-label="QR code placeholder"
                    role="img"
                  >
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#0D0C22]">
                        QR placeholder
                      </p>
                      <p className="mt-1 text-xs text-[#6E6D7A]">(Mock only)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    Recovery codes
                  </p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">
                    Save your codes in a secure place.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-[1rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-xs font-semibold text-[#6E6D7A]"
                        aria-label={`Recovery code ${i + 1}`}
                      >
                        XXXX-XXXX-{(i + 1).toString().padStart(2, "0")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                <p className="text-sm font-semibold text-[#0D0C22]">
                  Verify & enable
                </p>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  Enter the 6-digit code from your authenticator app.
                </p>

                <form
                  onSubmit={handleSubmit2FA(onEnable2FA)}
                  className="mt-5 space-y-4"
                  aria-label="Enable two-factor authentication"
                >
                  <div className="space-y-2">
                    <FieldLabel htmlFor="twoFactorCode">
                      Verification code
                    </FieldLabel>
                    <FieldInput
                      id="twoFactorCode"
                      type="text"
                      inputMode="numeric"
                      placeholder="6-digit code"
                      autoComplete="one-time-code"
                      aria-invalid={!!twoFactorErrors.code}
                      disabled={
                        twoFactorEnabled ||
                        is2FASubmitting ||
                        twoFactorPhase === "verifying"
                      }
                      className="text-center tracking-[0.08em]"
                      maxLength={8}
                      {...register2FA("code")}
                    />
                    {twoFactorErrors.code ? (
                      <p className="text-sm text-[#EF4444]">
                        {twoFactorErrors.code.message}
                      </p>
                    ) : null}
                    <div className="text-xs text-[#6E6D7A]" aria-live="polite">
                      {twoFactorEnabled
                        ? "2FA is already enabled."
                        : watched2FAcode.length >= 6
                          ? "Looks good — submit to verify."
                          : "Waiting for a 6-digit code."}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      disabled={
                        twoFactorEnabled ||
                        is2FASubmitting ||
                        twoFactorPhase === "verifying"
                      }
                      className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8] disabled:opacity-60"
                    >
                      {twoFactorPhase === "verifying" || is2FASubmitting
                        ? "Verifying…"
                        : twoFactorEnabled
                          ? "Enabled"
                          : "Verify & Enable"}
                    </Button>

                    <div className="sm:text-right">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={twoFactorEnabled}
                        onClick={() => {
                          // Mock: just reveal setup; we keep UI always visible.
                          setTwoFactorMsg({ status: "idle" });
                        }}
                        className="rounded-[1.25rem] border-[#E7E7E9] text-[#6E6D7A] hover:bg-[#F6F8FB] disabled:opacity-60"
                      >
                        {twoFactorEnabled ? "2FA is enabled" : "Enable 2FA"}
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {twoFactorMsg.status === "success" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-[1.25rem] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] p-4"
                        role="status"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            className="text-[#22C55E]"
                            size={18}
                            aria-hidden="true"
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#0D0C22]">
                              Success
                            </p>
                            <p className="mt-1 text-sm text-[#6E6D7A]">
                              {twoFactorMsg.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}

                    {twoFactorMsg.status === "error" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-[1.25rem] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.10)] p-4"
                        role="alert"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle
                            className="text-[#EF4444]"
                            size={18}
                            aria-hidden="true"
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#0D0C22]">
                              Verification failed
                            </p>
                            <p className="mt-1 text-sm text-[#6E6D7A]">
                              {twoFactorMsg.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </Card>

          {/* 4) Active Sessions Management */}
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                  <Laptop
                    size={18}
                    className="text-[#2563EB]"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    Active Sessions
                  </p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">
                    Review devices and revoke access immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={revokeAllOtherSessions}
                  disabled={sessions.length <= 1}
                  className="rounded-[1.25rem] border-[#E7E7E9] text-[#6E6D7A] hover:bg-[#F6F8FB] disabled:opacity-60"
                >
                  Revoke all other sessions
                </Button>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-[#E7E7E9]">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#F6F8FB]">
                    {[
                      "Device",
                      "Browser",
                      "Location",
                      "IP Address",
                      "Last Active",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="border-t border-[#E7E7E9]">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]"
                            aria-hidden="true"
                          >
                            {s.device.toLowerCase().includes("iphone") ? (
                              <Smartphone
                                size={18}
                                className="text-[#2563EB]"
                              />
                            ) : (
                              <Laptop size={18} className="text-[#2563EB]" />
                            )}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[#0D0C22]">
                              {s.device}
                            </p>
                            <p className="mt-1 text-xs text-[#6E6D7A]">
                              ID: {s.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#0D0C22] font-medium">
                        {s.browser}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#6E6D7A]">
                        {s.location}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#6E6D7A] font-medium">
                        {s.ip}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#6E6D7A]">
                        {s.lastActive}
                      </td>
                      <td className="px-4 py-4">
                        {s.current ? (
                          <Badge tone="primary">Current</Badge>
                        ) : (
                          <Badge tone="success">Active</Badge>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={s.current}
                            onClick={() => revokeSession(s.id)}
                            className="rounded-[1.25rem] border-[#E7E7E9] text-[#6E6D7A] hover:bg-[#F6F8FB] disabled:opacity-60"
                          >
                            Revoke
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-sm text-[#6E6D7A]"
                      >
                        No active sessions.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="mt-4 min-h-[52px]">
              <AnimatePresence>
                {sessionMsg.status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-[1.25rem] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] p-4"
                    role="status"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="text-[#22C55E]"
                        size={18}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#0D0C22]">
                          Done
                        </p>
                        <p className="mt-1 text-sm text-[#6E6D7A]">
                          {sessionMsg.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}

                {sessionMsg.status === "error" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-[1.25rem] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.10)] p-4"
                    role="alert"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className="text-[#EF4444]"
                        size={18}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#0D0C22]">
                          Can’t revoke
                        </p>
                        <p className="mt-1 text-sm text-[#6E6D7A]">
                          {sessionMsg.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-6">
          {/* 5) Login History */}
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                  <Globe
                    size={18}
                    className="text-[#2563EB]"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    Login History
                  </p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">
                    A timeline of important security events.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {mock.loginHistory.map((row) => (
                <div
                  key={row.id}
                  className="flex items-start justify-between gap-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4"
                  role="group"
                  aria-label={row.type}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-10 w-10 place-items-center rounded-2xl border"
                        style={{
                          background:
                            row.tone === "success"
                              ? "rgba(34,197,94,0.10)"
                              : row.tone === "danger"
                                ? "rgba(239,68,68,0.10)"
                                : "rgba(37,99,235,0.10)",
                          borderColor:
                            row.tone === "success"
                              ? "rgba(34,197,94,0.25)"
                              : row.tone === "danger"
                                ? "rgba(239,68,68,0.25)"
                                : "rgba(37,99,235,0.25)",
                          color:
                            row.tone === "success"
                              ? BRAND.success
                              : row.tone === "danger"
                                ? BRAND.danger
                                : BRAND.primary,
                        }}
                        aria-hidden="true"
                      >
                        <ShieldCheck size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0D0C22]">
                          {row.type}
                        </p>
                        <p className="mt-1 text-xs text-[#6E6D7A]">{row.at}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {row.tone === "success" ? (
                      <Badge tone="success">OK</Badge>
                    ) : null}
                    {row.tone === "danger" ? (
                      <Badge tone="danger">Risk</Badge>
                    ) : null}
                    {row.tone === "warning" ? (
                      <Badge tone="warning">Review</Badge>
                    ) : null}
                    {row.tone === "primary" ? (
                      <Badge tone="primary">Info</Badge>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 6) Security Preferences */}
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                  <ShieldCheck
                    size={18}
                    className="text-[#2563EB]"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    Security Preferences
                  </p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">
                    Tune notifications and security behavior.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4 space-y-3">
              <PreferenceToggle
                label="Email me on new login"
                description="Get alerts when a new device signs in."
                checked={prefs.emailNewLogin}
                onChange={(next) =>
                  setPrefs((p) => ({ ...p, emailNewLogin: next }))
                }
              />
              <PreferenceToggle
                label="Email me on password change"
                description="Receive a message after your password is updated."
                checked={prefs.emailPasswordChange}
                onChange={(next) =>
                  setPrefs((p) => ({ ...p, emailPasswordChange: next }))
                }
              />
              <PreferenceToggle
                label="Require re-authentication for report exports"
                description="Ask for password confirmation before exporting reports."
                checked={prefs.requireReauthExports}
                onChange={(next) =>
                  setPrefs((p) => ({ ...p, requireReauthExports: next }))
                }
              />
              <PreferenceToggle
                label="Auto logout after inactivity"
                description="Automatically sign out if you’re inactive for a while."
                checked={prefs.autoLogoutInactivity}
                onChange={(next) =>
                  setPrefs((p) => ({ ...p, autoLogoutInactivity: next }))
                }
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-[#6E6D7A]">
                Changes are applied instantly (mock).
              </div>
              <Button
                type="button"
                onClick={savePreferences}
                disabled={prefsMsg.status === "saving"}
                className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8] disabled:opacity-60"
              >
                {prefsMsg.status === "saving"
                  ? "Saving..."
                  : "Save preferences"}
              </Button>
            </div>

            <div className="mt-4 min-h-[52px]">
              <AnimatePresence>
                {prefsMsg.status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-[1.25rem] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] p-4"
                    role="status"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="text-[#22C55E]"
                        size={18}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#0D0C22]">
                          Success
                        </p>
                        <p className="mt-1 text-sm text-[#6E6D7A]">
                          {prefsMsg.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
                {prefsMsg.status === "error" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-[1.25rem] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.10)] p-4"
                    role="alert"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className="text-[#EF4444]"
                        size={18}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#0D0C22]">
                          Error
                        </p>
                        <p className="mt-1 text-sm text-[#6E6D7A]">
                          {prefsMsg.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#0D0C22]">{label}</p>
        <p className="mt-1 text-sm text-[#6E6D7A]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={
          "relative inline-flex h-6 w-11 items-center rounded-full border transition " +
          (checked
            ? "border-[#2563EB] bg-[#2563EB]"
            : "border-[#E7E7E9] bg-[#FFFFFF]")
        }
      >
        <span
          className={
            "inline-block h-5 w-5 transform rounded-full bg-[#FFFFFF] shadow transition " +
            (checked ? "translate-x-5" : "translate-x-1")
          }
        />
      </button>
    </div>
  );
}

function PasswordFieldsRHF({
  register,
  errors,
  isSubmitting,
}: {
  register: (
    name: "currentPassword" | "newPassword" | "confirmNewPassword",
  ) => unknown;
  errors: Record<string, { message?: string }>;
  isSubmitting: boolean;
}) {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <div className="space-y-4" aria-label="Change password fields">
      <FieldPasswordInputRHF
        id="currentPassword"
        label="Current Password"
        type="password"
        placeholder="Enter current password"
        autoComplete="current-password"
        ariaInvalid={!!errors.currentPassword}
        disabled={isSubmitting}
        className=""
        register={register}
        buttonLabel={showCurrent ? "Hide" : "Show"}
        show={showCurrent}
        onToggle={() => setShowCurrent((s) => !s)}
      />
      {errors.currentPassword ? (
        <p className="text-sm text-[#EF4444]" role="alert">
          {errors.currentPassword.message}
        </p>
      ) : null}

      <FieldPasswordInputRHF
        id="newPassword"
        label="New Password"
        type="password"
        placeholder="Create a new password"
        autoComplete="new-password"
        ariaInvalid={!!errors.newPassword}
        disabled={isSubmitting}
        register={register}
        buttonLabel={showNew ? "Hide" : "Show"}
        show={showNew}
        onToggle={() => setShowNew((s) => !s)}
      />
      {errors.newPassword ? (
        <p className="text-sm text-[#EF4444]" role="alert">
          {errors.newPassword.message}
        </p>
      ) : null}

      <FieldPasswordInputRHF
        id="confirmNewPassword"
        label="Confirm New Password"
        type="password"
        placeholder="Re-enter new password"
        autoComplete="new-password"
        ariaInvalid={!!errors.confirmNewPassword}
        disabled={isSubmitting}
        register={register}
        buttonLabel={showConfirm ? "Hide" : "Show"}
        show={showConfirm}
        onToggle={() => setShowConfirm((s) => !s)}
      />
      {errors.confirmNewPassword ? (
        <p className="text-sm text-[#EF4444]" role="alert">
          {errors.confirmNewPassword.message}
        </p>
      ) : null}
    </div>
  );
}
