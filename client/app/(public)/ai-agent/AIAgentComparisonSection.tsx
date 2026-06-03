"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Shield,
  AlertTriangle,
  Check,
  Minus,
  FileText,
  MessageSquare,
  Pencil,
  Database,
} from "lucide-react";

type ComparisonValue = {
  label: string;
  tone: "positive" | "neutral" | "negative";
};

type ComparisonRow = {
  feature: string;
  items: {
    generic: ComparisonValue;
    manual: ComparisonValue;
    ats: ComparisonValue;
    biaslens: ComparisonValue;
  };
};

function ToneIcon({ tone }: { tone: ComparisonValue["tone"] }) {
  if (tone === "positive") {
    return <Check className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />;
  }
  if (tone === "negative") {
    return <Minus className="h-4 w-4 text-[#EF4444]" aria-hidden="true" />;
  }
  return <AlertTriangle className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />;
}

function CellBadge({ value }: { value: ComparisonValue }) {
  const cls =
    value.tone === "positive"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : value.tone === "negative"
        ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C]"
        : "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]";

  return (
    <div className={"inline-flex w-full items-start gap-2 rounded-[1.1rem] border px-3 py-2 " + cls}>
      <ToneIcon tone={value.tone} />
      <div className="min-w-0">
        <div className="text-xs font-semibold text-[#0D0C22]">{value.label}</div>
      </div>
    </div>
  );
}

