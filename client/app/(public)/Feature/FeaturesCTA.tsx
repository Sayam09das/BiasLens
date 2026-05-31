"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Calendar, ShieldCheck, Sparkles, Scale, CheckCircle2 } from "lucide-react";

type Stat = { value: string; label: string };

const BRAND = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  border: "#E7E7E9",
  text: "#0D0C22",
  muted: "#6E6D7A",
};

function TrustPill({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "primary" | "success";
}) {
  const cls =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${cls}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="rounded-[1.6rem] border border-[#E7E7E9] bg-white/60 px-4 py-4 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl">
      <div className="text-2xl font-semibold tracking-[-0.03em] text-[#0D0C22] sm:text-3xl">
        {stat.value}
      </div>
      <div className="mt-1 text-xs font-medium leading-5 text-[#6E6D7A] sm:text-sm">{stat.label}</div>
    </div>
  );
}

export default function FeaturesCTA() {
  const stats: Stat[] = [
    { value: "92%", label: "Resume Analysis Accuracy" },
    { value: "94%", label: "Fairness Confidence" },
    { value: "<10s", label: "Average Audit Time" },
    { value: "24/7", label: "Automated Auditing" },
  ];

  const trust = [
    { label: "Explainable AI", icon: <Sparkles className="h-4 w-4" aria-hidden="true" />, tone: "primary" as const },
    { label: "Fairness Monitoring", icon: <Scale className="h-4 w-4" aria-hidden="true" />, tone: "primary" as const },
    { label: "Audit Ready", icon: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />, tone: "success" as const },
    { label: "Enterprise Security", icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />, tone: "success" as const },
  ];

  return (
    <section aria-label="Ready to Get Started" className="relative overflow-hidden border-t border-[#E7E7E9] bg-[#FFFFFF]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#2563EB]/7 blur-3xl" />
        <div className="absolute -right-24 top-28 h-72 w-72 rounded-full bg-[#2563EB]/6 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
                <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                Ready to Get Started?
              </span>

              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Bring Explainability, Fairness, and Auditability Into Your Hiring Workflow
              </h2>

              <p className="mt-4 max-w-[66ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
                Move beyond black-box resume screening. Use BiasLens to analyze resumes, understand decisions, detect fairness risks, and generate audit-ready reports from one intelligent platform.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(37,99,235,0.28)] transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/35"
                >
                  Start Free Audit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#0D0C22] backdrop-blur-xl shadow-[0_16px_40px_rgba(13,12,34,0.04)] transition hover:border-[#2563EB]/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/25"
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Book Demo
                </motion.a>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {trust.map((t) => (
                  <TrustPill key={t.label} icon={t.icon} label={t.label} tone={t.tone} />
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((s) => (
                  <StatCard key={s.label} stat={s} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right dashboard */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div aria-hidden="true" className="absolute -inset-x-10 -top-14 h-[420px] rounded-full bg-[#2563EB]/10 blur-3xl" />

              <div className="relative rounded-[2.2rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_40px_140px_rgba(13,12,34,0.12)] backdrop-blur-xl">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/50 via-transparent to-white/60" />

                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#E7E7E9] bg-[#F6F8FB]">
                  <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.20)_0%,transparent_45%),radial-gradient(circle_at_80%_35%,rgba(37,99,235,0.10)_0%,transparent_55%)]" />

                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src="/images/features-cta-dashboard.png"
                      alt="BiasLens audit dashboard preview"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain p-4"
                    />

                    {/* floating info */}
                    <div className="absolute left-4 top-4 rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 text-xs backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#6E6D7A]">Resume Score</span>
                        <span className="font-semibold text-[#0D0C22]">92%</span>
                      </div>
                    </div>

                    <div className="absolute right-4 top-20 rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 text-xs backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#6E6D7A]">Job Fit</span>
                        <span className="font-semibold text-[#0D0C22]">89%</span>
                      </div>
                    </div>

                    <div className="absolute left-6 bottom-6 rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 text-xs backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#6E6D7A]">Explainability</span>
                        <span className="font-semibold text-[#0D0C22]">High</span>
                      </div>
                    </div>

                    <div className="absolute right-6 bottom-6 rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 text-xs backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#6E6D7A]">Fairness Risk</span>
                        <span className="font-semibold text-[#0D0C22]">Low</span>
                      </div>
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 top-[42%] rounded-[1.4rem] border border-[#E7E7E9] bg-white/70 px-5 py-2 text-xs font-semibold text-[#0D0C22] backdrop-blur-xl">
                      Audit Status: Completed
                    </div>

                    {/* Floating cards */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-4 bottom-[34%] rounded-[1.4rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB]/10">
                          <Sparkles className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold text-[#0D0C22]">AI Audit Ready</span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-4 bottom-[34%] rounded-[1.4rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#22C55E]/10">
                          <ShieldCheck className="h-5 w-5 text-[#22C55E]" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold text-[#0D0C22]">Fairness Verified</span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 bottom-2 rounded-[1.4rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB]/10">
                          <CheckCircle2 className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold text-[#0D0C22]">Report Generated</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

