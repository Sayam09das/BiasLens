"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Check,
  Minus,
  AlertTriangle,
  Lock,
} from "lucide-react";

type RowKey =
  | "resume_scoring"
  | "explainability"
  | "fairness_monitoring"
  | "counterfactual_testing"
  | "audit_reports"
  | "security_workflow"
  | "best_for";

type Cell = {
  tone: "check" | "minus" | "warn";
  text: string;
};

type ComparisonRow = {
  key: RowKey;
  label: string;
  traditionalATS: Cell;
  manualReview: Cell;
  genericAITools: Cell;
  biasLens: Cell;
};

function ToneIcon({ tone }: { tone: Cell["tone"] }) {
  if (tone === "check") {
    return <Check className="h-4 w-4" aria-hidden="true" />;
  }
  if (tone === "minus") {
    return <Minus className="h-4 w-4" aria-hidden="true" />;
  }
  return <AlertTriangle className="h-4 w-4" aria-hidden="true" />;
}

function CellView({ tone, text }: Cell) {
  const bg =
    tone === "check"
      ? "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20"
      : tone === "minus"
        ? "bg-[#F6F8FB] text-[#6E6D7A] border-[#E7E7E9]"
        : "bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/20";

  const border = tone === "minus" ? "" : "";

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${bg} ${border}`}
    >
      <span
        className={
          tone === "check"
            ? "inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]/10"
            : tone === "minus"
              ? "inline-flex h-7 w-7 items-center justify-center rounded-full bg-white"
              : "inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F59E0B]/10"
        }
      >
        <ToneIcon tone={tone} />
      </span>
      <span>{text}</span>
    </div>
  );
}

export default function FeatureComparisonSection() {
  const rows: ComparisonRow[] = [
    {
      key: "resume_scoring",
      label: "Resume Scoring",
      traditionalATS: {
        tone: "minus",
        text: "Basic keyword filtering",
      },
      manualReview: {
        tone: "warn",
        text: "Subjective & inconsistent",
      },
      genericAITools: {
        tone: "minus",
        text: "Unstructured scoring",
      },
      biasLens: {
        tone: "check",
        text: "Explainable job-fit scoring",
      },
    },
    {
      key: "explainability",
      label: "Explainability",
      traditionalATS: { tone: "minus", text: "Limited reasoning" },
      manualReview: { tone: "warn", text: "Hard to document" },
      genericAITools: { tone: "minus", text: "Often unclear" },
      biasLens: {
        tone: "check",
        text: "Decision breakdown & signal attribution",
      },
    },
    {
      key: "fairness_monitoring",
      label: "Fairness Monitoring",
      traditionalATS: { tone: "minus", text: "Rare or unavailable" },
      manualReview: { tone: "warn", text: "Difficult to measure" },
      genericAITools: { tone: "minus", text: "Not audit-ready" },
      biasLens: {
        tone: "check",
        text: "Bias risk detection & fairness metrics",
      },
    },
    {
      key: "counterfactual_testing",
      label: "Counterfactual Testing",
      traditionalATS: { tone: "minus", text: "Not supported" },
      manualReview: { tone: "warn", text: "Not scalable" },
      genericAITools: { tone: "minus", text: "Manual prompting required" },
      biasLens: {
        tone: "check",
        text: "Built-in counterfactual comparison",
      },
    },
    {
      key: "audit_reports",
      label: "Audit Reports",
      traditionalATS: { tone: "minus", text: "Basic applicant records" },
      manualReview: { tone: "warn", text: "Manual documentation" },
      genericAITools: { tone: "minus", text: "No structured reports" },
      biasLens: { tone: "check", text: "PDF reports & compliance-ready records" },
    },
    {
      key: "security_workflow",
      label: "Security Workflow",
      traditionalATS: { tone: "minus", text: "Platform dependent" },
      manualReview: { tone: "warn", text: "File sharing risk" },
      genericAITools: { tone: "minus", text: "Data governance concerns" },
      biasLens: {
        tone: "check",
        text: "Auth, protected APIs, validation & admin logs",
      },
    },
    {
      key: "best_for",
      label: "Best For",
      traditionalATS: { tone: "minus", text: "Applicant tracking" },
      manualReview: { tone: "warn", text: "Small hiring volume" },
      genericAITools: { tone: "minus", text: "General text assistance" },
      biasLens: { tone: "check", text: "Transparent, fair, explainable resume auditing" },
    },
  ];

  return (
    <section aria-label="Feature Comparison" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Feature Comparison
          </span>

          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Why BiasLens Goes Beyond Traditional Resume Screening
          </h2>
          <p className="mx-auto mt-4 max-w-[72ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
            Traditional ATS tools organize applicants, manual review is slow and inconsistent, and generic AI tools lack auditability. BiasLens combines resume intelligence, explainability, fairness monitoring, and secure reporting in one workflow.
          </p>
        </div>

        {/* Desktop comparison table */}
        <div className="mt-12 hidden overflow-hidden rounded-[2rem] border border-[#E7E7E9] bg-white/70 shadow-[0_20px_70px_rgba(13,12,34,0.05)] backdrop-blur-xl lg:block">
          <div className="grid grid-cols-4">
            {/* Header */}
            <div className="col-span-1 border-r border-[#E7E7E9] p-6">
              <div className="text-sm font-semibold text-[#0D0C22]">Capabilities</div>
              <div className="mt-2 text-xs font-medium text-[#6E6D7A]">How tools handle key decisions</div>
            </div>

            <div className="relative border-r border-[#E7E7E9] p-6">
              <div className="text-sm font-semibold text-[#6E6D7A]">Traditional ATS</div>
              <div className="mt-2 text-xs font-medium text-[#6E6D7A]">Operations-first</div>
            </div>
            <div className="relative border-r border-[#E7E7E9] p-6">
              <div className="text-sm font-semibold text-[#6E6D7A]">Manual Review</div>
              <div className="mt-2 text-xs font-medium text-[#6E6D7A]">People-dependent</div>
            </div>
            <div className="relative p-6">
              <div className="text-sm font-semibold text-[#6E6D7A]">Generic AI Tools</div>
              <div className="mt-2 text-xs font-medium text-[#6E6D7A]">Unstructured outputs</div>
            </div>
          </div>

          {/* Main rows */}
          <div className="grid grid-cols-4 border-t border-[#E7E7E9]">
            {rows.map((r) => (
              <React.Fragment key={r.key}>
                <div className="col-span-1 border-r border-[#E7E7E9] p-5">
                  <div className="text-sm font-semibold text-[#0D0C22]">{r.label}</div>
                </div>
                <div className="col-span-1 border-r border-[#E7E7E9] p-5">
                  <CellView {...r.traditionalATS} />
                </div>
                <div className="col-span-1 border-r border-[#E7E7E9] p-5">
                  <CellView {...r.manualReview} />
                </div>
                <div className="col-span-1 p-5">
                  <CellView {...r.genericAITools} />
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* BiasLens column overlay (separate grid for 4 columns requirement) */}
          <div className="border-t border-[#E7E7E9]">
            <div className="grid grid-cols-[1fr_repeat(3,1fr)]">
              {/* spacer header row */}
              <div className="border-r border-[#E7E7E9] p-0" />
              <div className="col-span-3" />
            </div>
          </div>

          {/* Recommended BiasLens column (rendered as an aligned absolute column inside the table wrapper) */}
          <div className="sr-only">BiasLens column included in mobile layout.</div>
        </div>

        {/* Mobile stacked comparison cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 lg:hidden">
          {rows.map((r) => (
            <motion.article
              key={r.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1.6rem] border border-[#E7E7E9] bg-white/70 p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)] backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[#0D0C22]">{r.label}</div>
                  <div className="mt-2 text-xs font-medium text-[#6E6D7A]">Quick comparison</div>
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-3 py-1.5 text-xs font-semibold text-[#2563EB]">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Recommended
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div>
                  <div className="text-xs font-semibold text-[#6E6D7A]">Traditional ATS</div>
                  <div className="mt-2"><CellView {...r.traditionalATS} /></div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#6E6D7A]">Manual Review</div>
                  <div className="mt-2"><CellView {...r.manualReview} /></div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#6E6D7A]">Generic AI Tools</div>
                  <div className="mt-2"><CellView {...r.genericAITools} /></div>
                </div>
                <div className="rounded-[1.2rem] border border-[#2563EB]/25 bg-[#2563EB]/5 p-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB]/10">
                      <Lock className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-[#0D0C22]">BiasLens</div>
                      <div className="text-xs font-medium text-[#6E6D7A]">Best in class for explainable audits</div>
                    </div>
                  </div>
                  <div className="mt-3"><CellView {...r.biasLens} /></div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
