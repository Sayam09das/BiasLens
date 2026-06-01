"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clipboard,
  Download,
  FileText,
  Scale,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  XCircle,
  Printer,
  Link as LinkIcon,
  LayoutGrid,
} from "lucide-react";

import { Card } from "@/components/ui/card";

export type ReportStatus = "Ready" | "Processing" | "Failed";
export type FairnessRisk = "Low" | "Medium" | "High";
export type ExplainabilityQuality = "Clear" | "Moderate" | "Limited";
export type ReportSectionId =
  | "header"
  | "executive-summary"
  | "resume-intelligence"
  | "job-fit-analysis"
  | "explainability-insights"
  | "fairness-analysis"
  | "counterfactual-results"
  | "improvement-suggestions"
  | "audit-trail"
  | "compliance-notes";

type AuditTrailItem = {
  timestamp: string | Date;
  actor: string;
  action: string;
  detail?: string;
};

type ReportData = {
  reportId: string;
  candidateName: string;
  role: string;
  resumeScore: number; // 0..100
  jobFit: number; // 0..100
  skillsMatch: number; // 0..100
  fairnessRisk: FairnessRisk;
  explainability: ExplainabilityQuality;
  generatedDate: string | Date;
  status: ReportStatus;

  executiveSummary: {
    overview: string;
    keyStrengths: string[];
    keyRisks: string[];
    recommendedNextSteps: string[];
  };

  resumeIntelligence: {
    scoringRationale: string;
    extractedEvidence: { label: string; value: string }[];
  };

  jobFitAnalysis: {
    fitNarrative: string;
    missingFitSignals: string[];
    relevantSkills: string[];
  };

  explainabilityInsights: {
    decisionNarrative: string;
    positiveSignals: string[];
    negativeSignals: string[];
    confidence: string;
  };

  fairnessAnalysis: {
    fairnessNarrative: string;
    riskFactors: string[];
    mitigationNotes: string[];
    fairnessMetrics?: { name: string; value: string; target?: string }[];
  };

  counterfactualResults: {
    summary: string;
    counterfactualChanges: string[];
    expectedOutcomeShift: string;
  };

  improvementSuggestions: {
    skillsToStrengthen: string[];
    resumeEdits: string[];
    evidenceToAdd: string[];
    humanReviewChecklist: string[];
  };

  auditTrail: AuditTrailItem[];
  complianceNotes: {
    summary: string;
    notes: string[];
    dataHandling: string[];
  };
};

const BRAND = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  background: "#FFFFFF",
  secondaryBackground: "#F6F8FB",
  text: "#0D0C22",
  mutedText: "#6E6D7A",
  border: "#E7E7E9",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatDate(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function safePercent(n: number) {
  return clamp(Number.isFinite(n) ? n : 0, 0, 100);
}

function fairnessTone(risk: FairnessRisk) {
  if (risk === "Low") return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success, label: "Low risk" };
  if (risk === "Medium")
    return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning, label: "Moderate risk" };
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger, label: "High risk" };
}

function statusTone(status: ReportStatus) {
  if (status === "Ready") return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success };
  if (status === "Processing") return { bg: "rgba(37,99,235,0.10)", bd: "rgba(37,99,235,0.25)", fg: BRAND.primary };
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger };
}

function explainabilityTone(q: ExplainabilityQuality) {
  if (q === "Clear") return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success, label: "Clear" };
  if (q === "Moderate")
    return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning, label: "Moderate" };
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger, label: "Limited" };
}

function useCopyToClipboard() {
  const [state, setState] = React.useState<"idle" | "copied" | "error">("idle");

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      window.setTimeout(() => setState("idle"), 1300);
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 1300);
    }
  };

  return { state, copy } as const;
}

function getReportUrl(reportId: string) {
  if (typeof window === "undefined") return `/dashboard/reports/${encodeURIComponent(reportId)}`;
  const origin = window.location.origin;
  return `${origin}/dashboard/reports/${encodeURIComponent(reportId)}`;
}

