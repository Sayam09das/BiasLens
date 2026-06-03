"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormHelper, FormInput, FormLabel, FormMessage } from "@/components/ui/form";
import { ApiError } from "@/lib/api";
import { resetPasswordWithToken } from "@/lib/auth";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/[0-9]/, "Password must include a number.")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const passwordChecks = [
  { label: "8+ characters", test: (value: string) => value.length >= 8 },
  { label: "Uppercase", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Lowercase", test: (value: string) => /[a-z]/.test(value) },
  { label: "Number", test: (value: string) => /[0-9]/.test(value) },
  { label: "Special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitState, setSubmitState] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token) {
      setSubmitState({
        type: "error",
        message: "This reset link is missing its token. Request a new password reset email.",
      });
      return;
    }

    setSubmitState({ type: "idle" });

    try {
      await resetPasswordWithToken({
        token,
        password: values.password,
      });
      setSubmitState({
        type: "success",
        message: "Password reset complete. Redirecting you to sign in.",
      });

      window.setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "We could not reset your password right now. Please request a new reset link.";

      setError("root", { type: "server", message });
      setSubmitState({
        type: "error",
        message,
      });
    }
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F6F8FB_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.92fr)]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-center"
        >
          <Card className="w-full rounded-4xl border-[#E7E7E9] bg-white shadow-[0_30px_80px_rgba(13,12,34,0.08)]">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)]">
                  B
                </span>
                BiasLens
              </Link>

              <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#EFF6FF] text-[#2563EB] shadow-[0_16px_40px_rgba(37,99,235,0.18)]">
                <LockKeyhole size={28} />
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Create a new password
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6E6D7A] sm:text-base">
                Set a strong password to restore secure access to your BiasLens workspace.
              </p>

              {!token ? (
                <div className="mt-8 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                  This reset link is incomplete. Request a new password reset email to continue.
                </div>
              ) : null}

              <Form noValidate onSubmit={onSubmit} className="mt-8 space-y-5">
                <FormField>
                  <FormLabel htmlFor="reset-password">New Password</FormLabel>
                  <div className="relative">
                    <FormInput
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a secure password"
                      className="pr-12"
                      aria-invalid={Boolean(errors.password)}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6D7A] transition hover:bg-[#F6F8FB] hover:text-[#0D0C22]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password ? (
                    <FormMessage role="alert">{errors.password.message}</FormMessage>
                  ) : (
                    <FormHelper>Use a password you do not reuse elsewhere.</FormHelper>
                  )}
                </FormField>

                <div className="grid gap-2 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4 sm:grid-cols-2">
                  {passwordChecks.map((item) => {
                    const passed = item.test(passwordValue ?? "");
                    return (
                      <div key={item.label} className="flex items-center gap-2 text-sm">
                        <span className={passed ? "text-[#16A34A]" : "text-[#9CA3AF]"}>
                          {passed ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        </span>
                        <span className={passed ? "text-[#0D0C22]" : "text-[#6E6D7A]"}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <FormField>
                  <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
                  <div className="relative">
                    <FormInput
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your new password"
                      className="pr-12"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6D7A] transition hover:bg-[#F6F8FB] hover:text-[#0D0C22]"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword ? (
                    <FormMessage role="alert">{errors.confirmPassword.message}</FormMessage>
                  ) : null}
                </FormField>

                {submitState.type !== "idle" && submitState.message ? (
                  <div
                    className={
                      submitState.type === "success"
                        ? "rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]"
                        : "rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]"
                    }
                  >
                    {submitState.message}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={!token || !isValid || isSubmitting}
                  className="h-12 w-full rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </Form>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="h-12 rounded-2xl border-[#E7E7E9] bg-white px-6 text-[#0D0C22] hover:bg-[#F6F8FB]">
                  <Link href="/login">Back to sign in</Link>
                </Button>
                <Button asChild className="h-12 rounded-2xl bg-[#0D0C22] px-6 hover:bg-[#1F1D3A]">
                  <Link href="/forgot-password">
                    Request a new link
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
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
          <div className="relative flex w-full overflow-hidden rounded-4xl border border-[#E7E7E9] bg-[radial-gradient(circle_at_top,#E8F0FF_0%,#F6F8FB_42%,#FFFFFF_100%)] p-8 shadow-[0_30px_80px_rgba(13,12,34,0.08)]">
            <div className="absolute inset-x-8 top-8 h-32 rounded-full bg-[#2563EB]/10 blur-3xl" />
            <div className="relative z-10 flex w-full flex-col">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 px-5 py-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2563EB]">
                  Password recovery
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                  Reset access with a verified secure token
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6E6D7A]">
                  Once the password changes, prior sessions are revoked so your workspace stays protected.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { icon: ShieldCheck, label: "Token-gated password recovery" },
                  { icon: LockKeyhole, label: "Strong-password policy enforced" },
                  { icon: CheckCircle2, label: "Old sessions invalidated automatically" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)] backdrop-blur"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                      <item.icon size={18} />
                    </span>
                    <span className="text-sm font-medium text-[#0D0C22]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
