"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, MailCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { verifyEmailToken } from "@/lib/auth";

type VerificationState =
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [state, setState] = useState<VerificationState>(() =>
    token
      ? { status: "loading" }
      : {
          status: "error",
          message: "This verification link is missing its token. Request a new verification email to continue.",
        }
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    async function runVerification() {
      try {
        await verifyEmailToken(token);
        if (!cancelled) {
          setState({
            status: "success",
            message: "Your email is verified. You can sign in to BiasLens now.",
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              error instanceof ApiError
                ? error.message
                : "We could not verify this email link right now. Please request a new one.",
          });
        }
      }
    }

    void runVerification();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const isLoading = state.status === "loading";
  const isSuccess = state.status === "success";

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
                {isLoading ? <Loader2 size={28} className="animate-spin" /> : isSuccess ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                {isLoading ? "Verifying your email" : isSuccess ? "Email verified" : "Verification needed"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6E6D7A] sm:text-base">
                {state.message}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {isSuccess ? (
                  <Button asChild className="h-12 rounded-2xl bg-[#2563EB] px-6 hover:bg-[#1D4ED8]">
                    <Link href="/login">
                      Go to sign in
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="h-12 rounded-2xl bg-[#2563EB] px-6 hover:bg-[#1D4ED8]">
                    <Link href="/resend-verification">
                      Request new link
                      <RefreshCcw size={16} className="ml-2" />
                    </Link>
                  </Button>
                )}

                <Button asChild variant="outline" className="h-12 rounded-2xl border-[#E7E7E9] bg-white px-6 text-[#0D0C22] hover:bg-[#F6F8FB]">
                  <Link href="/">Back home</Link>
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
                  Secure onboarding
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                  Every account starts with trusted identity
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6E6D7A]">
                  Verification protects candidate data, shared reports, and the decision trail inside BiasLens.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { icon: MailCheck, label: "Email identity confirmation" },
                  { icon: ShieldCheck, label: "Protected dashboard access" },
                  { icon: CheckCircle2, label: "Ready for secure sign-in" },
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
