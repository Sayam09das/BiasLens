"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MailCheck, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const nextSteps = [
  "Check your inbox for the BiasLens verification email.",
  "Open the secure verification link to activate your account.",
  "Return to sign in once your email is verified.",
] as const;

export default function VerifyEmailSentPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F6F8FB_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-center"
        >
          <Card className="w-full rounded-[2rem] border-[#E7E7E9] bg-white shadow-[0_30px_80px_rgba(13,12,34,0.08)]">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)]">
                  B
                </span>
                BiasLens
              </Link>

              <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#EFF6FF] text-[#2563EB] shadow-[0_16px_40px_rgba(37,99,235,0.18)]">
                <MailCheck size={28} />
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Verification email sent
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6E6D7A] sm:text-base">
                Your account was created successfully. Please check your email and verify your
                address before signing in to BiasLens.
              </p>

              <div className="mt-8 space-y-4">
                {nextSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-[#2563EB] shadow-sm">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-[#0D0C22]">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-12 rounded-2xl bg-[#2563EB] px-6 hover:bg-[#1D4ED8]">
                  <Link href="/login">
                    Go to sign in
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-2xl border-[#E7E7E9] bg-white px-6 text-[#0D0C22] hover:bg-[#F6F8FB]"
                >
                  <Link href="/register">Use a different email</Link>
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
          <div className="relative flex w-full overflow-hidden rounded-[2rem] border border-[#E7E7E9] bg-[radial-gradient(circle_at_top,#E8F0FF_0%,#F6F8FB_42%,#FFFFFF_100%)] p-8 shadow-[0_30px_80px_rgba(13,12,34,0.08)]">
            <div className="absolute inset-x-8 top-8 h-32 rounded-full bg-[#2563EB]/10 blur-3xl" />
            <div className="relative z-10 flex w-full flex-col">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 px-5 py-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#2563EB]">
                  <Sparkles size={14} />
                  Account security
                </div>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                  Verification-first onboarding
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6E6D7A]">
                  BiasLens only activates accounts after email verification to protect hiring data,
                  audit reports, and secure team access.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { icon: BadgeCheck, label: "Account created successfully" },
                  { icon: MailCheck, label: "Verification link sent" },
                  { icon: ShieldCheck, label: "Protected workspace access" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)] backdrop-blur"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                        <item.icon size={18} />
                      </span>
                      <span className="text-sm font-medium text-[#0D0C22]">{item.label}</span>
                    </div>
                    <ArrowRight size={16} className="text-[#6E6D7A]" />
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