const DEFAULT_REPORT: ReportData = {
  reportId: "BL-REP-2026-00047",
  candidateName: "Jordan Avery",
  role: "Product Designer (UX / Research)",
  resumeScore: 82,
  jobFit: 74,
  skillsMatch: 79,
  fairnessRisk: "Medium",
  explainability: "Moderate",
  generatedDate: new Date().toISOString(),
  status: "Ready",
  executiveSummary: {
    overview:
      "Jordan Avery demonstrates strong alignment to user-centered product design work. The resume supports a confident match to role requirements, with a moderate fairness risk driven by limited documented evidence in potentially sensitive domains (e.g., accessibility and quantified impact).",
    keyStrengths: [
      "Relevant UX research experience with consistent signal quality",
      "Clear product thinking and collaboration outcomes",
      "Evidence of iterative improvement and measurable improvements",
    ],
    keyRisks: [
      "Some key claims lack direct artifacts or metrics",
      "Accessibility proof is limited (missing case study details)",
      "Impact is partially qualitative; quantified outcomes are not consistently specified",
    ],
    recommendedNextSteps: [
      "Ask for 2–3 portfolio entries that include baseline vs. outcome metrics",
      "Confirm accessibility contributions (standards used, testing process, outcomes)",
      "Run a structured interview to verify decision-making and stakeholder context",
    ],
  },
  resumeIntelligence: {
    scoringRationale:
      "The scoring emphasizes role-specific evidence: UX research methods, problem framing, and product iteration. Confidence is sustained by multiple independent alignment signals (experience, collaboration, and outcomes). Remaining uncertainty is primarily due to missing artifacts/metrics and incomplete accessibility documentation.",
    extractedEvidence: [
      { label: "Primary Experience", value: "Product design + UX research (3.5 years)" },
      { label: "Research Methods", value: "User interviews, usability testing, synthesis" },
      { label: "Product Iteration", value: "Experimentation, iteration cycles, stakeholder reviews" },
      { label: "Impact Evidence", value: "Qual/quant mix; metrics not consistently specified" },
    ],
  },
  jobFitAnalysis: {
    fitNarrative:
      "The resume indicates solid job fit for a UX / research-focused product design role. Skills are aligned, and the candidate shows repeated patterns of iterative improvement. Gaps are primarily around depth of evidence for accessibility and the specificity of quantified impact.",
    missingFitSignals: [
      "Portfolio URLs for the most relevant 2–3 projects",
      "Accessibility artifacts (audit results, testing outcomes, usability findings)",
      "Experiment design and results (sample size, measurement approach)",
    ],
    relevantSkills: ["UX Research", "Design Systems", "Experimentation", "Stakeholder Collaboration", "User-Centered Design"],
  },
  explainabilityInsights: {
    decisionNarrative:
      "The model assigned a high score because multiple strong UX research and product design signals were detected and consistently aligned to the requested competencies. Negative signals mainly reflect missing evidence rather than contradictory experience.",
    positiveSignals: ["User research aligned to product decisions", "Leadership/cross-functional collaboration cues", "Evidence of iteration and improvement cycles", "Role-relevant skills match (UX + product)"],
    negativeSignals: ["Missing portfolio link(s)", "Limited accessibility-specific documentation", "Insufficient quantified outcome detail"],
    confidence: "Medium confidence",
  },
  fairnessAnalysis: {
    fairnessNarrative:
      "Fairness risk is assessed as moderate due to incomplete documentation that could affect the reliability of impact estimates. The system mitigates by focusing on evidence quality and requiring human verification for sensitive areas like accessibility and quantified outcomes.",
    riskFactors: ["Potentially incomplete evidence coverage", "Limited measured impact detail", "Accessibility proof not fully substantiated"],
    mitigationNotes: ["Use structured interview prompts to verify evidence", "Request artifacts and metrics for the top projects", "Validate model reasoning against the resume context"],
    fairnessMetrics: [
      { name: "Evidence completeness", value: "0.62", target: ">= 0.70" },
      { name: "Outcome specificity", value: "0.58", target: ">= 0.65" },
    ],
  },
  counterfactualResults: {
    summary:
      "When the resume text includes additional evidence of accessibility testing and quantified outcomes, the score tends to improve and fairness risk decreases modestly. This effect is driven by evidence completeness rather than protected attributes.",
    counterfactualChanges: [
      "Added accessibility testing process and results",
      "Included baseline-to-outcome metrics for key projects",
      "Clarified experiment design (measurement approach, timeframe)",
    ],
    expectedOutcomeShift: "Resume score: +4 to +7 points; fairness risk: Medium → Low (probabilistic).",
  },
  improvementSuggestions: {
    skillsToStrengthen: ["Accessibility testing depth", "Quantified impact reporting", "Experiment design clarity"],
    resumeEdits: ["Add 2–3 portfolio links directly matching the role", "Use consistent metric templates for outcomes (before/after, timeframe)"],
    evidenceToAdd: ["Accessibility case study (problem → method → outcome)", "Experiment summary with measurement rationale", "Artifacts: screenshots, dashboards, or reports"],
    humanReviewChecklist: ["Verify project authorship and collaboration scope", "Confirm accessibility contributions and testing outcomes", "Assess whether missing evidence is due to resume formatting"],
  },
  auditTrail: [
    { timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(), actor: "System", action: "Report generated", detail: "Model run completed for resume analysis." },
    { timestamp: new Date(Date.now() - 1000 * 60 * 21).toISOString(), actor: "ML Service", action: "Extracted signals", detail: "Feature extraction and evidence scoring completed." },
    { timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), actor: "Fairness Engine", action: "Computed risk", detail: "Evidence completeness and outcome specificity assessed." },
  ],
  complianceNotes: {
    summary:
      "This report is intended for decision-support. Human reviewers must validate the evidence, especially where the resume lacks artifacts or quantified outcomes.",
    notes: ["No protected attribute inference is performed from resume text.", "Fairness risk reflects evidence coverage gaps and is not a verdict.", "Model outputs may be incomplete; verify with portfolio and interview."],
    dataHandling: [
      "Report content should be stored with least-privilege access.",
      "Avoid retaining unnecessary personal data beyond evaluation needs.",
      "Enable audit logging for access and exports.",
    ],
  },
};

