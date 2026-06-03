"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormHelper, FormInput, FormLabel, FormMessage } from "@/components/ui/form";
import { ApiError } from "@/lib/api";
import { requestPasswordReset } from "@/lib/auth";

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitState, setSubmitState] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({ type: "idle" });

    try {
      await requestPasswordReset({ email: values.email.trim() });
      setSubmitState({
        type: "success",
        message: "If that account exists, we sent a secure password reset link to the inbox.",
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "We could not send the reset link right now. Please try again in a moment.";

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
                <KeyRound size={28} />
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Forgot your password?
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6E6D7A] sm:text-base">
                Enter the email tied to your BiasLens account and we&apos;ll send a secure reset link.
              </p>

              <Form noValidate onSubmit={onSubmit} className="mt-8 space-y-5">
                <FormField>
                  <FormLabel htmlFor="forgot-email">Work Email</FormLabel>
                  <FormInput
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    aria-invalid={Boolean(errors.email)}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <FormMessage role="alert">{errors.email.message}</FormMessage>
                  ) : (
                    <FormHelper>We&apos;ll send the reset link to this inbox.</FormHelper>
                  )}
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
                  disabled={!isValid || isSubmitting}
                  className="h-12 w-full rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </Form>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="h-12 rounded-2xl border-[#E7E7E9] bg-white px-6 text-[#0D0C22] hover:bg-[#F6F8FB]">
                  <Link href="/login">Back to sign in</Link>
                </Button>
                <Button asChild className="h-12 rounded-2xl bg-[#0D0C22] px-6 hover:bg-[#1F1D3A]">
                  <Link href="/resend-verification">
                    Need verification instead?
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
                  Account recovery
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                  Secure your workspace access without losing momentum
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6E6D7A]">
                  Password recovery is token-based, time-limited, and fully aligned with your BiasLens auth logs.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { icon: Mail, label: "Reset link delivered by email" },
                  { icon: ShieldCheck, label: "Existing sessions invalidated on reset" },
                  { icon: CheckCircle2, label: "Ready to sign back in securely" },
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