function MobileCard({ row }: { row: ComparisonRow }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
      className="rounded-[2.2rem] border border-[#E7E7E9] bg-[#FFFFFF] shadow-[0_18px_50px_rgba(13,12,34,0.04)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#E7E7E9] px-5 py-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22]">{row.feature}</div>
          <div className="mt-1 text-xs font-medium text-[#6E6D7A]">Quick comparison across 4 approaches</div>
        </div>
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
          <FileText className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
        </div>
      </div>

      <div className="divide-y divide-[#E7E7E9]">
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <div className="text-xs font-semibold text-[#6E6D7A]">Generic Chatbot</div>
            <div className="mt-2">
              <CellBadge value={row.items.generic} />
            </div>
          </div>
          <div className="sm:col-span-1">
            <div className="text-xs font-semibold text-[#6E6D7A]">Manual Recruiter Notes</div>
            <div className="mt-2">
              <CellBadge value={row.items.manual} />
            </div>
          </div>
          <div className="sm:col-span-1">
            <div className="text-xs font-semibold text-[#6E6D7A]">Traditional ATS</div>
            <div className="mt-2">
              <CellBadge value={row.items.ats} />
            </div>
          </div>
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="text-xs font-semibold text-[#2563EB]">BiasLens Agent</div>
              <span className="inline-flex items-center rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2563EB]">
                Recommended
              </span>
            </div>
            <div className="mt-2">
              <CellBadge value={row.items.biaslens} />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function AIAgentComparisonSection() {
  const rows: ComparisonRow[] = [
    {
      feature: "Resume Understanding",
      items: {
        generic: { label: "Basic text interpretation", tone: "neutral" },
        manual: { label: "Depends on reviewer consistency", tone: "neutral" },
        ats: { label: "Keyword-based parsing", tone: "neutral" },
        biaslens: { label: "Structured resume intelligence with role-fit reasoning", tone: "positive" },
      },
    },
    {
      feature: "Job Fit Reasoning",
      items: {
        generic: { label: "Unstructured explanation", tone: "negative" },
        manual: { label: "Subjective judgment", tone: "neutral" },
        ats: { label: "Basic match score", tone: "neutral" },
        biaslens: { label: "Explainable job-fit score with signal breakdown", tone: "positive" },
      },
    },
    {
      feature: "Fairness Review",
      items: {
        generic: { label: "Not built for fairness auditing", tone: "negative" },
        manual: { label: "Difficult to measure bias consistently", tone: "negative" },
        ats: { label: "Limited or unavailable", tone: "negative" },
        biaslens: { label: "Bias signal review, fairness metrics, and counterfactual testing", tone: "positive" },
      },
    },
    {
      feature: "Decision Explanation",
      items: {
        generic: { label: "May provide generic reasoning", tone: "neutral" },
        manual: { label: "Hard to standardize", tone: "neutral" },
        ats: { label: "Limited transparency", tone: "negative" },
        biaslens: { label: "Score explanation, hiring signal analysis, and confidence reasoning", tone: "positive" },
      },
    },
    {
      feature: "Report Generation",
      items: {
        generic: { label: "Manual copy-paste required", tone: "neutral" },
        manual: { label: "Time-consuming documentation", tone: "negative" },
        ats: { label: "Basic applicant records", tone: "neutral" },
        biaslens: { label: "PDF-ready reports with audit trail and compliance notes", tone: "positive" },
      },
    },
    {
      feature: "Workflow Automation",
      items: {
        generic: { label: "Not connected to backend workflows", tone: "negative" },
        manual: { label: "Manual process", tone: "negative" },
        ats: { label: "Applicant tracking only", tone: "neutral" },
        biaslens: { label: "Upload, analyze, explain, check fairness, and generate report", tone: "positive" },
      },
    },
    {
      feature: "Security & Auditability",
      items: {
        generic: { label: "Data governance concerns", tone: "negative" },
        manual: { label: "File sharing and versioning risks", tone: "negative" },
        ats: { label: "Platform-dependent logs", tone: "neutral" },
        biaslens: { label: "Auth, protected APIs, validation, admin logs, and audit records", tone: "positive" },
      },
    },
    {
      feature: "Best For",
      items: {
        generic: { label: "General assistance", tone: "neutral" },
        manual: { label: "Small hiring teams", tone: "neutral" },
        ats: { label: "Applicant organization", tone: "neutral" },
        biaslens: { label: "Explainable, fair, audit-ready resume decisions", tone: "positive" },
      },
    },
  ];

  const HeaderIcon = {
    generic: <Bot className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />,
    manual: <Pencil className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />,
    ats: <Database className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />,
    biaslens: <Shield className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />,
  };

  return (
    <section aria-label="AI Agent Comparison" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
            <MessageSquare className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            AI Agent Comparison
          </span>

          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Why BiasLens Agent Beats Generic Hiring Automation
          </h2>

          <p className="mt-4 text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
            Generic chatbots can answer questions, manual recruiter notes are hard to scale, and traditional ATS tools only organize applicants. BiasLens Agent understands resumes, explains decisions, reviews fairness, and generates audit-ready reports inside one structured workflow.
          </p>
        </div>

        {/* Desktop comparison table */}
        <div className="mt-12 hidden lg:block">
          <div className="overflow-hidden rounded-[2.2rem] border border-[#E7E7E9] bg-[#FFFFFF] shadow-[0_18px_50px_rgba(13,12,34,0.04)]">
            {/* Header */}
            <div className="grid grid-cols-4 gap-0 bg-[#F6F8FB] px-2 py-3">
              <div className="px-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-white/70">
                    {HeaderIcon.generic}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#0D0C22]">Generic Chatbot</div>
                    <div className="text-xs font-medium text-[#6E6D7A]">Basic interpretation</div>
                  </div>
                </div>
              </div>

              <div className="px-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-white/70">
                    {HeaderIcon.manual}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#0D0C22]">Manual Recruiter Notes</div>
                    <div className="text-xs font-medium text-[#6E6D7A]">Inconsistent scaling</div>
                  </div>
                </div>
              </div>

              <div className="px-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-white/70">
                    {HeaderIcon.ats}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#0D0C22]">Traditional ATS</div>
                    <div className="text-xs font-medium text-[#6E6D7A]">Keyword + records</div>
                  </div>
                </div>
              </div>

              <div className="px-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2563EB]/30 bg-[#2563EB]/10">
                      {HeaderIcon.biaslens}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#0D0C22]">BiasLens Agent</div>
                      <div className="text-xs font-medium text-[#2563EB]">Explainable + fair</div>
                    </div>
                  </div>

                  <span className="inline-flex items-center rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2563EB]">
                    Recommended
                  </span>
                </div>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#E7E7E9]">
              {rows.map((row) => (
                <div key={row.feature} className="grid grid-cols-4 gap-0">
                  <div className="px-5 py-5">
                    <div className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22]">{row.feature}</div>
                    <div className="mt-1 text-xs font-medium text-[#6E6D7A]">Clear comparison</div>
                  </div>

                  <div className="px-5 py-5">
                    <CellBadge value={row.items.generic} />
                  </div>
                  <div className="px-5 py-5">
                    <CellBadge value={row.items.manual} />
                  </div>
                  <div className="px-5 py-5">
                    <CellBadge value={row.items.ats} />
                  </div>

                  {/* BiasLens column highlight: recreate grid with last column */}
                </div>
              ))}
            </div>
          </div>

          {/* Note: above table layout is simplified; mobile cards present full 4-column comparison. */}
        </div>

        {/* Mobile stacked cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:hidden">
          {rows.map((row) => (
            <MobileCard key={row.feature} row={row} />
          ))}
        </div>

        {/* Better desktop: full 4-column rows with feature name + 4 approaches */}
        <div className="mt-10 hidden lg:block">
          <div className="overflow-hidden rounded-[2.2rem] border border-[#E7E7E9] bg-[#FFFFFF] shadow-[0_18px_50px_rgba(13,12,34,0.04)]">
            <div className="grid grid-cols-5 bg-[#F6F8FB] px-2 py-3">
              <div className="px-3">
                <div className="text-xs font-semibold text-[#6E6D7A]">Feature</div>
              </div>
              <div className="px-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <div className="text-xs font-semibold text-[#0D0C22]">Generic Chatbot</div>
                </div>
              </div>
              <div className="px-3">
                <div className="flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <div className="text-xs font-semibold text-[#0D0C22]">Manual Notes</div>
                </div>
              </div>
              <div className="px-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <div className="text-xs font-semibold text-[#0D0C22]">Traditional ATS</div>
                </div>
              </div>
              <div className="px-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                  <div className="text-xs font-semibold text-[#0D0C22]">BiasLens Agent</div>
                  <span className="ml-auto inline-flex items-center rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-2 py-1 text-[11px] font-semibold text-[#2563EB]">
                    Recommended
                  </span>
                </div>
              </div>
            </div>

            {rows.map((row, idx) => (
              <div key={row.feature} className="grid grid-cols-5 divide-x divide-[#E7E7E9]">
                <div className={"px-5 py-5 " + (idx === rows.length - 1 ? "" : "")}
                >
                  <div className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22]">{row.feature}</div>
                  <div className="mt-1 text-xs font-medium text-[#6E6D7A]">Structured, traceable signals</div>
                </div>

                <div className="px-5 py-5 bg-[#FFFFFF]">
                  <CellBadge value={row.items.generic} />
                </div>
                <div className="px-5 py-5 bg-[#FFFFFF]">
                  <CellBadge value={row.items.manual} />
                </div>
                <div className="px-5 py-5 bg-[#FFFFFF]">
                  <CellBadge value={row.items.ats} />
                </div>
                <div className="px-5 py-5 bg-[#2563EB]/5">
                  <CellBadge value={row.items.biaslens} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
