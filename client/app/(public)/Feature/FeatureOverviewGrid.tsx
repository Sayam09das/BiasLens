"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Scale,
  Shuffle,
  ClipboardCheck,
  FileText,
  Lock,
  Layers,
  UserRound,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
};

const BRAND = {
  primary: "#2563EB",
  border: "#E7E7E9",
  text: "#0D0C22",
  muted: "#6E6D7A",
  bgSecondary: "#F6F8FB",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

export default function FeatureOverviewGrid() {
  const features: Feature[] = [
    {
      title: "Resume Analysis",
      description:
        "Upload and analyze resumes to extract structured candidate insights, skills, experience, education, and role-relevant signals.",
      tag: "AI Analysis",
      icon: <Layers className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Job Fit Scoring",
      description:
        "Score resumes against job descriptions using transparent AI-powered evaluation and clear match indicators.",
      tag: "Scoring",
      icon: <ClipboardCheck className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Explainability Insights",
      description:
        "Understand why each score was generated with decision breakdowns, contribution signals, and confidence indicators.",
      tag: "Explainability",
      icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Fairness Signals",
      description:
        "Surface potential bias risks, fairness gaps, and responsible AI indicators before hiring decisions are made.",
      tag: "Fairness",
      icon: <Scale className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Counterfactual Testing",
      description:
        "Compare how controlled resume changes may affect scoring outcomes, recommendations, and fairness signals.",
      tag: "Counterfactuals",
      icon: <Shuffle className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Role Comparison",
      description:
        "Evaluate one candidate across multiple roles to identify the strongest match and reduce poor-fit recommendations.",
      tag: "Comparison",
      icon: <UserRound className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Audit Reports",
      description:
        "Generate structured reports with job-fit scores, explanations, fairness notes, improvement suggestions, and audit history.",
      tag: "Reporting",
      icon: <FileText className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Secure Workflows",
      description:
        "Support protected APIs, authentication, secure uploads, validation, middleware, admin logs, and production-ready backend flows.",
      tag: "Security",
      icon: <Lock className="h-5 w-5" aria-hidden="true" />,
    },
  ];

  return (
    <section aria-label="Feature Overview" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center sm:justify-start"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Feature Overview
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-center sm:text-left"
        >
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            One Platform for Resume Intelligence, Fairness, and Auditability
          </h2>
          <p className="mx-auto mt-4 max-w-[66ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
            BiasLens gives hiring teams the tools to analyze resumes, explain AI decisions, monitor fairness signals,
            compare roles, and generate audit-ready reports from one secure workflow.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.5, delay: idx * 0.03, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-white p-6 shadow-[0_16px_40px_rgba(13,12,34,0.04)]"
            >
              {/* top sheen */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 translate-y-0 bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              {/* hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#2563EB]/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] transition-colors group-hover:border-[#2563EB]/20 group-hover:bg-[#2563EB]/8">
                    <span className="text-[#2563EB]">{f.icon}</span>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white px-3 py-1 text-[11px] font-semibold text-[#6E6D7A]">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: BRAND.primary }}
                      aria-hidden="true"
                    />
                    {f.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[#0D0C22]">{f.title}</h3>

                <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{f.description}</p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#0D0C22] transition-colors group-hover:text-[#2563EB]">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#2563EB]/10 p-2">
                    <ArrowUpRight className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  </span>
                  <span className="sr-only">Feature details</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

