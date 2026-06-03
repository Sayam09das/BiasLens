"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  SearchCheck,
  Scale,
  Shuffle,
  FileText,
  ShieldCheck,
  WandSparkles,
  Workflow,
} from "lucide-react";

type Capability = {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
};

function CapabilityCard({ capability, index }: { capability: Capability; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)]"
      aria-label={capability.title}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10">
            {capability.icon}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{capability.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{capability.description}</p>
          </div>
        </div>

        <div className="mt-5">
          <span className="inline-flex items-center rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
            {capability.tag}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function AgentCapabilitiesGrid() {
  const capabilities: Capability[] = [
    {
      icon: <SearchCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Resume Understanding",
      description:
        "Parse resumes, summarize candidate profiles, extract experience, education, skills, projects, achievements, and role-relevant signals.",
      tag: "Understanding",
    },
    {
      icon: <FileText className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Job Description Analysis",
      description:
        "Understand job requirements, required skills, responsibilities, seniority level, keywords, and evaluation criteria.",
      tag: "JD Analysis",
    },
    {
      icon: <Sparkles className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Explainable Recommendations",
      description:
        "Explain why a candidate received a score using decision breakdowns, signal attribution, and confidence reasoning.",
      tag: "Explainability",
    },
    {
      icon: <Scale className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Fairness Risk Detection",
      description:
        "Surface bias indicators, fairness gaps, risk levels, and responsible AI signals before hiring decisions are made.",
      tag: "Fairness",
    },
    {
      icon: <Shuffle className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Counterfactual Reasoning",
      description:
        "Compare how controlled resume changes may impact scores, recommendations, and fairness outcomes.",
      tag: "Reasoning",
    },
    {
      icon: <WandSparkles className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Improvement Suggestions",
      description:
        "Generate practical resume feedback, rewrite suggestions, missing evidence guidance, and skill-alignment tips.",
      tag: "Suggestions",
    },
    {
      icon: <FileText className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Report Generation",
      description:
        "Create audit-ready reports with scores, explanations, fairness notes, decision records, and improvement recommendations.",
      tag: "Reporting",
    },
    {
      icon: <Workflow className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Workflow Automation",
      description:
        "Automate resume audits, report creation, admin logging, protected API workflows, and review-ready hiring intelligence.",
      tag: "Automation",
    },
  ];

  return (
    <section aria-label="Agent Capabilities" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Agent Capabilities
          </div>

          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            One AI Agent for Resume Review, Fairness, and Reporting
          </h2>

          <p className="mt-4 text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
            The BiasLens AI Agent understands resumes, compares roles, explains decisions, detects fairness risks, suggests
            improvements, and automates audit workflows from one intelligent interface.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap, index) => (
            <CapabilityCard key={cap.title} capability={cap} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

