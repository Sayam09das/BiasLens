"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  SearchCheck,
  Scale,
  Sparkles,
  ClipboardCheck,
  Users,
  FileText,
  Lock,
  Shuffle,
} from "lucide-react";

/* ── animation helpers ── */
const smoothEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.55, delay, ease: smoothEase },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.4, delay, ease: smoothEase },
});

/* ── data ── */
const features = [
  {
    title: "Resume Analysis",
    description: "Analyze uploaded resumes and extract structured insights for job-role matching.",
    icon: <SearchCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Job Fit Scoring",
    description: "Score each resume against role requirements using transparent AI-powered evaluation.",
    icon: <ClipboardCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Explainability Insights",
    description: "Show the signals that influenced each recommendation using interpretable model reasoning.",
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Fairness Signals",
    description: "Detect possible bias indicators and fairness risks before decisions affect candidates.",
    icon: <Scale className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Counterfactual Testing",
    description: "Compare how small resume changes may alter scoring outcomes and recommendations.",
    icon: <Shuffle className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Role Comparison",
    description: "Evaluate the same candidate across multiple roles to identify the strongest fit.",
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Audit Reports",
    description: "Generate structured reports with scores, explanations, fairness notes, and recommendations.",
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Secure Workflows",
    description: "Support authentication, protected APIs, secure uploads, validation, logging, and admin review.",
    icon: <Lock className="h-5 w-5" aria-hidden="true" />,
  },
];

export default function FeaturesGrid() {
  return (
    <section className="bg-[#FFFFFF]" aria-label="BiasLens Core Features">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        {/* ── Section label ── */}
        <motion.div className="flex items-center justify-center sm:justify-start" {...fadeIn(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Core Features
          </span>
        </motion.div>

        {/* ── Heading ── */}
        <motion.div className="mt-6 max-w-3xl text-center sm:text-left" {...fadeUp(0.06)}>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Everything You Need to Audit Resume Decisions
          </h2>
          <p className="mt-4 max-w-[64ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            BiasLens combines secure backend workflows with ML-powered intelligence to help
            hiring teams analyze, explain, monitor, and improve resume screening decisions.
          </p>
        </motion.div>

        {/* ── Features grid ── */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {features.map((feature, idx) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: idx * 0.06,
                ease: smoothEase,
              }}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300, damping: 22 },
              }}
              className="group relative overflow-hidden rounded-[1.4rem] border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_16px_40px_rgba(13,12,34,0.04)] cursor-default sm:p-6"
              aria-label={feature.title}
            >
              {/* top accent bar on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="relative flex flex-col gap-3">
                {/* icon */}
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] transition-colors duration-300 group-hover:border-[#2563EB]/20 group-hover:bg-[#2563EB]/8">
                  <span className="text-[#2563EB]">{feature.icon}</span>
                </div>

                {/* text */}
                <div>
                  <h3 className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22] sm:text-base">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-6 text-[#6E6D7A] sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── Bottom separator ── */}
        <motion.div className="mt-10 flex justify-center" {...fadeIn(0.3)}>
          <div className="h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-[#E7E7E9] to-transparent" />
        </motion.div>

      </div>
    </section>
  );
}
