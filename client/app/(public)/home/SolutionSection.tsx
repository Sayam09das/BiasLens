"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Layers,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.45, delay },
});

/* ── data ── */
const solutionCards = [
  {
    title: "AI Resume Audit",
    description:
      "Analyze resumes against role requirements and generate structured job-fit scores with clear audit-ready results.",
    icon: <SearchCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
    accent: "blue",
  },
  {
    title: "Explainable Scoring",
    description:
      "Break down every hiring signal using explainability insights so teams understand what influenced the result.",
    icon: <Sparkles className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
    accent: "blue",
  },
  {
    title: "Fairness Intelligence",
    description:
      "Surface potential fairness risks, bias signals, and counterfactual differences before decisions impact candidates.",
    icon: <ShieldCheck className="h-5 w-5 text-[#22C55E]" aria-hidden="true" />,
    accent: "green",
  },
  {
    title: "Improvement Suggestions",
    description:
      "Generate practical resume recommendations that help candidates improve alignment with target roles.",
    icon: <Layers className="h-5 w-5 text-[#22C55E]" aria-hidden="true" />,
    accent: "green",
  },
];

const successTags = [
  "Clear Reasoning",
  "Fairness Signals",
  "Actionable Feedback",
  "Audit Ready",
];

export default function SolutionSection() {
  return (
    <section className="bg-[#FFFFFF]" aria-label="BiasLens Solution section">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        {/* ── Section label ── */}
        <motion.div className="flex items-center justify-center" {...fadeIn(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
            The Solution
          </span>
        </motion.div>

        {/* ── Heading ── */}
        <motion.div className="mx-auto mt-6 max-w-3xl text-center" {...fadeUp(0.06)}>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Turn Resume Screening Into a Transparent, Explainable Audit
          </h2>
          <p className="mx-auto mt-4 max-w-[64ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            BiasLens connects your backend audit workflow with ML-powered scoring,
            explainability, fairness analysis, counterfactual testing, and actionable
            resume improvement suggestions.
          </p>
        </motion.div>

        {/* ── Main grid ── */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">

          {/* ── Solution cards ── */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {solutionCards.map((card, i) => {
                const isGreen = card.accent === "green";
                return (
                  <motion.article
                    key={card.title}
                    {...fadeUp(0.1 + i * 0.09)}
                    whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                    className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-white p-5 shadow-[0_20px_60px_rgba(13,12,34,0.06)] cursor-default sm:p-6"
                    aria-label={card.title}
                  >
                    {/* top accent bar — visible on hover */}
                    <div
                      aria-hidden="true"
                      className={
                        "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100 " +
                        (isGreen
                          ? "from-[#22C55E]/80 via-[#22C55E]/30 to-transparent"
                          : "from-[#2563EB]/70 via-[#2563EB]/30 to-transparent")
                      }
                    />
                    <div className="relative flex items-start gap-3">
                      <span
                        className={
                          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border " +
                          (isGreen
                            ? "border-[#22C55E]/25 bg-[#22C55E]/10"
                            : "border-[#E7E7E9] bg-[#F6F8FB]")
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
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* ── Workflow visual ── */}
          <motion.div className="lg:col-span-5" {...fadeUp(0.2)}>
            <div className="rounded-[1.8rem] border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_20px_60px_rgba(13,12,34,0.06)] sm:p-6">

              {/* card header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22] sm:text-lg">
                    Transparent Hiring Workflow
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#6E6D7A] sm:text-sm">
                    Speed with traceability — so teams can explain and act.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1.5 text-xs font-semibold text-[#0D0C22]">
                  <CheckCircle2 className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />
                  Audit Ready
                </span>
              </div>

              {/* ── image — unchanged from original ── */}
              <motion.div
                className="mt-6 rounded-[1.4rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/HiringWorkflow.png"
                  alt="Transparent hiring workflow: Resume Upload → AI Audit Engine → Explainability Layer → Fairness Check → Audit Report"
                  className="h-auto w-full rounded-[1.1rem] object-contain"
                  loading="lazy"
                />
              </motion.div>

              {/* success tags */}
              <motion.div className="mt-6 flex flex-wrap gap-2" {...fadeIn(0.55)}>
                {successTags.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full border border-[#22C55E]/35 bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#16A34A]"
                  >
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.p className="mt-5 text-xs leading-5 text-[#6E6D7A]" {...fadeIn(0.65)}>
                BiasLens turns screening outcomes into reviewable artifacts — so hiring teams can
                explain decisions, monitor fairness, and improve candidate experiences.
              </motion.p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
