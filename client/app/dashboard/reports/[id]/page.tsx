"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Download,
  FileArchive,
  FileText,
  Gavel,
  RefreshCcw,
  Scale,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Waypoints,
} from "lucide-react";

// Note: This page intentionally renders a complete UI using mock data.
// Replace buildMockReport() with backend data fetching when ready.

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ReportStatus = "PDF_READY" | "DRAFT" | "GENERATING" | "FAILED" | "SHARED";
type FairnessRisk = "LOW" | "MEDIUM" | "HIGH";
type ResponsibleAIMaturity = "READY" | "REVIEW" | "PENDING";

type Brand = {
  primary: string;
  background: string;
  secondaryBackground: string;
  text: string;
  mutedText: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
};

const BRAND: Brand = {
  primary: "#2563EB",
  background: "#FFFFFF",
  secondaryBackground: "#F6F8FB",
  text: "#0D0C22",
  mutedText: "#6E6D7A",
  border: "#E7E7E9",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

type ReportHeader = {
  id: string;
  candidateName: string;
  role: string;
  status: ReportStatus;
  createdAt: string; // ISO
};

type OverviewMetrics = {
  resumeScore: number; // 0-100
  jobFit: number; // 0-100
  skillsMatch: number; // 0-100
  fairnessRisk: FairnessRisk;
  explainability: number; // 0-100
  reportStatus: ReportStatus;
};

type ExecutiveSummary = {
  candidateOverview: string[];
  finalRecommendation: "Recommended" | "Recommended with Conditions" | "Not Recommended";
  keyStrengths: string[];
  keyRisks: string[];
};

type ResumeIntelligence = {
  parsedResumeSummary: string[];
  skillsExtracted: { skill: string; evidence: string }[];
  missingSkills: { skill: string; rationale: string }[];
  roleAlignment: { dimension: string; score: number; rationale: string }[];
};

type ExplainabilityInsights = {
  decisionBreakdown: { factor: string; direction: "positive" | "negative"; weight: number; evidence: string }[];
  positiveSignalContributions: string[];
  negativeSignalContributions: string[];
  confidenceScore: number; // 0-100
};

type FairnessAnalysis = {
  biasRiskLevel: FairnessRisk;
  fairnessScore: number; // 0-100
  counterfactualConsistency: number; // 0-100
  responsibleAiNotes: string[];
};

type ImprovementSuggestions = {
  resumeRewriteSuggestions: string[];
  skillAlignmentTips: string[];
  missingEvidenceRecommendations: string[];
  quantificationImprovements: string[];
};

type AuditTrailEvent = {
  title: string;
  timestamp: string; // ISO
  detail: string;
  icon: "upload" | "analysis" | "fairness" | "generated" | "export";
};

type ComplianceNotes = {
  decisionEvidence: string[];
  humanReviewNote: string;
  responsibleAiStatus: ResponsibleAIMaturity;
  auditReadiness: "PASS" | "NEEDS_REVIEW" | "BLOCKED";
};

type ReportDetailModel = {
  header: ReportHeader;
  overview: OverviewMetrics;
  executiveSummary: ExecutiveSummary;
  resumeIntelligence: ResumeIntelligence;
  explainabilityInsights: ExplainabilityInsights;
  fairnessAnalysis: FairnessAnalysis;
  improvementSuggestions: ImprovementSuggestions;
  auditTrail: AuditTrailEvent[];
  complianceNotes: ComplianceNotes;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function riskLabel(risk: FairnessRisk) {
  if (risk === "LOW") return "Low Risk";
  if (risk === "MEDIUM") return "Medium Risk";
  return "High Risk";
}

function statusLabel(status: ReportStatus) {
  switch (status) {
    case "PDF_READY":
      return "PDF Ready";
    case "DRAFT":
      return "Draft";
    case "GENERATING":
      return "Generating";
    case "FAILED":
      return "Failed";
    case "SHARED":
      return "Shared";
  }
}

function riskVisual(risk: FairnessRisk) {
  switch (risk) {
    case "LOW":
      return {
        bg: "rgba(34, 197, 94, 0.10)",
        fg: BRAND.success,
        border: "rgba(34, 197, 94, 0.25)",
      };
    case "MEDIUM":
      return {
        bg: "rgba(245, 158, 11, 0.10)",
        fg: BRAND.warning,
        border: "rgba(245, 158, 11, 0.25)",
      };
    case "HIGH":
      return {
        bg: "rgba(239, 68, 68, 0.10)",
        fg: BRAND.danger,
        border: "rgba(239, 68, 68, 0.25)",
      };
  }
}

function statusVisual(status: ReportStatus) {
  switch (status) {
    case "PDF_READY":
      return {
        bg: "rgba(34, 197, 94, 0.10)",
        fg: BRAND.success,
        border: "rgba(34, 197, 94, 0.25)",
      };
    case "SHARED":
      return {
        bg: "rgba(37, 99, 235, 0.10)",
        fg: BRAND.primary,
        border: "rgba(37, 99, 235, 0.25)",
      };
    case "DRAFT":
      return {
        bg: "rgba(245, 158, 11, 0.10)",
        fg: BRAND.warning,
        border: "rgba(245, 158, 11, 0.25)",
      };
    case "GENERATING":
      return {
        bg: "rgba(37, 99, 235, 0.08)",
        fg: "#3B82F6",
        border: "rgba(37, 99, 235, 0.20)",
      };
    case "FAILED":
      return {
        bg: "rgba(239, 68, 68, 0.10)",
        fg: BRAND.danger,
        border: "rgba(239, 68, 68, 0.25)",
      };
  }
}

function ScoreRing({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "primary" | "success" | "warning" | "danger";
}) {
  const v = clamp(value, 0, 100);
  const circumference = 2 * Math.PI * 18;
  const dashOffset = circumference * (1 - v / 100);

  const colors =
    tone === "primary"
      ? { stroke: BRAND.primary, bg: "rgba(37, 99, 235, 0.12)" }
      : tone === "success"
        ? { stroke: BRAND.success, bg: "rgba(34, 197, 94, 0.12)" }
        : tone === "warning"
          ? { stroke: BRAND.warning, bg: "rgba(245, 158, 11, 0.14)" }
          : { stroke: BRAND.danger, bg: "rgba(239, 68, 68, 0.12)" };

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative grid place-items-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 9999,
          background: colors.bg,
          border: `1px solid ${BRAND.border}`,
        }}
        aria-hidden="true"
      >
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" stroke="rgba(231,231,233,1)" strokeWidth="4" fill="none" />
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke={colors.stroke}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "22px 22px" }}
          />
        </svg>
        <span className="absolute text-[11px] font-semibold text-[#0D0C22]">{Math.round(v)}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-[-0.01em] text-[#0D0C22]">{label}</p>
        <p className="mt-0.5 text-xs text-[#6E6D7A]">0–100</p>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  children,
  description,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className="grid h-10 w-10 place-items-center rounded-2xl"
                style={{ background: "rgba(37, 99, 235, 0.10)", border: `1px solid rgba(37, 99, 235, 0.18)` }}
                aria-hidden="true"
              >
                <span className="text-[#2563EB]">{icon}</span>
              </div>
              <h2 id={`${id}-title`} className="text-xl font-semibold tracking-[-0.02em] text-[#0D0C22]">
                {title}
              </h2>
            </div>
            {description ? <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{description}</p> : null}
          </div>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function ScorePill({
  value,
  tone,
}: {
  value: number;
  tone: "primary" | "success" | "warning" | "danger";
}) {
  const v = clamp(value, 0, 100);
  const vis =
    tone === "primary"
      ? { bg: "rgba(37, 99, 235, 0.10)", fg: BRAND.primary, border: "rgba(37, 99, 235, 0.25)" }
      : tone === "success"
        ? { bg: "rgba(34, 197, 94, 0.10)", fg: BRAND.success, border: "rgba(34, 197, 94, 0.25)" }
        : tone === "warning"
          ? { bg: "rgba(245, 158, 11, 0.10)", fg: BRAND.warning, border: "rgba(245, 158, 11, 0.25)" }
          : { bg: "rgba(239, 68, 68, 0.10)", fg: BRAND.danger, border: "rgba(239, 68, 68, 0.25)" };

  return (
    <span
      className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
      style={{ background: vis.bg, color: vis.fg, borderColor: vis.border }}
    >
      {Math.round(v)}/100
    </span>
  );
}

function iconForAudit(eventIcon: AuditTrailEvent["icon"]) {
  switch (eventIcon) {
    case "upload":
      return <Upload size={18} aria-hidden="true" />;
    case "analysis":
      return <Cpu size={18} aria-hidden="true" />;
    case "fairness":
      return <Scale size={18} aria-hidden="true" />;
    case "generated":
      return <Waypoints size={18} aria-hidden="true" />;
    case "export":
      return <FileArchive size={18} aria-hidden="true" />;
  }
}

function downloadPdfMock(report: ReportDetailModel) {
  const content = [
    `BiasLens Report (Mock)`,
    `Report ID: ${report.header.id}`,
    `Candidate: ${report.header.candidateName}`,
    `Role: ${report.header.role}`,
    `Status: ${report.header.status}`,
    `Created: ${report.header.createdAt}`,
    ``,
    `Executive Summary: ${report.executiveSummary.finalRecommendation}`,
    ``,
    `Key Strengths:`,
    ...report.executiveSummary.keyStrengths.map((s) => `- ${s}`),
    ``,
    `Key Risks:`,
    ...report.executiveSummary.keyRisks.map((s) => `- ${s}`),
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.header.id}.pdf.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildMockReport(): ReportDetailModel {
  const now = Date.now();
  const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();
  const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();

  return {
    header: {
      id: "RPT-1049",
      candidateName: "Liam Chen",
      role: "Backend Engineer",
      status: "SHARED",
      createdAt: daysAgo(4),
    },
    overview: {
      resumeScore: 88,
      jobFit: 83,
      skillsMatch: 86,
      fairnessRisk: "LOW",
      explainability: 93,
      reportStatus: "PDF_READY",
    },
    executiveSummary: {
      candidateOverview: [
        "Strong alignment with the target role based on extracted skills and evidence.",
        "Decision signals show stable contribution patterns across evaluation factors.",
      ],
      finalRecommendation: "Recommended",
      keyStrengths: [
        "Demonstrated experience with backend systems and APIs.",
        "Evidence of scalable architecture and data modeling.",
        "Clear communication and role-relevant competencies.",
      ],
      keyRisks: [
        "Limited evidence of cross-functional leadership in the provided resume.",
        "Some skill gaps could benefit from targeted follow-up questions.",
      ],
    },
    resumeIntelligence: {
      parsedResumeSummary: [
        "Resume describes backend engineering experience with emphasis on APIs, databases, and performance.",
        "Shows exposure to system design, reliability, and development tooling.",
      ],
      skillsExtracted: [
        { skill: "Node.js", evidence: "Built production APIs and services" },
        { skill: "PostgreSQL", evidence: "Designed normalized schemas" },
        { skill: "System Design", evidence: "Reduced latency with caching" },
      ],
      missingSkills: [
        { skill: "Cloud-native deployment", rationale: "No explicit mention of Kubernetes or managed deployments" },
        { skill: "Security engineering", rationale: "Security practices not explicitly detailed" },
      ],
      roleAlignment: [
        { dimension: "Experience depth", score: 88, rationale: "Relevant projects and responsibilities" },
        { dimension: "Skills match", score: 86, rationale: "Matches most required backend competencies" },
        { dimension: "Explainability", score: 93, rationale: "Clear evidence supports decision signals" },
      ],
    },
    explainabilityInsights: {
      decisionBreakdown: [
        {
          factor: "Skills Match",
          direction: "positive",
          weight: 0.42,
          evidence: "Extracted backend skills align with job requirements",
        },
        {
          factor: "Job Fit",
          direction: "positive",
          weight: 0.33,
          evidence: "Experience map indicates strong role similarity",
        },
        {
          factor: "Evidence Coverage",
          direction: "negative",
          weight: 0.15,
          evidence: "Some areas lack explicit resume evidence",
        },
      ],
      positiveSignalContributions: [
        "Strong backend skill evidence",
        "High alignment between resume and target role",
        "Consistent explainability signals",
      ],
      negativeSignalContributions: [
        "Missing detail in deployment and security",
        "Limited proof of leadership scope",
      ],
      confidenceScore: 90,
    },
    fairnessAnalysis: {
      biasRiskLevel: "LOW",
      fairnessScore: 86,
      counterfactualConsistency: 88,
      responsibleAiNotes: [
        "Low risk based on stable counterfactual consistency.",
        "Human review recommended for final hiring decision.",
      ],
    },
    improvementSuggestions: {
      resumeRewriteSuggestions: [
        "Add explicit examples of deployment and monitoring (e.g., CI/CD, observability).",
        "Include security-related practices (authz/authn, threat modeling, secure coding).",
      ],
      skillAlignmentTips: [
        "Map each role requirement to a concrete project metric or outcome.",
        "Use keywords from the job description where they accurately apply.",
      ],
      missingEvidenceRecommendations: [
        "Provide evidence for cloud-native deployment and security engineering.",
        "Quantify leadership scope with measurable outcomes.",
      ],
      quantificationImprovements: [
        "Add performance metrics (latency, throughput, cost reductions).",
        "Include operational metrics (uptime, incident frequency, MTTR).",
      ],
    },
    auditTrail: [
      {
        title: "Resume uploaded",
        timestamp: hoursAgo(48),
        detail: "Candidate resume ingested and parsed for required signals.",
        icon: "upload",
      },
      {
        title: "Explainability analysis",
        timestamp: hoursAgo(46),
        detail: "Decision factors computed with evidence attribution.",
        icon: "analysis",
      },
      {
        title: "Fairness evaluation",
        timestamp: hoursAgo(44),
        detail: "Bias risk assessed using counterfactual consistency.",
        icon: "fairness",
      },
      {
        title: "Report generated",
        timestamp: hoursAgo(42),
        detail: "Executive summary, recommendations, and sections compiled.",
        icon: "generated",
      },
      {
        title: "Exported",
        timestamp: hoursAgo(40),
        detail: "PDF export prepared and share action enabled.",
        icon: "export",
      },
    ],
    complianceNotes: {
      decisionEvidence: [
        "Skills match: extracted evidence mapped to job competencies.",
        "Explainability signals: decision breakdown provided with supporting text.",
        "Fairness: low bias risk with consistency checks.",
      ],
      humanReviewNote: "Recommended human review before final decision.",
      responsibleAiStatus: "REVIEW",
      auditReadiness: "PASS",
    },
  };
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const reportId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined) ?? "RPT-1049";

  // Mock report until backend wiring is added.
  const [report] = React.useState<ReportDetailModel>(() => ({
    ...buildMockReport(),
    header: {
      ...buildMockReport().header,
      id: reportId,
    },
  }));

  const [isDownloading, setIsDownloading] = React.useState(false);

  const goBackHref = "/dashboard/reports";

  const fairnessVis = riskVisual(report.fairnessAnalysis.biasRiskLevel);
  const statusVis = statusVisual(report.header.status);

  const auditReadinessTone =
    report.complianceNotes.auditReadiness === "PASS"
      ? "success"
      : report.complianceNotes.auditReadiness === "NEEDS_REVIEW"
        ? "warning"
        : "danger";

  const readinessToneMap: Record<"PASS" | "NEEDS_REVIEW" | "BLOCKED", { label: string; tone: "success" | "warning" | "danger" }> = {
    PASS: { label: "Pass", tone: "success" },
    "NEEDS_REVIEW": { label: "Needs Review", tone: "warning" },
    BLOCKED: { label: "Blocked", tone: "danger" },
  };

  const readiness = readinessToneMap[report.complianceNotes.auditReadiness];

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      downloadPdfMock(report);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    // UI-only mock
    alert("Share action is a mock. Wire this to your backend when ready.");
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button asChild variant="outline" className="rounded-[1.25rem] border-[#E7E7E9] bg-[#FFFFFF] hover:bg-[#F6F8FB]">
            <Link href={goBackHref} aria-label="Back to reports">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Link>
          </Button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Report Detail</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-3xl">
              {report.header.candidateName}
            </h1>
            <p className="mt-1 text-sm text-[#6E6D7A]">
              {report.header.role} • Created {formatDate(report.header.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || report.header.status !== "PDF_READY"}
            className="rounded-[1.25rem] bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-60"
          >
            <Download size={16} className="mr-2" />
            {isDownloading ? "Preparing..." : "Download PDF"}
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            className="rounded-[1.25rem] border-[#E7E7E9] text-[#6E6D7A] hover:bg-[#F6F8FB]"
          >
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Header cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
                    style={{ background: statusVis.bg, color: statusVis.fg, borderColor: statusVis.border }}
                  >
                    {statusLabel(report.header.status)}
                  </span>

                  <span
                    className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
                    style={{ background: fairnessVis.bg, color: fairnessVis.fg, borderColor: fairnessVis.border }}
                  >
                    {riskLabel(report.fairnessAnalysis.biasRiskLevel)}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-[#0D0C22]">
                  Executive Summary
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6E6D7A]">
                  {report.executiveSummary.candidateOverview.join(" ")}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#22C55E]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0D0C22]">Final Recommendation</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#0D0C22]">
                      {report.executiveSummary.finalRecommendation}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <ScorePill value={report.overview.resumeScore} tone="primary" />
                  <ScorePill value={report.overview.jobFit} tone="success" />
                  <ScorePill value={report.overview.explainability} tone="primary" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Key Strengths</p>
                <ul className="mt-2 space-y-2">
                  {report.executiveSummary.keyStrengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#22C55E]" aria-hidden="true" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Key Risks</p>
                <ul className="mt-2 space-y-2">
                  {report.executiveSummary.keyRisks.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#F59E0B]" aria-hidden="true" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:p-6">
            <p className="text-sm font-semibold text-[#0D0C22]">Report Health</p>
            <div className="mt-4 space-y-4">
              <ScoreRing value={report.overview.resumeScore} label="Resume Score" tone="primary" />
              <ScoreRing value={report.overview.jobFit} label="Job Fit" tone="success" />
              <ScoreRing value={report.overview.skillsMatch} label="Skills Match" tone="primary" />
              <ScoreRing value={report.overview.explainability} label="Explainability" tone="primary" />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#2563EB]" aria-hidden="true" />
                  <p className="text-sm font-semibold text-[#0D0C22]">Audit Readiness</p>
                </div>

                <span
                  className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
                  style={{
                    background:
                      readiness.tone === "success"
                        ? "rgba(34, 197, 94, 0.10)"
                        : readiness.tone === "warning"
                          ? "rgba(245, 158, 11, 0.10)"
                          : "rgba(239, 68, 68, 0.10)",
                    color:
                      readiness.tone === "success"
                        ? BRAND.success
                        : readiness.tone === "warning"
                          ? BRAND.warning
                          : BRAND.danger,
                    borderColor:
                      readiness.tone === "success"
                        ? "rgba(34, 197, 94, 0.25)"
                        : readiness.tone === "warning"
                          ? "rgba(245, 158, 11, 0.25)"
                          : "rgba(239, 68, 68, 0.25)",
                  }}
                >
                  {readiness.label}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#6E6D7A]">{report.complianceNotes.humanReviewNote}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Responsible AI</p>
              <p className="mt-1 text-sm font-semibold text-[#0D0C22]">{report.complianceNotes.responsibleAiStatus}</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-6">
        <Section
          id="executive"
          title="Resume Intelligence"
          description="How the system understood the resume and role alignment evidence."
          icon={<ClipboardList size={18} aria-hidden="true" />}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p id="executive-title" className="sr-only">Resume summary</p>
              <p className="text-sm font-semibold text-[#0D0C22]">Parsed Resume Summary</p>
              <ul className="mt-3 space-y-2">
                {report.resumeIntelligence.parsedResumeSummary.map((s, idx) => (
                  <li key={idx} className="text-sm text-[#6E6D7A]">{s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Role Alignment</p>
              <div className="mt-3 space-y-3">
                {report.resumeIntelligence.roleAlignment.map((row, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D0C22]">{row.dimension}</p>
                      <p className="mt-1 text-xs text-[#6E6D7A]">{row.rationale}</p>
                    </div>
                    <ScorePill value={row.score} tone="primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Skills Extracted</p>
              <div className="mt-3 space-y-3">
                {report.resumeIntelligence.skillsExtracted.map((s, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D0C22]">{s.skill}</p>
                      <p className="mt-1 text-xs text-[#6E6D7A]">{s.evidence}</p>
                    </div>
                    <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#F6F8FB] text-[#2563EB]" aria-hidden="true">
                      <Sparkles size={16} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Missing Skills</p>
              <div className="mt-3 space-y-3">
                {report.resumeIntelligence.missingSkills.map((s, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D0C22]">{s.skill}</p>
                      <p className="mt-1 text-xs text-[#6E6D7A]">{s.rationale}</p>
                    </div>
                    <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#F6F8FB] text-[#F59E0B]" aria-hidden="true">
                      <ShieldCheck size={16} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* NOTE: Rest of sections were truncated in the original file.
          This page now has a complete, working UI shell with core sections.
          Add remaining sections (Explainability, Fairness, Audit trail, Compliance) if needed. */}

      <div className="space-y-6">
        <Section
          id="explainability"
          title="Explainability Insights"
          description="Decision factors and confidence signal contributions."
          icon={<Cpu size={18} aria-hidden="true" />}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Decision Breakdown</p>
              <div className="mt-3 space-y-3">
                {report.explainabilityInsights.decisionBreakdown.map((d, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D0C22]">{d.factor}</p>
                      <p className="mt-1 text-xs text-[#6E6D7A]">{d.evidence}</p>
                    </div>
                    <span
                      className="mt-1 inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
                      style={{
                        background:
                          d.direction === "positive" ? "rgba(34, 197, 94, 0.10)" : "rgba(239, 68, 68, 0.10)",
                        color:
                          d.direction === "positive" ? BRAND.success : BRAND.danger,
                        borderColor:
                          d.direction === "positive" ? "rgba(34, 197, 94, 0.25)" : "rgba(239, 68, 68, 0.25)",
                      }}
                    >
                      {d.direction === "positive" ? "+" : "-"}
                      {Math.round(d.weight * 100) / 100}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Signal Contributions</p>
              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                  <p className="text-sm font-semibold text-[#0D0C22]">Positive Signals</p>
                  <ul className="mt-2 space-y-2">
                    {report.explainabilityInsights.positiveSignalContributions.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#22C55E]" aria-hidden="true" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                  <p className="text-sm font-semibold text-[#0D0C22]">Negative Signals</p>
                  <ul className="mt-2 space-y-2">
                    {report.explainabilityInsights.negativeSignalContributions.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#EF4444]" aria-hidden="true" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                  <p className="text-sm font-semibold text-[#0D0C22]">Confidence Score</p>
                  <p className="mt-2 text-3xl font-semibold text-[#0D0C22]">
                    {Math.round(report.explainabilityInsights.confidenceScore)}/100
                  </p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">Higher means stronger evidence coverage.</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="fairness"
          title="Fairness Analysis"
          description="Bias risk and consistency signals used for safe decision review."
          icon={<Scale size={18} aria-hidden="true" />}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Fairness Scores</p>
              <div className="mt-3 space-y-4">
                <ScoreRing value={report.fairnessAnalysis.fairnessScore} label="Fairness Score" tone="primary" />
                <ScoreRing value={report.fairnessAnalysis.counterfactualConsistency} label="Counterfactual Consistency" tone="success" />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Responsible AI Notes</p>
              <ul className="mt-3 space-y-2">
                {report.fairnessAnalysis.responsibleAiNotes.map((n, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="improvements"
          title="Improvement Suggestions"
          description="Actionable recommendations to strengthen resume clarity and evidence quality."
          icon={<Sparkles size={18} aria-hidden="true" />}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Resume Rewrite Suggestions</p>
              <ul className="mt-3 space-y-2">
                {report.improvementSuggestions.resumeRewriteSuggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#22C55E]" aria-hidden="true" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Skill Alignment Tips</p>
              <ul className="mt-3 space-y-2">
                {report.improvementSuggestions.skillAlignmentTips.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 md:col-span-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">Missing Evidence Recommendations</p>
                  <ul className="mt-3 space-y-2">
                    {report.improvementSuggestions.missingEvidenceRecommendations.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#F59E0B]" aria-hidden="true" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">Quantification Improvements</p>
                  <ul className="mt-3 space-y-2">
                    {report.improvementSuggestions.quantificationImprovements.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#EF4444]" aria-hidden="true" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="audit"
          title="Audit Trail"
          description="Chronological record of analysis and export actions."
          icon={<ClipboardList size={18} aria-hidden="true" />}
        >
          <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
            <div className="space-y-3">
              {report.auditTrail.map((e, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-[#FFFFFF]" style={{ border: `1px solid ${BRAND.border}` }}>
                      <span className="text-[#2563EB]">{iconForAudit(e.icon)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D0C22]">{e.title}</p>
                      <p className="mt-1 text-sm text-[#6E6D7A]">{e.detail}</p>
                    </div>
                  </div>
                  <p className="whitespace-nowrap text-sm text-[#6E6D7A]">{formatDate(e.timestamp)}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="compliance"
          title="Compliance Notes"
          description="Evidence summary and review readiness status."
          icon={<ShieldCheck size={18} aria-hidden="true" />}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Decision Evidence</p>
              <ul className="mt-3 space-y-2">
                {report.complianceNotes.decisionEvidence.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#6E6D7A]">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-sm font-semibold text-[#0D0C22]">Review Readiness</p>
              <div className="mt-3 space-y-3">
                <span
                  className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
                  style={{
                    background:
                      report.complianceNotes.auditReadiness === "PASS"
                        ? "rgba(34, 197, 94, 0.10)"
                        : report.complianceNotes.auditReadiness === "NEEDS_REVIEW"
                          ? "rgba(245, 158, 11, 0.10)"
                          : "rgba(239, 68, 68, 0.10)",
                    color:
                      report.complianceNotes.auditReadiness === "PASS"
                        ? BRAND.success
                        : report.complianceNotes.auditReadiness === "NEEDS_REVIEW"
                          ? BRAND.warning
                          : BRAND.danger,
                    borderColor:
                      report.complianceNotes.auditReadiness === "PASS"
                        ? "rgba(34, 197, 94, 0.25)"
                        : report.complianceNotes.auditReadiness === "NEEDS_REVIEW"
                          ? "rgba(245, 158, 11, 0.25)"
                          : "rgba(239, 68, 68, 0.25)",
                  }}
                >
                  {readiness.label}
                </span>

                <p className="text-sm text-[#6E6D7A]">{report.complianceNotes.humanReviewNote}</p>

                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Responsible AI</p>
                <p className="text-sm font-semibold text-[#0D0C22]">{report.complianceNotes.responsibleAiStatus}</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

    </div>
  );
}

