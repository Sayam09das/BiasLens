"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  WandSparkles,
  Scale,
  FileCheck2,
  Check,
  ArrowRight,
  Calendar,
  Bot,
  Zap,
} from "lucide-react";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-white/70 px-4 py-4 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl">
      <div className="text-xl font-semibold tracking-[-0.03em] text-[#0D0C22] sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium leading-5 text-[#6E6D7A] sm:text-sm">
        {label}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone: "primary" | "success" | "muted" }) {
  const toneCls =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "primary"
        ? "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]"
        : "border-[#E7E7E9] bg-[#F6F8FB] text-[#6E6D7A]";

  return (
    <div className={"rounded-[1.2rem] border px-4 py-3 backdrop-blur-xl " + toneCls}>
      <div className="text-xs font-semibold text-[#6E6D7A]">{label}</div>
      <div className="mt-1 text-sm font-semibold text-[#0D0C22]">{value}</div>
    </div>
  );
}

function AgentResponseList() {
  const items = [
    "Resume Parsed",
    "Skills Extracted",
    "Job Match Calculated",
    "Fairness Review Complete",
    "Report Generated",
  ];

  return (
    <ul className="space-y-2" aria-label="Agent responses">
      {items.map((it) => (
        <li key={it} className="flex items-center gap-2 text-sm text-[#0D0C22]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-[#22C55E]/10">
            <Check className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
          </span>
          <span className="font-medium text-[#0D0C22]">{it}</span>
        </li>
      ))}
    </ul>
  );
}

function FloatingCard({
  icon,
  title,
  description,
  className,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={
        "absolute rounded-[1.6rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_20px_70px_rgba(13,12,34,0.10)] backdrop-blur-xl " +
        className
      }
    >
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2563EB]/10">{icon}</div>
        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22]">{title}</div>
          {description ? <div className="mt-1 text-xs font-medium text-[#6E6D7A]">{description}</div> : null}
        </div>
      </div>
    </motion.div>
  );
}

