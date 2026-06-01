"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Scale,
  ArrowRight,
  Calendar,
} from "lucide-react";

type Badge = { label: string; value?: string; icon: React.ReactNode; tone: "blue" | "green" | "warning" };

function TonePill({ badge }: { badge: Badge }) {
  const toneCls =
    badge.tone === "green"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : badge.tone === "warning"
        ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${toneCls}`}>
      {badge.icon}
      <span>{badge.value ? `${badge.value} ${badge.label}` : badge.label}</span>
    </span>
  );
}

export default function CTASection() {
  const badges: Badge[] = [
    {
      label: "Resume Score",
      value: "92%",
      tone: "blue",
      icon: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />,
    },
    {
      label: "Fairness Risk",
      value: "Low",
      tone: "green",
      icon: <Scale className="h-3.5 w-3.5" aria-hidden="true" />,
    },
    {
      label: "Audit Completed",
      tone: "blue",
      icon: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />,
    },
  ];

  return (
    <section className="bg-[#FFFFFF]" aria-label="Final CTA">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_30px_90px_rgba(13,12,34,0.06)] sm:p-8">
          {/* Blue gradient accent */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#2563EB]/15 via-[#2563EB]/5 to-transparent" />
          <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-[#2563EB]/10 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left conversion copy */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  Get Started
                </span>
              </div>

              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Build More Transparent Hiring Decisions Today
              </h2>
              <p className="mt-4 max-w-[62ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
                See how explainable AI, fairness intelligence, and audit-ready reporting can improve your
                hiring workflow.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)] transition-colors hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
                >
                  Start Free Audit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-6 py-3 text-sm font-semibold text-[#0D0C22] transition-colors hover:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/35"
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Book Demo
                </motion.button>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                  <Sparkles className="mr-2 h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
                  Explainable AI
                </span>
                <span className="inline-flex items-center rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                  <Scale className="mr-2 h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
                  Fairness Monitoring
                </span>
                <span className="inline-flex items-center rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                  <ShieldCheck className="mr-2 h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
                  Enterprise Ready
                </span>
              </div>
            </div>

            {/* Right image + badges */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
                className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_30px_90px_rgba(13,12,34,0.06)]"
              >
                <div className="rounded-[1.6rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {badges.map((b) => (
                      <TonePill key={b.label} badge={b} />
                    ))}
                  </div>

                  <div className="relative mt-4 overflow-hidden rounded-[1.4rem] border border-[#E7E7E9] bg-[#FFFFFF]">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2563EB]/10 via-transparent to-transparent" />
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src="/images/cta-dashboard-preview.png"
                        alt="BiasLens audit dashboard preview"
                        fill
                        sizes="(max-width: 1024px) 100vw, 48vw"
                        className="object-contain p-3"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
