"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  FileCheck2,
  Users,
  Bot,
  Timer,
  ArrowRight,
  Zap,
  Shield,
  CheckCircle2,
  FileText,
} from "lucide-react";

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.6rem] border border-[#E7E7E9] bg-white/70 px-5 py-4 shadow-[0_18px_50px_rgba(13,12,34,0.03)] backdrop-blur-xl">
      <div className="text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs font-medium leading-5 text-[#6E6D7A] sm:text-sm">{label}</div>
    </div>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[1.4rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-[0_16px_40px_rgba(13,12,34,0.03)]">
        {icon}
      </span>
      <span className="text-sm font-semibold text-[#0D0C22]">{label}</span>
    </div>
  );
}

function FloatingCard({
  icon,
  title,
  index,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  index: number;
  tone: "primary" | "success";
}) {
  const border = tone === "success" ? "border-[#22C55E]/30 bg-[#22C55E]/10" : "border-[#2563EB]/30 bg-[#2563EB]/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`pointer-events-none absolute right-5 rounded-[1.4rem] border ${border} bg-white/70 p-4 shadow-[0_20px_70px_rgba(13,12,34,0.08)] backdrop-blur-xl ${
        index === 0 ? "top-6" : index === 1 ? "top-20" : "bottom-6"
      }`}
      aria-hidden="true"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/70">{icon}</span>
        <div className="text-xs font-semibold tracking-[-0.01em] text-[#0D0C22]">{title}</div>
      </div>
    </motion.div>
  );
}

function DashboardPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative rounded-[2.6rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_40px_140px_rgba(13,12,34,0.12)] backdrop-blur-xl"
    >
      <div aria-hidden="true" className="absolute inset-0 rounded-[2.6rem] bg-gradient-to-b from-white/50 via-transparent to-white/60" />

      <div className="relative overflow-hidden rounded-[2.0rem] border border-[#E7E7E9] bg-[#F6F8FB]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.18)_0%,transparent_45%),radial-gradient(circle_at_85%_40%,rgba(37,99,235,0.10)_0%,transparent_55%)]" />

        <div className="relative aspect-[16/11] w-full">
          <Image
            src="/images/ai-agent-cta.png"
            alt="BiasLens AI agent dashboard preview"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-contain p-5"
          />

          {/* Overlay content inside the dashboard preview */}
          <div className="absolute left-4 top-4 rounded-[1.4rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB]/10">
                <Bot className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              </span>
              <div className="text-xs font-semibold text-[#0D0C22]">AI Agent Online</div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2">
              <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                    <div className="text-[11px] font-semibold text-[#6E6D7A]">Resume Score</div>
                  </div>
                  <div className="text-[11px] font-semibold text-[#0D0C22]">92%</div>
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                    <div className="text-[11px] font-semibold text-[#6E6D7A]">Job Fit</div>
                  </div>
                  <div className="text-[11px] font-semibold text-[#0D0C22]">89%</div>
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
                    <div className="text-[11px] font-semibold text-[#6E6D7A]">Fairness Risk</div>
                  </div>
                  <div className="text-[11px] font-semibold text-[#16A34A]">Low</div>
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                    <div className="text-[11px] font-semibold text-[#6E6D7A]">Report Status</div>
                  </div>
                  <div className="text-[11px] font-semibold text-[#0D0C22]">Ready</div>
                </div>
              </div>
            </div>
          </div>

          <FloatingCard icon={<Zap className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />} title="AI Reasoning Active" index={0} tone="primary" />
          <FloatingCard icon={<ShieldCheck className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />} title="Fairness Verified" index={1} tone="success" />
          <FloatingCard icon={<FileCheck2 className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />} title="Report Ready" index={2} tone="primary" />

          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/75 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default function AgentFinalCTA() {
  const [started, setStarted] = React.useState(false);

  return (
    <section aria-label="Ready to Use the Agent?" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                Ready to Use the Agent?
              </div>

              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Let BiasLens Explain, Audit, and Improve Resume Decisions
              </h2>

              <p className="mt-4 max-w-[66ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
                Use the BiasLens AI Agent to analyze resumes, explain scores, review fairness signals, suggest
                improvements, and generate audit-ready reports from one intelligent workflow.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(37,99,235,0.28)] transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/35"
                  aria-label="Start free audit"
                >
                  {started ? "Starting..." : "Start Free Audit"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#0D0C22] backdrop-blur-xl shadow-[0_16px_40px_rgba(13,12,34,0.04)] transition hover:border-[#2563EB]/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/25"
                  aria-label="Try AI agent"
                >
                  Try AI Agent
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TrustItem icon={<Users className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />} label="Human-in-the-loop" />
                <TrustItem icon={<Shield className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />} label="Explainable AI" />
                <TrustItem icon={<ShieldCheck className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />} label="Fairness Review" />
                <TrustItem icon={<FileCheck2 className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />} label="Audit Ready" />
              </div>

              {/* Statistics */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatBlock value="92%" label="Analysis Accuracy" />
                <StatBlock value="94%" label="Fairness Confidence" />
                <StatBlock value="<10s" label="Average Review Time" />
                <StatBlock value="24/7" label="Agent Availability" />
              </div>

              <div className="sr-only" aria-live="polite">
                {started ? "Start Free Audit clicked."
                  : "Ready to use the BiasLens AI Agent. Primary CTA is Start Free Audit."}
              </div>
            </motion.div>
          </div>

          {/* Right */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <DashboardPreview />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

