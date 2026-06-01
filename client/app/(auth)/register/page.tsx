"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Check,
  Eye,
  EyeOff,
  FileCheck2,
  LockKeyhole,
  MailCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import OAuth2Button from "@/components/auth/OAuth2Button";
import { ApiError } from "@/lib/api";
import { registerWithEmail } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormHelper,
  FormInput,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .min(2, "Full name must be at least 2 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Work email is required.")
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/[0-9]/, "Password must include a number.")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms to continue.",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

type SubmitState = {
  type: "success" | "error";
  message: string;
} | null;

const passwordChecks = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "Lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "Number",
    test: (value: string) => /[0-9]/.test(value),
  },
  {
    label: "Special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

const trustBadges = [
  { icon: ShieldCheck, label: "Secure Authentication" },
  { icon: MailCheck, label: "Email Verification" },
  { icon: LockKeyhole, label: "Protected APIs" },
  { icon: FileCheck2, label: "Audit Logging" },
] as const;

const auditStats = [
  { label: "Resume Score", value: "92%", tone: "text-[#2563EB]" },
  { label: "Fairness Risk", value: "Low", tone: "text-[#22C55E]" },
  { label: "Explainability", value: "High", tone: "text-[#2563EB]" },
  { label: "Audit Report", value: "Ready", tone: "text-[#0D0C22]" },
] as const;

function getPasswordStrength(value: string) {
  const completedChecks = passwordChecks.filter((item) => item.test(value)).length;

  if (completedChecks <= 2) {
    return {
      label: "Needs work",
      color: "bg-[#EF4444]",
      width: `${Math.max(completedChecks, 1) * 20}%`,
    };
  }

  if (completedChecks === 3 || completedChecks === 4) {
    return {
      label: "Strong",
      color: "bg-[#F59E0B]",
      width: `${completedChecks * 20}%`,
    };
  }

  return {
    label: "Excellent",
    color: "bg-[#22C55E]",
    width: "100%",
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
    null,
  );
  const [oauthError, setOauthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });
  const passwordStrength = getPasswordStrength(passwordValue ?? "");
  const passwordChecklist = passwordChecks.map((item) => ({
    label: item.label,
    isComplete: item.test(passwordValue ?? ""),
  }));

  const onSubmit = handleSubmit(async (values) => {
    if (isSubmitting) {
      return;
    }

    setSubmitState(null);

    const payload = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password,
    };

    try {
      await registerWithEmail(payload);

      setSubmitState({
        type: "success",
        message:
          "Account created. Please check your email to verify your account.",
      });

      window.setTimeout(() => {
        router.push("/verify-email-sent");
      }, 900);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "We could not complete registration right now. Please try again in a moment.";

      setError("root", {
        type: "server",
        message,
      });
      setSubmitState({
        type: "error",
        message,
      });
    }
  });

  async function handleOAuth(provider: "google" | "github") {
    setOauthError(null);
    setOauthLoading(provider);

    try {
      setOauthError(
        `${provider === "google" ? "Google" : "GitHub"} OAuth is not connected on the backend yet.`,
      );
    } finally {
      window.setTimeout(() => setOauthLoading(null), 1200);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F6F8FB_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-center"
        >
          <Card className="w-full rounded-[2rem] border-[#E7E7E9] bg-white shadow-[0_30px_80px_rgba(13,12,34,0.08)]">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)]">
                      B
                    </span>
                    BiasLens
                  </Link>
                  <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                    Create your BiasLens account
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#6E6D7A] sm:text-base">
                    Launch explainable AI audits, fairness intelligence, and
                    secure resume review workflows for your hiring team.
                  </p>
                </div>
                <div className="hidden rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1 text-xs font-medium text-[#6E6D7A] sm:block">
                  Enterprise-ready onboarding
                </div>
              </div>

              <div className="space-y-3">
                <OAuth2Button
                  provider="google"
                  isLoading={oauthLoading === "google"}
                  onClick={handleOAuth}
                />
                <OAuth2Button
                  provider="github"
                  isLoading={oauthLoading === "github"}
                  onClick={handleOAuth}
                />
              </div>

              {oauthError ? (
                <p className="mt-3 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                  {oauthError}
                </p>
              ) : null}

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#E7E7E9]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6D7A]">
                  Or continue with email
                </span>
                <div className="h-px flex-1 bg-[#E7E7E9]" />
              </div>

              <Form noValidate onSubmit={onSubmit} className="space-y-5">
                <FormField>
                  <FormLabel htmlFor="fullName">Full Name</FormLabel>
                  <FormInput
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    {...register("fullName")}
                  />
                  {errors.fullName ? (
                    <FormMessage id="fullName-error" role="alert">
                      {errors.fullName.message}
                    </FormMessage>
                  ) : (
                    <FormHelper>Use your real name for account verification.</FormHelper>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor="email">Work Email</FormLabel>
                  <FormInput
                    id="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@company.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <FormMessage id="email-error" role="alert">
                      {errors.email.message}
                    </FormMessage>
                  ) : (
                    <FormHelper>We will send your verification link here.</FormHelper>
                  )}
                </FormField>

                <div className="grid gap-5 lg:grid-cols-2">
                  <FormField className="lg:col-span-1">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <div className="relative">
                      <FormInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Create a secure password"
                        className="pr-12"
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                          errors.password ? "password-error" : "password-helper"
                        }
                        {...register("password")}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6D7A] transition hover:bg-[#F6F8FB] hover:text-[#0D0C22] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div
                      id="password-helper"
                      className="mt-3 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-[#0D0C22]">
                          Password strength
                        </span>
                        <span className="text-xs font-semibold text-[#6E6D7A]">
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            passwordStrength.color,
                          )}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                      <div className="mt-4 grid gap-2">
                        {passwordChecklist.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-2 text-xs text-[#6E6D7A]"
                          >
                            <span
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-full border transition",
                                item.isComplete
                                  ? "border-[#22C55E] bg-[#22C55E] text-white"
                                  : "border-[#E7E7E9] bg-white text-transparent",
                              )}
                            >
                              <Check size={12} />
                            </span>
                            <span className={item.isComplete ? "text-[#0D0C22]" : ""}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {errors.password ? (
                      <FormMessage id="password-error" role="alert">
                        {errors.password.message}
                      </FormMessage>
                    ) : null}
                  </FormField>

                  <FormField className="lg:col-span-1">
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <div className="relative">
                      <FormInput
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        className="pr-12"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={
                          errors.confirmPassword
                            ? "confirmPassword-error"
                            : undefined
                        }
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() =>
                          setShowConfirmPassword((current) => !current)
                        }
                        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6D7A] transition hover:bg-[#F6F8FB] hover:text-[#0D0C22] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword ? (
                      <FormMessage id="confirmPassword-error" role="alert">
                        {errors.confirmPassword.message}
                      </FormMessage>
                    ) : (
                      <FormHelper>Passwords must match exactly.</FormHelper>
                    )}
                  </FormField>
                </div>

                <FormField className="space-y-3">
                  <label
                    htmlFor="acceptTerms"
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3"
                  >
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-[#E7E7E9] text-[#2563EB] focus:ring-[#2563EB]"
                      aria-invalid={Boolean(errors.acceptTerms)}
                      aria-describedby={
                        errors.acceptTerms ? "acceptTerms-error" : undefined
                      }
                      {...register("acceptTerms")}
                    />
                    <span className="text-sm leading-6 text-[#6E6D7A]">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="font-medium text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.acceptTerms ? (
                    <FormMessage id="acceptTerms-error" role="alert">
                      {errors.acceptTerms.message}
                    </FormMessage>
                  ) : null}
                </FormField>

                {submitState ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
                      submitState.type === "success"
                        ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]"
                        : "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
                    )}
                  >
                    {submitState.type === "success" ? (
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <span>{submitState.message}</span>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={!isValid || isSubmitting}
                  className="h-12 w-full rounded-2xl bg-[#2563EB] text-sm font-semibold hover:bg-[#1D4ED8]"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </Form>

              <div className="mt-6 flex flex-col gap-3 border-t border-[#E7E7E9] pt-6 text-sm text-[#6E6D7A] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                  >
                    Sign in
                  </Link>
                </p>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#6E6D7A]">
                  <Sparkles size={14} />
                  Trusted by modern hiring teams
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          className="hidden lg:flex"
        >
          <div className="relative flex w-full overflow-hidden rounded-[2rem] border border-[#E7E7E9] bg-[radial-gradient(circle_at_top,#E8F0FF_0%,#F6F8FB_42%,#FFFFFF_100%)] p-8 shadow-[0_30px_80px_rgba(13,12,34,0.08)]">
            <div className="absolute inset-x-8 top-8 h-32 rounded-full bg-[#2563EB]/10 blur-3xl" />
            <div className="relative z-10 flex w-full flex-col">
              <div className="flex items-center justify-between rounded-[1.75rem] border border-white/70 bg-white/80 px-5 py-4 backdrop-blur">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2563EB]">
                    BiasLens Intelligence
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                    Audit resumes with explainable AI
                  </h2>
                </div>
                <div className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB]">
                  Live preview
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {auditStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + index * 0.08, duration: 0.35 }}
                    className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)] backdrop-blur"
                  >
                    <p className="text-sm text-[#6E6D7A]">{stat.label}</p>
                    <p className={cn("mt-3 text-2xl font-semibold", stat.tone)}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-[0_20px_50px_rgba(13,12,34,0.06)] backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0D0C22]">
                      Candidate Fairness Summary
                    </p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">
                      Explainable scoring, low fairness risk, and traceable review
                      signals in one workflow.
                    </p>
                  </div>
                  <div className="rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-[#15803D]">
                    Protected
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {trustBadges.map((badge) => (
                    <div
                      key={badge.label}
                      className="flex items-center justify-between rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-sm">
                          <badge.icon size={18} />
                        </span>
                        <span className="text-sm font-medium text-[#0D0C22]">
                          {badge.label}
                        </span>
                      </div>
                      <ArrowRight size={16} className="text-[#6E6D7A]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto rounded-[1.75rem] border border-[#DBEAFE] bg-[#EFF6FF] p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-[0_16px_40px_rgba(37,99,235,0.3)]">
                    <BadgeCheck size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">
                      Verification-first onboarding
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#45628F]">
                      New workspaces are gated behind email verification so only
                      trusted users can access candidate intelligence and audit
                      reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
