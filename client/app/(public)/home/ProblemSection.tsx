"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  FileSearch,
  ShieldAlert,
  Sparkles,
  FolderOpen,
  Cpu,
  HelpCircle,
  Siren,
} from "lucide-react";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.45, delay, ease: "easeOut" },
});

/* ── data ── */
const problemCards = [
  {
    title: "Hidden Bias in Resume Screening",
    description:
      "Traditional ATS and AI screening tools may unintentionally favor certain education paths, keywords, locations, or career backgrounds without making those patterns visible.",
    icon: <Sparkles className="h-5 w-5 text-[#F59E0B]" aria-hidden="true" />,
    tone: "warning",
    risk: "Watch",
  },
  {
    title: "No Clear Decision Explanation",
    description:
      "Recruiters often receive a score or recommendation but not the reasoning behind it, making hiring decisions harder to justify and improve.",
    icon: <FileSearch className="h-5 w-5 text-[#F59E0B]" aria-hidden="true" />,
    tone: "warning",
    risk: "Watch",
  },
  {
    title: "Compliance and Audit Risk",
    description:
      "Without audit logs, fairness checks, and explainability reports, hiring teams struggle to prove that their screening process is transparent and accountable.",
    icon: <ShieldAlert className="h-5 w-5 text-[#EF4444]" aria-hidden="true" />,
    tone: "danger",
    risk: "High Risk",
  },
  {
    title: "Poor Candidate Improvement Feedback",
    description:
      "Candidates are rejected without meaningful guidance, while organizations miss opportunities to improve job matching and talent discovery.",
    icon: <Boxes className="h-5 w-5 text-[#F59E0B]" aria-hidden="true" />,
    tone: "warning",
    risk: "Watch",
  },
];

const warningTags = [
  { label: "Bias Risk", tone: "warning" },
  { label: "Missing Explanation", tone: "danger" },
  { label: "Weak Audit Trail", tone: "warning" },
  { label: "Low Transparency", tone: "danger" },
];

const pipelineSteps = [
  {
    label: "Resume Upload",
    sub: "Input enters screening",
    icon: <FolderOpen className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
    bg: "bg-[#2563EB]/10",
  },
  {
    label: "Black Box AI",
    sub: "Signals processed invisibly",
    icon: <Cpu className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
    bg: "bg-[#2563EB]/10",
  },
  {
    label: "Unclear Score",
    sub: "Why it happened is unknown",
    icon: <HelpCircle className="h-5 w-5 text-[#F59E0B]" aria-hidden="true" />,
    bg: "bg-[#F59E0B]/10",
  },
  {
    label: "Risk Signal",
    sub: "Bias & compliance uncertainty",
    icon: <Siren className="h-5 w-5 text-[#EF4444]" aria-hidden="true" />,
    bg: "bg-[#EF4444]/10",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-[#F6F8FB]" aria-label="BiasLens Problem section">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        {/* ── Section label ── */}
        <motion.div className="flex items-center justify-center" {...fadeIn(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <AlertTriangle className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
            The Problem
          </span>
        </motion.div>

        {/* ── Heading ── */}
        <motion.div className="mx-auto mt-6 max-w-3xl text-center" {...fadeUp(0.06)}>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Hiring AI Makes Decisions Faster — But Not Always Fairer
          </h2>
          <p className="mx-auto mt-4 max-w-[64ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            Most resume screening systems score candidates without showing why a decision was
            made, what signals influenced the result, or whether hidden bias affected the outcome.
          </p>
        </motion.div>

        {/* ── Main grid ── */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">

          {/* ── Problem cards ── */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {problemCards.map((card, i) => {
                const isDanger = card.tone === "danger";
                return (
                  <motion.article
                    key={card.title}
                    {...fadeUp(0.1 + i * 0.09)}
                    whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                    className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-white shadow-[0_20px_60px_rgba(13,12,34,0.06)] cursor-default"
                    aria-label={card.title}
                  >
                    {/* top accent bar */}
                    <div
                      aria-hidden="true"
                      className={
                        "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r " +
                        (isDanger
                          ? "from-[#EF4444]/80 via-[#EF4444]/30 to-transparent"
                          : "from-[#F59E0B]/80 via-[#F59E0B]/30 to-transparent")
                      }
                    />

                    <div className="relative p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <span
                          className={
                            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border " +
                            (isDanger
                              ? "border-[#EF4444]/25 bg-[#EF4444]/10"
                              : "border-[#F59E0B]/25 bg-[#F59E0B]/10")
                          }
                        >
                          {card.icon}
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22] sm:text-base">
                            {card.title}
                          </h3>
                          <p className="mt-2 text-xs leading-6 text-[#6E6D7A] sm:text-sm">
                            {card.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span
                          className={
                            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold " +
                            (isDanger
                              ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#EF4444]"
                              : "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]")
                          }
                        >
                          {card.risk}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* ── Pipeline visual ── */}
          <motion.div className="lg:col-span-5" {...fadeUp(0.18)}>
            <div className="rounded-[1.8rem] border border-[#E7E7E9] bg-white p-5 shadow-[0_20px_60px_rgba(13,12,34,0.06)] sm:p-6">

              {/* card header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22] sm:text-lg">
                    Broken Hiring Pipeline
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#6E6D7A] sm:text-sm">
                    Speed without transparency creates decision risk.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1.5 text-xs font-semibold text-[#0D0C22]">
                  <AlertTriangle className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  Risk Signals
                </span>
              </div>

              {/* pipeline steps */}
              <div className="relative mt-6">
                {/* vertical connector line */}
                <div
                  aria-hidden="true"
                  className="absolute left-[1.1rem] top-5 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-[#2563EB]/20 via-[#E7E7E9] to-[#E7E7E9]"
                />

                <div className="flex flex-col gap-4">
                  {pipelineSteps.map((step, i) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.22 + i * 0.1, ease: "easeOut" }}
                      className="relative flex items-center gap-3 rounded-2xl border border-[#E7E7E9] bg-white px-4 py-3 shadow-sm"
                    >
                      <span
                        aria-hidden="true"
                        className={
                          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl " +
                          step.bg
                        }
                      >
                        {step.icon}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[#0D0C22]">{step.label}</div>
                        <div className="text-xs font-medium text-[#6E6D7A]">{step.sub}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* warning tags */}
              <motion.div
                className="mt-5 flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, duration: 0.4 }}
              >
                {warningTags.map((t) => (
                  <span
                    key={t.label}
                    className={
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold " +
                      (t.tone === "danger"
                        ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#EF4444]"
                        : "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]")
                    }
                  >
                    {t.label}
                  </span>
                ))}
              </motion.div>

              <motion.p
                className="mt-5 text-xs leading-5 text-[#6E6D7A]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.75, duration: 0.4 }}
              >
                BiasLens addresses these gaps by surfacing decision drivers, auditing fairness outcomes,
                and producing explainability artifacts teams can review.
              </motion.p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}