export default function AIAgentHero() {
  return (
    <section
      aria-label="BiasLens AI Agent hero"
      className="relative overflow-hidden border-b border-[#E7E7E9] bg-[#FFFFFF]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#2563EB]/7 blur-3xl" />
        <div className="absolute -right-24 top-28 h-72 w-72 rounded-full bg-[#2563EB]/6 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(90deg,rgba(37,99,235,0.15)_1px,transparent_1px),linear-gradient(rgba(37,99,235,0.07)_1px,transparent_1px)] [background-size:40px_40px,40px_40px]"
          style={{ maskImage: "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)" }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
                <Bot className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                AI Hiring Intelligence Agent
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-balance font-semibold tracking-[-0.045em] text-[#0D0C22] text-4xl sm:text-5xl md:text-6xl lg:text-[3.9rem] leading-[1.03]"
            >
              An AI Agent That Understands, Explains, and Audits Resume Decisions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-[62ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8"
            >
              The BiasLens AI Agent analyzes resumes, evaluates job fit, explains recommendations, detects fairness risks,
              generates improvement suggestions, and creates audit-ready reports — all through a single intelligent workflow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/agent"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(37,99,235,0.28)] transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/35"
              >
                Try AI Agent
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#0D0C22] backdrop-blur-xl shadow-[0_16px_40px_rgba(13,12,34,0.04)] transition hover:border-[#2563EB]/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/25"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                View Live Demo
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4"
            >
              <Stat value="50K+" label="Resumes Reviewed" />
              <Stat value="92%" label="Analysis Accuracy" />
              <Stat value="94%" label="Fairness Confidence" />
              <Stat value="<10s" label="Average Processing Time" />
            </motion.div>
          </div>

          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div aria-hidden="true" className="absolute -inset-x-10 -top-14 h-[420px] rounded-full bg-[#2563EB]/10 blur-3xl" />

              <div className="relative rounded-[2.2rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_40px_140px_rgba(13,12,34,0.12)] backdrop-blur-xl">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/50 via-transparent to-white/60" />

                <div className="relative overflow-hidden rounded-4xl border border-[#E7E7E9] bg-[#F6F8FB]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.22)_0%,transparent_45%),radial-gradient(circle_at_85%_35%,rgba(37,99,235,0.12)_0%,transparent_55%)]"
                  />

                  <div className="relative aspect-[16/11] w-full">
                    <Image
                      src="/images/ai-agent-hero.png"
                      alt="BiasLens AI Agent Interface"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain p-4"
                    />

                    {/* Main agent window overlay (HTML-based) */}
                    <div className="absolute left-4 right-4 top-4 rounded-[1.6rem] border border-[#E7E7E9] bg-white/70 p-4 backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2563EB]/10">
                            <Zap className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                          </span>
                          <div>
                            <div className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22]">AI Agent Online</div>
                            <div className="text-xs font-medium text-[#6E6D7A]">Resume uploaded → analysis running</div>
                          </div>
                        </div>

                        <div className="rounded-full border border-[#E7E7E9] bg-[#FFFFFF]/70 px-3 py-1 text-xs font-semibold text-[#16A34A]">
                          <span className="inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#22C55E]" aria-hidden="true" />
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.3rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6D7A]">
                            <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                            Agent Responses
                          </div>
                          <div className="mt-2">
                            <AgentResponseList />
                          </div>
                        </div>

                        <div className="rounded-[1.3rem] border border-[#E7E7E9] bg-white/70 p-3">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#6E6D7A]">
                            <ShieldCheck className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                            Agent Summary Card
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <SummaryRow label="Resume Score" value="92%" tone="primary" />
                            <SummaryRow label="Job Fit" value="89%" tone="primary" />
                            <SummaryRow label="Fairness Risk" value="Low" tone="success" />
                            <SummaryRow label="Explainability" value="High" tone="primary" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating cards */}
                    <FloatingCard
                      icon={<WandSparkles className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />}
                      title="AI Reasoning Active"
                      description="Transparent signal attribution"
                      className="floating-card-1"
                      delay={0.12}
                    />

                    <FloatingCard
                      icon={<Scale className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />}
                      title="Fairness Verified"
                      description="Bias risk monitoring"
                      className="floating-card-2"
                      delay={0.18}
                    />

                    <FloatingCard
                      icon={<FileCheck2 className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />}
                      title="Audit Ready"
                      description="Reports & audit trail"
                      className="floating-card-3"
                      delay={0.24}
                    />

                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/75 to-transparent" />
                  </div>
                </div>

                <style jsx>{`
                  [aria-label="BiasLens AI Agent hero"] .floating-card-1 {
                    right: 1rem;
                    top: 6.2rem;
                  }
                  [aria-label="BiasLens AI Agent hero"] .floating-card-2 {
                    left: 0.85rem;
                    top: 11rem;
                  }
                  [aria-label="BiasLens AI Agent hero"] .floating-card-3 {
                    right: 1.2rem;
                    bottom: 1.3rem;
                  }

                  @media (max-width: 1024px) {
                    [aria-label="BiasLens AI Agent hero"] .floating-card-1 {
                      right: 0.75rem;
                      top: 5.2rem;
                    }
                    [aria-label="BiasLens AI Agent hero"] .floating-card-2 {
                      left: 0.75rem;
                      top: 9.5rem;
                    }
                    [aria-label="BiasLens AI Agent hero"] .floating-card-3 {
                      right: 1rem;
                      bottom: 1rem;
                    }
                  }
                `}</style>
              </div>
            </motion.div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          AI Agent hero loaded. Primary CTA is Try AI Agent; secondary CTA is View Live Demo. Dashboard preview shows parsing,
          fairness review, and report generation status.
        </p>
      </div>
    </section>
  );
}
