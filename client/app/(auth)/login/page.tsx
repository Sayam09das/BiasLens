"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, LockKeyhole, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import LoginForm, { type LoginFormValues } from "@/components/auth/LoginForm";
import OAuth2Button from "@/components/auth/OAuth2Button";
import { ApiError } from "@/lib/api";
import { loginWithEmail } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

const trustBadges = [
  { icon: ShieldCheck, label: "Secure Authentication" },
  { icon: MailCheck, label: "Verified Access" },
  { icon: LockKeyhole, label: "Protected Sessions" },
  { icon: BadgeCheck, label: "Audit Logging" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  async function handleLogin(values: LoginFormValues) {
    try {
      await loginWithEmail({
        email: values.email.trim(),
        password: values.password,
        rememberMe: values.rememberMe ?? false,
      });
      router.push("/dashboard");
      return;
    } catch (error) {
      if (error instanceof ApiError && /verify your email/i.test(error.message)) {
        router.push(`/verify-email-sent?email=${encodeURIComponent(values.email.trim())}`);
        return;
      }

      return {
        error:
          error instanceof ApiError
            ? error.message
            : "We could not complete sign-in right now. Please try again in a moment.",
      };
    }
  }

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
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-center"
        >
          <Card className="w-full rounded-4xl border-[#E7E7E9] bg-white shadow-[0_30px_80px_rgba(13,12,34,0.08)]">
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
                    Sign in to BiasLens
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#6E6D7A] sm:text-base">
                    Access secure resume audits, explainable AI insights, and fairness intelligence workflows.
                  </p>
                </div>
                <div className="hidden rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1 text-xs font-medium text-[#6E6D7A] sm:block">
                  Enterprise-grade access
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

              <LoginForm
                onSubmit={handleLogin}
                registerHref="/register"
                forgotPasswordHref="/forgot-password"
                className="border-0 bg-transparent shadow-none"
              />

              <div className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#6E6D7A]">
                <Sparkles size={14} />
                Trusted by modern hiring teams
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
                  BiasLens Workspace
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                  Resume intelligence with explainable review trails
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6E6D7A]">
                  Sign in to continue reviewing audit-ready reports, candidate fairness signals, and secure decision logs.
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                {trustBadges.map((badge, index) => (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + index * 0.08, duration: 0.35 }}
                    className="flex items-center justify-between rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)] backdrop-blur"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                        <badge.icon size={18} />
                      </span>
                      <span className="text-sm font-medium text-[#0D0C22]">
                        {badge.label}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-[#6E6D7A]" />
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto rounded-[1.75rem] border border-[#DBEAFE] bg-[#EFF6FF] p-6">
                <p className="text-sm font-semibold text-[#0D0C22]">
                  Verification-first security
                </p>
                <p className="mt-2 text-sm leading-6 text-[#45628F]">
                  BiasLens protects candidate intelligence with verified accounts, secure sessions, and traceable audit access.
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
