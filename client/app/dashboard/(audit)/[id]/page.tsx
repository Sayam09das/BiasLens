"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  ExternalLink,
  RefreshCcw,
  Share2,
  Sparkles,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type AuditStatus = "completed" | "running" | "failed" | "queued";

type AuditDetails = {
  auditId: string;
  candidateName: string;
  status: AuditStatus;
  createdAt: string;

  scores: {
    resumeScore: number; // 0-100
    jobFit: number;
    skillsMatch: number;
    fairnessRisk: number; // 0-100
  };

  sections: {
    candidateOverview: string[];
    resumeIntelligence: { label: string; value: string }[];
    explainabilityInsights: { title: string; body: string }[];
    fairnessAnalysis: { title: string; body: string }[];
    counterfactualResults: { scenario: string; impact: string }[];
    improvementSuggestions: string[];
    timeline: { at: string; event: string }[];
  };
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function scoreColor(score: number, kind: "positive" | "risk") {
  // risk: higher is worse
  if (kind === "risk") {
    if (score >= 70) return "text-[#EF4444]";
    if (score >= 40) return "text-[#2563EB]";
    return "text-[#16A34A]";
  }

  if (score >= 80) return "text-[#16A34A]";
  if (score >= 55) return "text-[#2563EB]";
  return "text-[#EF4444]";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function Badge({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  tone?: "primary" | "danger" | "neutral";
  className?: string;
}) {
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold";

  const toneClass =
    tone === "danger"
      ? "border-[#FECACA] bg-[#FEF2F2] text-[#EF4444]"
      : tone === "neutral"
        ? "border-[#E5E7EB] bg-white/70 text-[#6E6D7A]"
        : "border-[#DBEAFE] bg-[#EFF6FF] text-[#2563EB]";

  return <span className={`${base} ${toneClass} ${className ?? ""}`}>{children}</span>;
}

function ProgressCard({
  title,
  score,
  kind,
  hint,
}: {
  title: string;
  score: number;
  kind: "positive" | "risk";
  hint: string;
}) {
  const s = clamp(Math.round(score), 0, 100);

  return (
    <Card className="relative overflow-hidden rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(700px 220px at 50% -60px, rgba(37,99,235,0.18), rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              {title}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-semibold ${scoreColor(s, kind)}`}>{s}</p>
            <p className="mt-1 text-xs text-[#6E6D7A]">{hint}</p>
          </div>
        </div>

        <div className="mt-4">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-[#0D0C22]/[0.08]"
            aria-hidden="true"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${s}%` }}
              transition={{ type: "tween", duration: 0.55, ease: "easeOut" }}
              className="h-full rounded-full bg-[#2563EB]"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(37,99,235,0.12) inset, 0 16px 50px -30px rgba(37,99,235,0.7)",
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#0D0C22]">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-[#6E6D7A]">{subtitle}</p>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

export default function AuditDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const auditId = (params?.id ?? "").toString();
  const [isSharing, setIsSharing] = useState(false);
  const [isReRun, setIsReRun] = useState(false);

  const details: AuditDetails = useMemo(() => {
    // Production: fetch by auditId from your API.
    // This page renders a stable, premium layout even before data arrives.
    const createdAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString();

    return {
      auditId: auditId || "AUDIT-•••",
      candidateName: "Alex Morgan",
      status: (auditId ? ("completed" as const) : ("running" as const)) as AuditStatus,
      createdAt,
      scores: {
        resumeScore: auditId ? 86 : 62,
        jobFit: auditId ? 78 : 55,
        skillsMatch: auditId ? 81 : 51,
        fairnessRisk: auditId ? 29 : 46,
      },
      sections: {
        candidateOverview: [
          "Clear alignment with core role requirements.",
          "Strong evidence of structured problem solving and stakeholder communication.",
          "Some resume signals require verification against employment history.",
        ],
        resumeIntelligence: [
          { label: "Primary domain", value: "Data & Decision Science" },
          { label: "Seniority signal", value: "Mid → Senior" },
          { label: "ATS readability", value: "High" },
          { label: "Compliance flags", value: "Low" },
        ],
        explainabilityInsights: [
          {
            title: "Why the resume scored higher",
            body: "BiasLens prioritized consistent evidence of measurable impact, relevant tool usage, and role-aligned responsibilities.",
          },
          {
            title: "What was discounted",
            body: "Unsubstantiated claims and missing context reduced confidence in a subset of competencies.",
          },
        ],
        fairnessAnalysis: [
          {
            title: "Fairness risk assessment",
            body: "Signals suggest moderate exposure to variability from phrasing and non-standard formatting. Mitigations are recommended before final decisions.",
          },
          {
            title: "Actionable fairness levers",
            body: "BiasLens recommends standardized rubric scoring, evidence-based thresholds, and counterfactual review for borderline cases.",
          },
        ],
        counterfactualResults: [
          {
            scenario: "Reduced emphasis on unrelated tooling",
            impact: "Overall job fit improved by +6.2% due to stronger requirement alignment.",
          },
          {
            scenario: "Standardized phrasing to match rubric language",
            impact: "Fairness risk decreased by -9 points by reducing format/wording variability.",
          },
        ],
        improvementSuggestions: [
          "Add quantified outcomes for each major responsibility (metrics, timelines, scope).",
          "Mirror rubric terms with only substantiated claims (avoid keyword stuffing).",
          "Ensure consistent, ATS-friendly formatting for sections and dates.",
          "Include a brief evidence mapping: requirements → resume excerpts.",
        ],
        timeline: [
          { at: "Queued", event: "Audit job added to processing queue." },
          { at: "Processing", event: "Extracted resume signals and job constraints." },
          { at: "Explained", event: "Generated explainability insights and evidence highlights." },
          { at: "Finalized", event: "Computed fairness metrics and recommendations." },
        ],
      },
    };
  }, [auditId]);

  const statusTone =
    details.status === "failed" ? "danger" : details.status === "completed" ? "primary" : "neutral";

  const statusLabel =
    details.status === "completed"
      ? "Completed"
      : details.status === "running"
        ? "Running"
        : details.status === "queued"
          ? "Queued"
          : "Failed";

  const share = async () => {
    try {
      setIsSharing(true);
      const url = `${window.location.origin}/audit/${details.auditId}`;
      await navigator.clipboard.writeText(url);
    } finally {
      setIsSharing(false);
    }
  };

  const reRunAudit = async () => {
    try {
      setIsReRun(true);
      // Production: POST /api/audits/:id/rerun
      await new Promise((r) => setTimeout(r, 900));
      router.refresh();
    } finally {
      setIsReRun(false);
    }
  };

  const exportPdf = async () => {
    // Production: fetch a signed URL or call your export endpoint.
    await new Promise((r) => setTimeout(r, 450));
    // eslint-disable-next-line no-alert
    alert("Export PDF is a placeholder. Wire it to your backend export endpoint.");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-0">
      <div className="flex flex-col gap-4 px-0 pb-6 pt-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
            Audit Report
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
            Audit details
          </h1>
          <p className="mt-2 text-sm text-[#6E6D7A]">
            Premium, explainable hiring intelligence with fairness-aware insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={statusTone}>
            {statusLabel}
          </Badge>
          <Button
            type="button"
            variant="outline"
            className="rounded-[1.5rem] border-[#DBEAFE] bg-white/70"
            onClick={() => exportPdf()}
            disabled={details.status !== "completed"}
          >
            <Download size={18} aria-hidden="true" />
            <span className="ml-2">Export PDF</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-[1.5rem] px-4 text-[#2563EB] hover:bg-[#EFF6FF]"
            onClick={() => reRunAudit()}
            disabled={details.status === "running" || isReRun}
          >
            <RefreshCcw size={18} aria-hidden="true" />
            <span className="ml-2">Re-run Audit</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-[1.5rem] px-4 text-[#2563EB] hover:bg-[#EFF6FF]"
            onClick={() => share()}
            disabled={isSharing}
          >
            <Share2 size={18} aria-hidden="true" />
            <span className="ml-2">Share Report</span>
          </Button>
        </div>
      </div>

      {/* Summary + Scores */}
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="Audit Summary" subtitle="At-a-glance report metadata and readiness." >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4">
              <p className="text-xs font-semibold text-[#6E6D7A]">Audit ID</p>
              <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{details.auditId}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4">
              <p className="text-xs font-semibold text-[#6E6D7A]">Candidate Name</p>
              <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{details.candidateName}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4">
              <p className="text-xs font-semibold text-[#6E6D7A]">Audit Status</p>
              <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{statusLabel}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4">
              <p className="text-xs font-semibold text-[#6E6D7A]">Created Date</p>
              <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{formatDate(details.createdAt)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="mt-0.5 text-[#2563EB]" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Enterprise-grade explanation</p>
                <p className="mt-1 text-xs text-[#6E6D7A]">
                  Every score links back to evidence and counterfactual checks so teams can justify hiring decisions.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <ProgressCard
            title="Resume Score"
            score={details.scores.resumeScore}
            kind="positive"
            hint="Evidence strength"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <ProgressCard
              title="Job Fit"
              score={details.scores.jobFit}
              kind="positive"
              hint="Role alignment"
            />
            <ProgressCard
              title="Skills Match"
              score={details.scores.skillsMatch}
              kind="positive"
              hint="Competency fit"
            />
          </div>
          <ProgressCard
            title="Fairness Risk"
            score={details.scores.fairnessRisk}
            kind="risk"
            hint="Mitigation priority"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="mt-6 space-y-5">
        <SectionCard title="Candidate Overview" subtitle="Key narrative signals extracted from the resume.">
          <ul className="space-y-3">
            {details.sections.candidateOverview.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 inline-block h-2 w-2 rounded-full bg-[#2563EB] shadow-[0_0_0_6px_rgba(37,99,235,0.15)]"
                />
                <p className="text-sm text-[#0D0C22]">{item}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="Resume Intelligence" subtitle="Structured signals for ATS and rubric alignment.">
            <div className="space-y-3">
              {details.sections.resumeIntelligence.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-[#0D0C22]">{row.label}</p>
                  <p className="text-sm font-semibold text-[#6E6D7A]">{row.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Explainability Insights" subtitle="Transparent reasoning for each score component.">
            <div className="space-y-4">
              {details.sections.explainabilityInsights.map((row, i) => (
                <div
                  key={i}
                  className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
                >
                  <p className="text-sm font-semibold text-[#0D0C22]">{row.title}</p>
                  <p className="mt-2 text-sm text-[#6E6D7A]">{row.body}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="Fairness Analysis" subtitle="Risk factors and compliance-ready recommendations.">
            <div className="space-y-4">
              {details.sections.fairnessAnalysis.map((row, i) => (
                <div
                  key={i}
                  className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
                >
                  <p className="text-sm font-semibold text-[#0D0C22]">{row.title}</p>
                  <p className="mt-2 text-sm text-[#6E6D7A]">{row.body}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Counterfactual Results"
            subtitle="How score and fairness shift under controlled changes."
          >
            <div className="space-y-4">
              {details.sections.counterfactualResults.map((row, i) => (
                <div
                  key={i}
                  className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
                >
                  <p className="text-sm font-semibold text-[#0D0C22]">{row.scenario}</p>
                  <p className="mt-2 text-sm text-[#6E6D7A]">{row.impact}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Improvement Suggestions" subtitle="Actionable changes for higher-quality audits.">
          <ul className="grid gap-3 sm:grid-cols-2">
            {details.sections.improvementSuggestions.map((s, i) => (
              <li key={i} className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4">
                <p className="text-sm text-[#0D0C22]">{s}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Audit Timeline" subtitle="What BiasLens did, in order, for traceability.">
          <div className="space-y-3">
            {details.sections.timeline.map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
              >
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">{t.at}</p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Report Export" subtitle="Take the output into your workflow.">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#0D0C22]">Export your full report</p>
              <p className="text-xs text-[#6E6D7A]">
                PDF export is optimized for audit review, leadership presentations, and documentation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="default"
                className="rounded-[1.5rem]"
                onClick={() => exportPdf()}
                disabled={details.status !== "completed"}
              >
                <Download size={18} aria-hidden="true" />
                <span className="ml-2">Export PDF</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-[1.5rem] border-[#DBEAFE] bg-white/70"
                onClick={() => {
                  // Production: route to share page
                  router.push(`/audit/${details.auditId}`);
                }}
              >
                <ExternalLink size={18} aria-hidden="true" />
                <span className="ml-2">Open Report</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="rounded-[1.5rem] px-4 text-[#2563EB] hover:bg-[#EFF6FF]"
                onClick={() => share()}
                disabled={isSharing}
              >
                <Share2 size={18} aria-hidden="true" />
                <span className="ml-2">Share</span>
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {details.status !== "completed" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 rounded-[1.5rem] border border-[#DBEAFE] bg-[#EFF6FF] p-4"
              >
                <p className="text-sm font-semibold text-[#0D0C22]">Export will be available after completion</p>
                <p className="mt-1 text-xs text-[#6E6D7A]">
                  BiasLens is still processing. Keep this tab open for real-time updates.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </SectionCard>
      </div>

      {/* Bottom spacing */}
      <div className="pb-8" />
    </div>
  );
}