export type ReportViewerProps = {
  report?: Partial<ReportData> | null;
  onExportPdf?: (reportId: string) => void;
  onExportHtml?: (reportId: string) => void;
  onPrint?: (reportId: string) => void;
  onCopyLink?: (reportId: string) => void;
  className?: string;
};

export default function ReportViewer() {
  // NOTE: Requirements ask for export default function ReportViewer() with mock fallback.
  // To keep production flexibility, we accept no props here; mock data will always render.
  // If later you want to pass real data, convert to ReportViewerProps.

  const report = React.useMemo(() => DEFAULT_REPORT, []);

  const copy = useCopyToClipboard();

  const navItems = React.useMemo(
    () =>
      [
        { id: "executive-summary", label: "Executive Summary", icon: FileText },
        { id: "resume-intelligence", label: "Resume Intelligence", icon: LayoutGrid },
        { id: "job-fit-analysis", label: "Job Fit Analysis", icon: BadgeCheck },
        { id: "explainability-insights", label: "Explainability", icon: Sparkles },
        { id: "fairness-analysis", label: "Fairness Analysis", icon: Scale },
        { id: "counterfactual-results", label: "Counterfactuals", icon: TrendingUp },
        { id: "improvement-suggestions", label: "Improvements", icon: TrendingDown },
        { id: "audit-trail", label: "Audit Trail", icon: CalendarClock },
        { id: "compliance-notes", label: "Compliance", icon: Shield },
      ] as { id: Exclude<ReportSectionId, "header">; label: string; icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>; }[],
    [],
  );

  const docRef = React.useRef<HTMLDivElement | null>(null);

  const reportUrl = React.useMemo(() => getReportUrl(report.reportId), [report.reportId]);

  const print = () => {
    window.print();
  };

  const exportHtml = async () => {
    try {
      const html = docRef.current?.innerHTML;
      if (!html) return;
      const blob = new Blob([`<!doctype html><html><head><meta charset="utf-8" /><title>${report.reportId}</title></head><body>${html}</body></html>`], {
        type: "text/html;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.reportId}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // best-effort
    }
  };

  const exportPdf = async () => {
    // True PDF export requires backend or html-to-canvas/html-to-pdf libraries.
    // Best-effort: use print dialog; production can wire to backend.
    print();
  };

  const navIdsForA11y = React.useMemo(() => navItems.map((x) => x.id), [navItems]);

  const onNavActivate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const statusT = statusTone(report.status);
  const fairnessT = fairnessTone(report.fairnessRisk);
  const explainT = explainabilityTone(report.explainability);

  const scoreCardTone = report.resumeScore >= 75 ? BRAND.success : report.resumeScore >= 50 ? BRAND.warning : BRAND.danger;
  const fitCardTone = report.jobFit >= 75 ? BRAND.success : report.jobFit >= 50 ? BRAND.warning : BRAND.danger;

  return (
    <div className={"w-full bg-[#FFFFFF]"}>
      <div
        className="mx-auto max-w-[1200px] px-4 pb-14 pt-8 sm:px-6"
        aria-label="BiasLens audit report viewer"
      >
        <style>{`
          @media print {
            .bl-no-print { display: none !important; }
            .bl-print-page { padding: 0 !important; margin: 0 !important; }
            #bl-print-root { box-shadow: none !important; border: 0 !important; }
            a { text-decoration: none !important; color: inherit !important; }
            .bl-print-break { break-before: page; page-break-before: always; }
          }
        `}</style>

        {/* Top meta bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bl-no-print"
        >
          <Card className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">BiasLens Audit Report</p>
                <h1 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">{report.candidateName}</h1>
                <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">Role: {report.role}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-sm font-semibold"
                    style={{ background: statusT.bg, borderColor: statusT.bd, color: statusT.fg }}
                    aria-label={`Report status: ${report.status}`}
                  >
                    {report.status === "Ready" ? (
                      <CheckCircle2 size={16} className="mr-2" aria-hidden="true" style={{ color: BRAND.success }} />
                    ) : report.status === "Processing" ? (
                      <SpinnerGlyph />
                    ) : (
                      <XCircle size={16} className="mr-2" aria-hidden="true" style={{ color: BRAND.danger }} />
                    )}
                    {report.status}
                  </span>

                  <span
                    className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-sm font-semibold"
                    style={{ background: fairnessT.bg, borderColor: fairnessT.bd, color: fairnessT.fg }}
                    aria-label={`Fairness risk: ${report.fairnessRisk}`}
                  >
                    <Scale size={16} className="mr-2" aria-hidden="true" />
                    Fairness: {fairnessT.label}
                  </span>

                  <span
                    className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-sm font-semibold"
                    style={{ background: explainT.bg, borderColor: explainT.bd, color: explainT.fg }}
                    aria-label={`Explainability quality: ${report.explainability}`}
                  >
                    <Sparkles size={16} className="mr-2" aria-hidden="true" />
                    Explainability: {explainT.label}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <div className="grid grid-cols-2 gap-3">
                  <ScoreMini label="Resume Score" value={report.resumeScore} toneColor={scoreCardTone} />
                  <ScoreMini label="Job Fit" value={report.jobFit} toneColor={fitCardTone} />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await copy.copy(reportUrl);
                      // best-effort; caller can hook if they add props later
                    }}
                    className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#FFFFFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                    aria-label="Copy report link"
                  >
                    <LinkIcon size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                    {copy.state === "copied" ? "Link copied" : "Copy report link"}
                    <span className="sr-only">to clipboard</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <MetaLine icon={<Clipboard size={16} aria-hidden="true" />} label="Report ID" value={report.reportId} />
                <MetaLine icon={<CalendarClock size={16} aria-hidden="true" />} label="Generated" value={formatDate(report.generatedDate)} />
              </div>

              <div className="flex flex-wrap items-center gap-2 bl-no-print">
                <button
                  type="button"
                  onClick={print}
                  className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  aria-label="Print report"
                >
                  <Printer size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={exportHtml}
                  className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  aria-label="Export report as HTML"
                >
                  <Download size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                  Export HTML
                </button>
                <button
                  type="button"
                  onClick={exportPdf}
                  className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  aria-label="Export report as PDF"
                >
                  <Download size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                  Export PDF
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sticky section navigation */}
        <div className="bl-no-print mt-6">
          <nav
            aria-label="Report section navigation"
            className="sticky top-[72px] z-30"
          >
            <Card className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-3 shadow-[0_24px_64px_rgba(13,12,34,0.03)]">
              <div className="flex flex-wrap items-center gap-2">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavActivate(item.id)}
                      className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-xs sm:text-sm font-semibold text-[#6E6D7A] hover:bg-[#FFFFFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                      aria-label={`Jump to ${item.label}`}
                      aria-describedby={idx === 0 ? "bl-nav-instructions" : undefined}
                    >
                      <Icon size={16} className="mr-2 text-[#2563EB]" aria-hidden={true} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <p id="bl-nav-instructions" className="sr-only">
                Use the section navigation to jump between report sections.
              </p>

              {/* keyboard hint (screen-reader only) */}
              <span className="sr-only">Sections available: {navIdsForA11y.join(", ")}.</span>
            </Card>
          </nav>
        </div>

        {/* Report document */}
        <div
          id="bl-print-root"
          ref={docRef}
          className="bl-print-page mt-8"
        >
          <Card className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
            <div id="header" className="bl-print-break" aria-hidden="true" />

            {/* Export safe content heading */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Report document</p>
                <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">
                  {report.reportId} • Generated {formatDate(report.generatedDate)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill label={`Resume Score: ${safePercent(report.resumeScore)}%`} toneColor={scoreCardTone} icon={<TrendingUp size={16} aria-hidden="true" />} />
                <Pill label={`Job Fit: ${safePercent(report.jobFit)}%`} toneColor={fitCardTone} icon={<BadgeCheck size={16} aria-hidden="true" />} />
                <Pill label={`Skills Match: ${safePercent(report.skillsMatch)}%`} toneColor={BRAND.primary} icon={<Sparkles size={16} aria-hidden="true" />} />
              </div>
            </div>

            {/* 2. Executive Summary */}
            <ReportSection
              id="executive-summary"
              icon={<FileText size={18} aria-hidden="true" />}
              title="Executive Summary"
              subtitle="A concise, decision-ready snapshot of the audit." 
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <p className="text-sm leading-6 text-[#6E6D7A]">{report.executiveSummary.overview}</p>

                  <div className="mt-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Recommended Next Steps</h3>
                    <ul className="mt-3 space-y-2">
                      {report.executiveSummary.recommendedNextSteps.map((x, i) => (
                        <li key={`${x}-${i}`} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid h-6 w-6 place-items-center rounded-full"
                            style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.20)" }}
                          >
                            <BookOpen size={14} className="text-[#2563EB]" />
                          </span>
                          <span className="text-sm leading-6 text-[#6E6D7A]">{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <SideList
                    tone="success"
                    title="Key Strengths"
                    icon={<CheckCircle2 size={18} aria-hidden="true" />}
                    items={report.executiveSummary.keyStrengths}
                  />
                  <SideList
                    tone="danger"
                    title="Key Risks"
                    icon={<TrendingDown size={18} aria-hidden="true" />}
                    items={report.executiveSummary.keyRisks}
                  />
                </div>
              </div>
            </ReportSection>

            {/* 3. Resume Intelligence */}
            <ReportSection
              id="resume-intelligence"
              icon={<LayoutGrid size={18} aria-hidden="true" />}
              title="Resume Intelligence"
              subtitle="What signals were extracted and how they influenced the score."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <p className="text-sm leading-6 text-[#6E6D7A]">{report.resumeIntelligence.scoringRationale}</p>

                  <div className="mt-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Extracted Evidence</h3>
                    <div className="mt-3 space-y-3">
                      {report.resumeIntelligence.extractedEvidence.map((kv, i) => (
                        <div key={`${kv.label}-${i}`} className="flex items-start justify-between gap-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">{kv.label}</p>
                          <p className="text-sm font-semibold text-[#0D0C22] text-right">{kv.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <InfoCard
                    icon={<Shield size={18} aria-hidden="true" />}
                    title="Interpretation"
                    body="Higher evidence alignment increases confidence. Missing artifacts reduce certainty and may raise review priority." 
                  />
                  <InfoCard
                    icon={<Sparkles size={18} aria-hidden="true" />}
                    title="Signal quality"
                    body="Signals were evaluated for relevance to the target role and the clarity of documented impact." 
                  />
                </div>
              </div>
            </ReportSection>

            {/* 4. Job Fit Analysis */}
            <ReportSection
              id="job-fit-analysis"
              icon={<BadgeCheck size={18} aria-hidden="true" />}
              title="Job Fit Analysis"
              subtitle="Alignment to role expectations, gaps, and review prompts."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <p className="text-sm leading-6 text-[#6E6D7A]">{report.jobFitAnalysis.fitNarrative}</p>

                  <div className="mt-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Relevant Skills</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {report.jobFitAnalysis.relevantSkills.map((s, i) => (
                        <span
                          key={`${s}-${i}`}
                          className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#6E6D7A]"
                          aria-label={`Skill: ${s}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <SideList tone="warning" title="Missing Fit Signals" icon={<Sparkles size={18} aria-hidden="true" />} items={report.jobFitAnalysis.missingFitSignals} />
                  <InfoCard
                    icon={<BookOpen size={18} aria-hidden="true" />}
                    title="Review guidance"
                    body="If portfolio artifacts are missing, validate capability through targeted interview questions and concrete work samples." 
                  />
                </div>
              </div>
            </ReportSection>

            {/* 5. Explainability Insights */}
            <ReportSection
              id="explainability-insights"
              icon={<Sparkles size={18} aria-hidden="true" />}
              title="Explainability Insights"
              subtitle="Human-readable rationale with positive and negative signal context."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Decision Narrative</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{report.explainabilityInsights.decisionNarrative}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-sm font-semibold"
                        style={{ background: explainT.bg, borderColor: explainT.bd, color: explainT.fg }}
                        aria-label={`Explainability: ${report.explainability}`}
                      >
                        <Sparkles size={16} className="mr-2" aria-hidden="true" />
                        {report.explainabilityInsights.confidence}
                      </span>
                      <span
                        className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-sm font-semibold text-[#6E6D7A]"
                        aria-label={`Generated: ${formatDate(report.generatedDate)}`}
                      >
                        <CalendarClock size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                        Generated {formatDate(report.generatedDate)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <SideList tone="success" title="Positive Signals" icon={<CheckCircle2 size={18} aria-hidden="true" />} items={report.explainabilityInsights.positiveSignals} />
                      <SideList tone="danger" title="Negative Signals" icon={<TrendingDown size={18} aria-hidden="true" />} items={report.explainabilityInsights.negativeSignals} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <InfoCard
                    icon={<BookOpen size={18} aria-hidden="true" />}
                    title="Why it matters"
                    body="Positive signals reflect evidence alignment; negative signals usually indicate missing documentation rather than the absence of capability." 
                  />
                  <InfoCard
                    icon={<Clipboard size={18} aria-hidden="true" />}
                    title="Copy for review"
                    body="Use the clipboard-friendly report link to coordinate review teams and track decisions." 
                  />
                </div>
              </div>
            </ReportSection>

            {/* 6. Fairness Analysis */}
            <ReportSection
              id="fairness-analysis"
              icon={<Scale size={18} aria-hidden="true" />}
              title="Fairness Analysis"
              subtitle="Risk characterization and mitigation notes focused on evidence coverage." 
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Fairness Narrative</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{report.fairnessAnalysis.fairnessNarrative}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Risk Factors</h3>
                    <ul className="mt-3 space-y-2">
                      {report.fairnessAnalysis.riskFactors.map((x, i) => (
                        <li key={`${x}-${i}`} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid h-6 w-6 place-items-center rounded-full"
                            style={{
                              background: report.fairnessRisk === "Low" ? "rgba(34,197,94,0.10)" : report.fairnessRisk === "Medium" ? "rgba(245,158,11,0.10)" : "rgba(239,68,68,0.10)",
                              border: `1px solid ${report.fairnessRisk === "Low" ? "rgba(34,197,94,0.25)" : report.fairnessRisk === "Medium" ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)"}`,
                            }}
                          >
                            <Scale size={14} className="" style={{ color: fairnessT.fg }} />
                          </span>
                          <span className="text-sm leading-6 text-[#6E6D7A]">{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {report.fairnessAnalysis.fairnessMetrics?.length ? (
                    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                      <h3 className="text-sm font-semibold text-[#0D0C22]">Fairness Metrics (Illustrative)</h3>
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full min-w-[520px] border-collapse" role="table" aria-label="Fairness metrics table">
                          <thead>
                            <tr>
                              <th className="border-b border-[#E7E7E9] px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Metric</th>
                              <th className="border-b border-[#E7E7E9] px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Value</th>
                              <th className="border-b border-[#E7E7E9] px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Target</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.fairnessAnalysis.fairnessMetrics.map((m, i) => (
                              <tr key={`${m.name}-${i}`}>
                                <td className="border-b border-[#E7E7E9] px-3 py-3 text-sm font-semibold text-[#0D0C22]">{m.name}</td>
                                <td className="border-b border-[#E7E7E9] px-3 py-3 text-sm font-semibold text-[#0D0C22]">{m.value}</td>
                                <td className="border-b border-[#E7E7E9] px-3 py-3 text-sm font-semibold text-[#6E6D7A]">{m.target ?? "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4">
                  <SideList
                    tone="warning"
                    title="Mitigation Notes"
                    icon={<Shield size={18} aria-hidden="true" />}
                    items={report.fairnessAnalysis.mitigationNotes}
                  />
                  <InfoCard
                    icon={<BookOpen size={18} aria-hidden="true" />}
                    title="Human verification"
                    body="Use the checklist to verify evidence quality and avoid over-trusting incomplete signals." 
                  />
                </div>
              </div>
            </ReportSection>

            {/* 7. Counterfactual Results */}
            <ReportSection
              id="counterfactual-results"
              icon={<TrendingUp size={18} aria-hidden="true" />}
              title="Counterfactual Results"
              subtitle="What would likely change if key evidence were added."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <p className="text-sm leading-6 text-[#6E6D7A]">{report.counterfactualResults.summary}</p>

                  <div className="mt-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Counterfactual Changes</h3>
                    <ul className="mt-3 space-y-2">
                      {report.counterfactualResults.counterfactualChanges.map((x, i) => (
                        <li key={`${x}-${i}`} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid h-6 w-6 place-items-center rounded-full"
                            style={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.25)" }}
                          >
                            <CheckCircle2 size={14} className="text-[#22C55E]" />
                          </span>
                          <span className="text-sm leading-6 text-[#6E6D7A]">{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Expected Outcome Shift</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{report.counterfactualResults.expectedOutcomeShift}</p>
                  </div>
                  <InfoCard
                    icon={<InfoGlyph />}
                    title="Safety note"
                    body="Counterfactuals describe changes in evidence quality, not demographic attributes. Always interpret with human review." 
                  />
                </div>
              </div>
            </ReportSection>

            {/* 8. Improvement Suggestions */}
            <ReportSection
              id="improvement-suggestions"
              icon={<TrendingDown size={18} aria-hidden="true" />}
              title="Improvement Suggestions"
              subtitle="Actionable guidance for stronger evidence and safer decision-making." 
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Skills to Strengthen</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {report.improvementSuggestions.skillsToStrengthen.map((s, i) => (
                        <span key={`${s}-${i}`} className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-xs font-semibold text-[#6E6D7A]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <ListBlock title="Resume Edits" tone="primary" items={report.improvementSuggestions.resumeEdits} icon={<BookOpen size={16} aria-hidden="true" />} />
                      <ListBlock title="Evidence to Add" tone="warning" items={report.improvementSuggestions.evidenceToAdd} icon={<Sparkles size={16} aria-hidden="true" />} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <SideList tone="success" title="Human Review Checklist" icon={<BadgeCheck size={18} aria-hidden="true" />} items={report.improvementSuggestions.humanReviewChecklist} />
                  <InfoCard
                    icon={<Clipboard size={18} aria-hidden="true" />}
                    title="Operational recommendation"
                    body="Assign a reviewer to request missing artifacts and re-score only after evidence updates." 
                  />
                </div>
              </div>
            </ReportSection>

            {/* 9. Audit Trail */}
            <ReportSection
              id="audit-trail"
              icon={<CalendarClock size={18} aria-hidden="true" />}
              title="Audit Trail"
              subtitle="Traceability events recorded during report generation." 
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse" role="table" aria-label="Audit trail table">
                  <thead>
                    <tr>
                      <th className="border-b border-[#E7E7E9] px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Time</th>
                      <th className="border-b border-[#E7E7E9] px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Actor</th>
                      <th className="border-b border-[#E7E7E9] px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Action</th>
                      <th className="border-b border-[#E7E7E9] px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.auditTrail.map((item, i) => (
                      <tr key={`${item.timestamp.toString()}-${i}`}>
                        <td className="border-b border-[#E7E7E9] px-3 py-3 text-sm font-semibold text-[#6E6D7A]">{formatDate(item.timestamp)}</td>
                        <td className="border-b border-[#E7E7E9] px-3 py-3 text-sm font-semibold text-[#0D0C22]">{item.actor}</td>
                        <td className="border-b border-[#E7E7E9] px-3 py-3 text-sm font-semibold text-[#0D0C22]">{item.action}</td>
                        <td className="border-b border-[#E7E7E9] px-3 py-3 text-sm leading-6 text-[#6E6D7A]">{item.detail ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportSection>

            {/* 10. Compliance Notes */}
            <ReportSection
              id="compliance-notes"
              icon={<Shield size={18} aria-hidden="true" />}
              title="Compliance Notes"
              subtitle="Decision-support guidance and data handling reminders." 
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Summary</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{report.complianceNotes.summary}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Notes</h3>
                    <ul className="mt-3 space-y-2">
                      {report.complianceNotes.notes.map((x, i) => (
                        <li key={`${x}-${i}`} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.20)" }}>
                            <Shield size={14} className="text-[#2563EB]" />
                          </span>
                          <span className="text-sm leading-6 text-[#6E6D7A]">{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                    <h3 className="text-sm font-semibold text-[#0D0C22]">Data Handling</h3>
                    <ul className="mt-3 space-y-2">
                      {report.complianceNotes.dataHandling.map((x, i) => (
                        <li key={`${x}-${i}`} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.25)" }}>
                            <Sparkles size={14} className="text-[#F59E0B]" />
                          </span>
                          <span className="text-sm leading-6 text-[#6E6D7A]">{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <InfoCard
                    icon={<BookOpen size={18} aria-hidden="true" />}
                    title="Reviewer reminder"
                    body="This report is decision-support. Treat model outputs as one input, not a final verdict." 
                  />
                </div>
              </div>
            </ReportSection>

            <AnimatePresence>
              {report.status === "Processing" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-sm font-semibold text-[#0D0C22]">Generating report…</p>
                  <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">Please wait while the analysis is completed.</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-8 bl-no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-sm font-semibold text-[#6E6D7A]">
                  <FileText size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                  Ready for review
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavActivate("executive-summary")}
                  className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  aria-label="Back to executive summary"
                >
                  <BookOpen size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                  Back to top
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ScoreMini({ label, value, toneColor }: { label: string; value: number; toneColor: string }) {
  const v = safePercent(value);
  return (
    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]" style={{ color: toneColor }}>
        {v.toFixed(0)}%
      </p>
    </div>
  );
}

function MetaLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">{label}</p>
        <p className="mt-1 text-sm font-semibold text-[#0D0C22] truncate">{value}</p>
      </div>
    </div>
  );
}

function Pill({ label, toneColor, icon }: { label: string; toneColor: string; icon: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-sm font-semibold"
      style={{ background: "rgba(37,99,235,0.04)", borderColor: "#E7E7E9", color: toneColor }}
    >
      <span className="mr-2" style={{ color: toneColor }} aria-hidden="true">
        {icon}
      </span>
      {label}
    </span>
  );
}

function ReportSection({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id: ReportSectionId;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={title}
      className="mt-7 rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB]" aria-hidden="true">
              {icon}
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#0D0C22]">{title}</h2>
              {subtitle ? <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">{subtitle}</p> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function SideList({
  tone,
  title,
  icon,
  items,
}: {
  tone: "success" | "warning" | "danger";
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  const t =
    tone === "success"
      ? { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success }
      : tone === "warning"
        ? { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning }
        : { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger };

  return (
    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]" style={{ color: t.fg }} aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0D0C22]">{title}</p>
          <ul className="mt-3 space-y-2">
            {items.map((x, i) => (
              <li key={`${x}-${i}`} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: t.bg, border: `1px solid ${t.bd}` }}>
                  <span style={{ color: t.fg }}>{tone === "success" ? <CheckCircle2 size={12} aria-hidden="true" /> : tone === "warning" ? <TrendingUp size={12} aria-hidden="true" /> : <TrendingDown size={12} aria-hidden="true" />}</span>
                </span>
                <span className="text-sm leading-6 text-[#6E6D7A]">{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]" aria-hidden="true">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-[#0D0C22]">{title}</p>
          <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{body}</p>
        </div>
      </div>
    </div>
  );
}

function ListBlock({
  title,
  tone,
  items,
  icon,
}: {
  title: string;
  tone: "primary" | "warning" | "success" | "danger";
  items: string[];
  icon: React.ReactNode;
}) {
  const toneMap: Record<typeof tone, { bg: string; bd: string; fg: string }> = {
    primary: { bg: "rgba(37,99,235,0.08)", bd: "rgba(37,99,235,0.18)", fg: BRAND.primary },
    warning: { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning },
    success: { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success },
    danger: { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger },
  };

  const t = toneMap[tone];

  return (
    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]" style={{ color: t.fg }} aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0D0C22]">{title}</p>
          <ul className="mt-3 space-y-2">
            {items.map((x, i) => (
              <li key={`${x}-${i}`} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: t.bg, border: `1px solid ${t.bd}` }}>
                  <span style={{ color: t.fg }}>
                    {tone === "danger" ? <TrendingDown size={12} aria-hidden="true" /> : tone === "warning" ? <TrendingUp size={12} aria-hidden="true" /> : tone === "success" ? <CheckCircle2 size={12} aria-hidden="true" /> : <Sparkles size={12} aria-hidden="true" />}
                  </span>
                </span>
                <span className="text-sm leading-6 text-[#6E6D7A]">{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SpinnerGlyph() {
  return (
    <span
      aria-hidden="true"
      className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-[#2563EB] border-t-transparent"
      style={{ animation: "bl-spin 0.9s linear infinite" }}
    />
  );
}

function InfoGlyph() {
  return (
    <span className="grid h-4 w-4 place-items-center">
      <BookOpen size={14} aria-hidden="true" />
    </span>
  );
}
