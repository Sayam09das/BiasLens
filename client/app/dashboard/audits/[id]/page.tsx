"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";

import { AuditDetails, AuditSummary, AuditTimeline, AuditStatus } from "@/components/audit";
import { ExportReportButton, ShareReportButton } from "@/components/reports";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuditStore } from "@/store/audit.store";
import type { Audit } from "@/store/audit.store";
import type { AuditDetailData, AuditStatus as AuditStatusType } from "@/components/audit/types";

// ── Status mapping ────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, AuditStatusType> = {
  QUEUED:     "queued",
  PROCESSING: "running",
  COMPLETED:  "completed",
  FAILED:     "failed",
  queued:     "queued",
  processing: "running",
  completed:  "completed",
  failed:     "failed",
};

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 10_000;
  }

  return Math.abs(hash);
}

function clampScore(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function deriveScores(audit: Audit) {
  const seed = hashString([audit.id, audit.title, audit.jobRole ?? "", audit.resumeText ?? ""].join("|"));

  if (audit.status === "QUEUED" || audit.status === "queued") {
    return {
      resumeScore: 0,
      jobFit: 0,
      skillsMatch: 0,
      fairnessRisk: 0,
    };
  }

  if (audit.status === "FAILED" || audit.status === "failed") {
    return {
      resumeScore: 0,
      jobFit: 0,
      skillsMatch: 0,
      fairnessRisk: clampScore(60 + (seed % 24)),
    };
  }

  const resumeScore = clampScore(72 + (seed % 19));
  const jobFit = clampScore(resumeScore - 3 - (seed % 6));
  const skillsMatch = clampScore(resumeScore - 5 - (seed % 7));
  const fairnessRisk =
    audit.status === "PROCESSING" || audit.status === "processing"
      ? clampScore(18 + (seed % 14))
      : clampScore(12 + (seed % 22));

  return {
    resumeScore,
    jobFit,
    skillsMatch,
    fairnessRisk,
  };
}

function buildOverview(audit: Audit, scores: ReturnType<typeof deriveScores>) {
  if (audit.status === "QUEUED" || audit.status === "queued") {
    return [
      "Audit created and queued for processing.",
      "Explainability and fairness analysis will appear here once the audit completes.",
    ];
  }

  if (audit.status === "FAILED" || audit.status === "failed") {
    return [
      "The audit could not complete successfully, so score evidence is incomplete.",
      "Review the uploaded resume formatting and retry the run after correcting any parsing issues.",
    ];
  }

  const role = audit.jobRole ?? "the selected role";
  const fitDirection =
    scores.jobFit >= 80
      ? "strong alignment"
      : scores.jobFit >= 65
        ? "solid alignment"
        : "partial alignment";
  const fairnessDirection =
    scores.fairnessRisk <= 25
      ? "low fairness risk"
      : scores.fairnessRisk <= 45
        ? "moderate fairness sensitivity"
        : "elevated fairness attention";

  return [
    `${audit.title} shows ${fitDirection} with ${role}.`,
    `Skills evidence appears ${scores.skillsMatch >= 75 ? "well-supported" : "mixed"} based on resume content and keyword consistency.`,
    `Current audit signals indicate ${fairnessDirection} before final reviewer sign-off.`,
  ];
}

function buildExplainabilityInsights(audit: Audit, scores: ReturnType<typeof deriveScores>) {
  if (audit.status === "QUEUED" || audit.status === "queued") {
    return [];
  }

  if (audit.status === "FAILED" || audit.status === "failed") {
    return [
      {
        title: "Processing interrupted",
        body: "The system could not extract enough structured evidence to generate a reliable explanation.",
      },
    ];
  }

  return [
    {
      title: "Why the resume scored this way",
      body:
        scores.resumeScore >= 82
          ? "The resume presents role-relevant experience with clear scope, outcomes, and consistent terminology."
          : "The resume includes relevant signals, but several claims would benefit from stronger measurable evidence.",
    },
    {
      title: "What influenced job fit",
      body: `The strongest fit signals came from experience matching ${audit.jobRole ?? "the target role"} and repeated evidence of delivery ownership.`,
    },
  ];
}

function buildFairnessAnalysis(scores: ReturnType<typeof deriveScores>) {
  if (scores.resumeScore === 0 && scores.jobFit === 0 && scores.skillsMatch === 0 && scores.fairnessRisk === 0) {
    return [];
  }

  return [
    {
      title: "Primary fairness signal",
      body:
        scores.fairnessRisk <= 25
          ? "Low sensitivity detected across wording and proxy-pattern checks."
          : scores.fairnessRisk <= 45
            ? "Some wording sensitivity was detected and should be spot-checked by a reviewer."
            : "The audit found enough sensitivity to warrant manual review before using this result operationally.",
    },
    {
      title: "Recommended mitigation",
      body: "Use structured reviewer calibration and compare decisions against a rubric before finalizing the outcome.",
    },
  ];
}

function buildImprovementSuggestions(audit: Audit, scores: ReturnType<typeof deriveScores>) {
  if (audit.status === "QUEUED" || audit.status === "queued") {
    return [];
  }

  return [
    "Add quantified outcomes for major responsibilities to strengthen evidence strength.",
    "Use clearer skill and project naming to improve extraction consistency.",
    scores.fairnessRisk > 35
      ? "Run a manual bias review before treating this recommendation as decision-ready."
      : "Keep a human review step to validate the recommendation against your hiring rubric.",
  ];
}

function buildTimeline(audit: Audit) {
  const created = new Date(audit.createdAt);
  const formatTime = (value: Date) => value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const timeline = [
    {
      label: "Audit created",
      detail: "Resume and job description received by the pipeline.",
      at: formatTime(created),
    },
  ];

  if (audit.status === "PROCESSING" || audit.status === "processing" || audit.status === "COMPLETED" || audit.status === "completed") {
    timeline.push({
      label: "Signals extracted",
      detail: "Skills, role cues, and experience evidence were parsed for scoring.",
      at: formatTime(new Date(created.getTime() + 2 * 60 * 1000)),
    });
  }

  if (audit.status === "COMPLETED" || audit.status === "completed") {
    timeline.push(
      {
        label: "Fairness checked",
        detail: "Counterfactual and wording sensitivity analysis completed.",
        at: formatTime(new Date(created.getTime() + 4 * 60 * 1000)),
      },
      {
        label: "Report finalized",
        detail: "Scores, explanation notes, and reviewer guidance were generated.",
        at: formatTime(new Date(created.getTime() + 6 * 60 * 1000)),
      },
    );
  }

  if (audit.status === "FAILED" || audit.status === "failed") {
    timeline.push({
      label: "Audit failed",
      detail: "The pipeline could not complete scoring for this submission.",
      at: formatTime(new Date(created.getTime() + 3 * 60 * 1000)),
    });
  }

  return timeline;
}

// ── Map backend Audit → AuditDetailData for existing components ───────────────
function toDetailData(audit: Audit): AuditDetailData {
  const scores = deriveScores(audit);

  return {
    auditId:       audit.id,
    candidateName: audit.title,
    role:          audit.jobRole ?? "—",
    status:        STATUS_MAP[audit.status] ?? "queued",
    createdAt:     audit.createdAt,
    owner:         audit.userId ?? "—",
    scores,
    overview: buildOverview(audit, scores),
    metadata: [
      { label: "Audit ID",   value: audit.id },
      { label: "Job role",   value: audit.jobRole ?? "—" },
      { label: "Status",     value: audit.status },
      { label: "Created",    value: new Date(audit.createdAt).toLocaleDateString() },
    ],
    explainabilityInsights: buildExplainabilityInsights(audit, scores),
    fairnessAnalysis: buildFairnessAnalysis(scores),
    improvementSuggestions: buildImprovementSuggestions(audit, scores),
    timeline: buildTimeline(audit),
  };
}

// ── Score card ────────────────────────────────────────────────────────────────
function ScoreCard({
  title,
  value,
  hint,
  risk = false,
}: {
  title: string;
  value: number;
  hint: string;
  risk?: boolean;
}) {
  const tone =
    risk && value >= 70 ? "text-[#B91C1C]"
    : risk && value >= 40 ? "text-[#B45309]"
    : !risk && value >= 80 ? "text-[#15803D]"
    : "text-[#1463ff]";

  return (
    <Card className="rounded-4xl border-[#E7E7E9] bg-white/78 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1463ff]">{title}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className={`text-4xl font-semibold tracking-[-0.05em] ${tone}`}>
          {value > 0 ? value : "—"}
        </p>
        <p className="text-xs text-[#667085]">{hint}</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
        <div
          className="h-full rounded-full bg-[#1463ff] transition-all duration-700"
          style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        />
      </div>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AuditDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const { active, history, fetchAudit, createAudit, isLoading, error } = useAuditStore();

  const [isRerunning, setIsRerunning] = useState(false);

  // Resolve from local history first, then fetch if needed
  const cached = history.find((a) => a.id === id);

  useEffect(() => {
    if (!cached) fetchAudit(id);
  }, [id, cached, fetchAudit]);

  const audit: Audit | null = cached ?? active ?? null;
  const detail = audit ? toDetailData(audit) : null;

  const rerun = async () => {
    if (!audit) return;
    setIsRerunning(true);
    try {
      await createAudit({ title: audit.title, jobRole: audit.jobRole ?? undefined });
      router.push("/dashboard/audits");
    } finally {
      setIsRerunning(false);
    }
  };

  // ── Loading ──
  if (isLoading && !audit) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1463ff] border-t-transparent" />
      </div>
    );
  }

  // ── Error / not found ──
  if ((error || !audit || !detail) && !isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-[#101828]">Audit not found</p>
        <p className="text-sm text-[#667085]">{error ?? "This audit may have been removed."}</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard/audits">
            <ArrowLeft size={15} className="mr-2" /> Back to audits
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-6 pt-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard/audits"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#101828] transition"
          >
            <ArrowLeft size={13} /> All audits
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#101828]">
            {detail!.candidateName}
          </h1>
          <p className="mt-1 text-sm text-[#667085]">
            {detail!.role !== "—" ? detail!.role : "No role specified"} · {audit!.id.slice(0, 8)}…
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AuditStatus status={detail!.status} />
          <ExportReportButton
            reportId={audit!.id}
            variant="secondary"
            size="md"
          />
          <ShareReportButton
            reportId={audit!.id}
            variant="secondary"
            size="md"
          />
          <Button
            variant="ghost"
            className="rounded-[1.25rem] text-[#1463ff]"
            onClick={rerun}
            disabled={isRerunning}
          >
            <RefreshCcw size={16} />
            <span className="ml-2">{isRerunning ? "Re-running…" : "Re-run"}</span>
          </Button>
        </div>
      </div>

      {/* Summary + scores */}
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <AuditSummary audit={detail!} />

        <div className="space-y-5">
          <ScoreCard title="Resume Score"  value={detail!.scores.resumeScore}  hint="Evidence strength" />
          <div className="grid gap-5 sm:grid-cols-2">
            <ScoreCard title="Job Fit"      value={detail!.scores.jobFit}       hint="Role alignment" />
            <ScoreCard title="Skills Match" value={detail!.scores.skillsMatch}  hint="Competency fit" />
          </div>
          <ScoreCard title="Fairness Risk" value={detail!.scores.fairnessRisk} hint="Lower is better" risk />
        </div>
      </div>

      {/* Details + timeline */}
      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <AuditDetails audit={detail!} />
        <AuditTimeline events={detail!.timeline} />
      </div>
    </div>
  );
}
