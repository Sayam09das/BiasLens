"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  Download,
  FileText,
  Link as LinkIcon,
  Shield,
  Sparkles,
  XCircle,
  Share2,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export type ReportStatus = "Ready" | "Processing" | "Failed";
export type FairnessRisk = "Low" | "Medium" | "High";
export type ExplainabilityQuality = "Clear" | "Moderate" | "Limited";

type PreviewReport = {
  reportId: string;
  candidateName: string;
  role: string;
  resumeScore: number;
  jobFit: number;
  fairnessRisk: FairnessRisk;
  explainability: ExplainabilityQuality;
  status: ReportStatus;
  generatedDate: string | Date;

  executiveSummary?: {
    overview: string;
    keyStrengths?: string[];
    keyRisks?: string[];
  };

  improvementSuggestions?: {
    resumeEdits?: string[];
    humanReviewChecklist?: string[];
  };

  auditTrail?: {
    timestamp: string | Date;
    actor: string;
    action: string;
  }[];
};

export type ReportPreviewProps = {
  open: boolean;
  onClose: () => void;
  report?: PreviewReport | null;
  onView?: (reportId: string) => void;
  onExport?: (format: "pdf") => Promise<void> | void;
  onShare?: (reportId: string) => void;
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

function safePercent(n: number) {
  return clamp(Number.isFinite(n) ? n : 0, 0, 100);
}

function formatDate(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function statusTone(status: ReportStatus) {
  if (status === "Ready") return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success };
  if (status === "Processing") return { bg: "rgba(37,99,235,0.10)", bd: "rgba(37,99,235,0.25)", fg: BRAND.primary };
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger };
}

function fairnessTone(risk: FairnessRisk) {
  if (risk === "Low") return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success, label: "Low risk" };
  if (risk === "Medium")
    return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning, label: "Moderate risk" };
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger, label: "High risk" };
}

function explainTone(q: ExplainabilityQuality) {
  if (q === "Clear") return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success, label: "Clear" };
  if (q === "Moderate")
    return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning, label: "Moderate" };
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger, label: "Limited" };
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function FocusTrap({ active, containerRef }: { active: boolean; containerRef: React.RefObject<HTMLDivElement | null> }) {
  React.useEffect(() => {
    if (!active) return;

    const el = containerRef.current;
    if (!el) return;

    const focusableQuery =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const getFocusable = () => Array.from(el.querySelectorAll<HTMLElement>(focusableQuery)).filter((n) => !n.hasAttribute("disabled"));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = getFocusable();
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (!activeEl || activeEl === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef]);

  return null;
}

export default function ReportPreview({ open, onClose, report, onView, onExport, onShare }: ReportPreviewProps) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const [exportBusy, setExportBusy] = React.useState(false);
  const [feedback, setFeedback] = React.useState<"idle" | "success" | "error">("idle");

  const r = report ?? null;

  const statusT = r ? statusTone(r.status) : statusTone("Processing");
  const fairnessT = r ? fairnessTone(r.fairnessRisk) : fairnessTone("Medium");
  const explainT = r ? explainTone(r.explainability) : explainTone("Moderate");

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    // Move focus into dialog.
    window.setTimeout(() => {
      const el = dialogRef.current;
      if (!el) return;
      const target = el.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      target?.focus();
    }, 0);
  }, [open]);

  const handleExportPdf = async () => {
    if (!r) return;
    if (exportBusy) return;

    setExportBusy(true);
    setFeedback("idle");

    try {
      if (onExport) await onExport("pdf");
      setFeedback("success");
      window.setTimeout(() => setFeedback("idle"), 2200);
    } catch {
      setFeedback("error");
      window.setTimeout(() => setFeedback("idle"), 2600);
    } finally {
      setExportBusy(false);
    }
  };

  if (!open) return null;

  const ariaTitleId = "bl-report-preview-title";
  const ariaDescId = "bl-report-preview-desc";

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onMouseDown={(e) => {
          // Click outside close
          if (e.target === e.currentTarget) onClose();
        }}
        aria-hidden="true"
      />

      <FocusTrap active={open} containerRef={dialogRef} />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaTitleId}
        aria-describedby={ariaDescId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className={cx(
          "absolute left-1/2 top-1/2 w-[min(920px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2",
          "rounded-[1.75rem] border border-[#E7E7E9] bg-[#FFFFFF] shadow-[0_24px_80px_rgba(13,12,34,0.20)]",
          "max-h-[calc(100vh-24px)]",
          "overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E7E7E9] p-5 sm:p-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Report Preview</p>
            <h2 id={ariaTitleId} className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#0D0C22] truncate">
              {r ? `${r.candidateName} — ${r.role}` : "Report preview"}
            </h2>
            <p id={ariaDescId} className="mt-1 text-sm leading-6 text-[#6E6D7A]">
              Review key metrics and audit readiness before opening the full report.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            aria-label="Close preview"
          >
            <XCircle size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(100vh-140px)] overflow-auto p-5 sm:p-6">
          {/* Meta */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-sm font-semibold"
                  style={{ background: statusT.bg, borderColor: statusT.bd, color: statusT.fg }}
                  aria-label={`Report status: ${r?.status ?? "Processing"}`}
                >
                  {r?.status === "Ready" ? (
                    <CheckCircle2 size={16} className="mr-2" aria-hidden="true" style={{ color: BRAND.success }} />
                  ) : r?.status === "Processing" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" style={{ color: BRAND.primary }} />
                  ) : (
                    <XCircle size={16} className="mr-2" aria-hidden="true" style={{ color: BRAND.danger }} />
                  )}
                  {r?.status ?? "Processing"}
                </span>

                <span
                  className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-sm font-semibold"
                  style={{ background: fairnessT.bg, borderColor: fairnessT.bd, color: fairnessT.fg }}
                  aria-label={`Fairness risk: ${r?.fairnessRisk ?? "Medium"}`}
                >
                  <Shield size={16} className="mr-2" aria-hidden="true" />
                  {fairnessT.label}
                </span>

                <span
                  className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-sm font-semibold"
                  style={{ background: explainT.bg, borderColor: explainT.bd, color: explainT.fg }}
                  aria-label={`Explainability: ${r?.explainability ?? "Moderate"}`}
                >
                  <Sparkles size={16} className="mr-2" aria-hidden="true" />
                  Explainability: {explainT.label}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MiniMetric label="Resume Score" value={r ? safePercent(r.resumeScore) : 0} tone={r && r.resumeScore >= 75 ? BRAND.success : r && r.resumeScore >= 50 ? BRAND.warning : BRAND.danger} />
                <MiniMetric label="Job Fit" value={r ? safePercent(r.jobFit) : 0} tone={r && r.jobFit >= 75 ? BRAND.success : r && r.jobFit >= 50 ? BRAND.warning : BRAND.danger} />
              </div>
            </div>

            <div className="w-full md:w-auto">
              <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]" aria-hidden="true">
                    <FileText size={18} className="text-[#2563EB]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Preview details</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0C22]">{r?.reportId ?? "—"}</p>
                    <p className="mt-1 text-sm font-semibold text-[#6E6D7A]">Generated {r ? formatDate(r.generatedDate) : "—"}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!r) return;
                        onView?.(r.reportId);
                      }}
                      className="inline-flex items-center rounded-xl border border-[rgba(37,99,235,0.45)] bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                      aria-label="View full report"
                      disabled={!r}
                    >
                      <ArrowRight size={16} className="mr-2" aria-hidden="true" />
                      View Full Report
                    </button>

                    <button
                      type="button"
                      onClick={handleExportPdf}
                      disabled={!r || exportBusy}
                      className="inline-flex items-center rounded-xl border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-60"
                      aria-label="Export PDF"
                    >
                      {exportBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" style={{ color: BRAND.primary }} /> : <Download size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />}
                      Export PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!r) return;
                        onShare?.(r.reportId);
                      }}
                      className="inline-flex items-center rounded-xl border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-60"
                      aria-label="Share report"
                      disabled={!r}
                    >
                      <Share2 size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                      Share
                    </button>
                  </div>

                  {feedback !== "idle" ? (
                    <div className="mt-3">
                      {feedback === "success" ? (
                        <div className="flex items-start gap-2 rounded-xl border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] px-3 py-2">
                          <CheckCircle2 size={16} aria-hidden="true" style={{ color: BRAND.success }} />
                          <p className="text-sm font-semibold text-[#0D0C22]">Export started successfully.</p>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 rounded-xl border border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.08)] px-3 py-2">
                          <AlertTriangle size={16} aria-hidden="true" style={{ color: BRAND.danger }} />
                          <p className="text-sm font-semibold text-[#0D0C22]">Export failed. Try again.</p>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {!onView ? (
                    <p className="mt-3 text-xs leading-5 text-[#6E6D7A]">
                      Tip: provide `onView`, `onExport`, and `onShare` callbacks to enable production workflows.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Preview sections */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <PreviewBlock
                icon={<FileText size={18} aria-hidden="true" className="text-[#2563EB]" />}
                title="Executive Summary"
                subtitle="Top narrative and strengths to guide the reviewer."
              >
                <p className="text-sm leading-6 text-[#6E6D7A]">{r?.executiveSummary?.overview ?? "No summary provided."}</p>
                <div className="mt-4 rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                  <h3 className="text-sm font-semibold text-[#0D0C22]">Top Strengths</h3>
                  <ul className="mt-3 space-y-2">
                    {(r?.executiveSummary?.keyStrengths?.length ? r?.executiveSummary?.keyStrengths : ["Evidence alignment is strong across role-relevant signals."]).map((s, i) => (
                      <li key={`${s}-${i}`} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.25)" }}>
                          <CheckCircle2 size={14} className="text-[#22C55E]" />
                        </span>
                        <span className="text-sm leading-6 text-[#6E6D7A]">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </PreviewBlock>

              <PreviewBlock
                icon={<Shield size={18} aria-hidden="true" className="text-[#2563EB]" />}
                title="Fairness Summary"
                subtitle="Risk characterization and what to verify."
              >
                <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Fairness risk</p>
                      <p className="mt-1 text-sm font-semibold text-[#0D0C22]">{fairnessT.label}</p>
                    </div>
                    <span
                      className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-sm font-semibold"
                      style={{ background: fairnessT.bg, borderColor: fairnessT.bd, color: fairnessT.fg }}
                    >
                      <Shield size={16} className="mr-2" aria-hidden="true" />
                      {r?.fairnessRisk ?? "Medium"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#6E6D7A]">
                    Reviewers should validate evidence quality. When documentation is incomplete, request artifacts (metrics, accessibility notes, and project descriptions) before making final decisions.
                  </p>
                </div>
              </PreviewBlock>
            </div>

            <div className="space-y-4">
              <PreviewBlock
                icon={<Sparkles size={18} aria-hidden="true" className="text-[#2563EB]" />}
                title="Improvement Suggestions"
                subtitle="High-impact edits to increase evidence clarity."
              >
                <ul className="mt-2 space-y-2">
                  {(r?.improvementSuggestions?.resumeEdits?.length ? r?.improvementSuggestions?.resumeEdits : ["Add portfolio links matching the top projects.", "Use baseline-to-outcome metrics for impact claims."]).slice(0, 3).map((x, i) => (
                    <li key={`${x}-${i}`} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.20)" }}>
                        <FileText size={14} className="text-[#2563EB]" />
                      </span>
                      <span className="text-sm leading-6 text-[#6E6D7A]">{x}</span>
                    </li>
                  ))}
                </ul>
              </PreviewBlock>

              <PreviewBlock
                icon={<CalendarClock size={18} aria-hidden="true" className="text-[#2563EB]" />}
                title="Audit Status"
                subtitle="Traceability events captured during report generation."
              >
                <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
                      <LinkIcon size={18} className="text-[#2563EB]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D0C22]">Status</p>
                      <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">
                        {r?.status === "Ready" ? "Audit data is ready for review." : r?.status === "Failed" ? "Audit generation failed." : "Audit generation in progress."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Recent events</div>
                  <ul className="mt-2 space-y-2">
                    {(r?.auditTrail?.length ? r.auditTrail : [{ timestamp: new Date().toISOString(), actor: "System", action: "Report preview opened" }]).slice(0, 2).map((it, i) => (
                      <li key={`${it.actor}-${it.action}-${i}`} className="flex items-start justify-between gap-3 border-t border-[#E7E7E9] pt-2">
                        <span className="text-sm font-semibold text-[#0D0C22]">{it.action}</span>
                        <span className="text-sm font-semibold text-[#6E6D7A]">{formatDate(it.timestamp)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </PreviewBlock>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
            <p className="text-sm font-semibold text-[#0D0C22]">Decision-support reminder</p>
            <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">
              Model outputs are one input. Validate evidence quality, request missing artifacts, and confirm job relevance with structured interviews.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[#E7E7E9] p-4 sm:p-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-xl border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            aria-label="Close modal"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A]">
              <CalendarClock size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
              Generated {r ? formatDate(r.generatedDate) : "—"}
            </span>

            <button
              type="button"
              onClick={() => {
                if (!r) return;
                onView?.(r.reportId);
              }}
              disabled={!r}
              className="inline-flex items-center rounded-xl border border-[rgba(37,99,235,0.45)] bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-60"
              aria-label="View full report"
            >
              <FileText size={16} className="mr-2" aria-hidden="true" />
              View full report
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MiniMetric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]" style={{ color: tone }}>
        {safePercent(value).toFixed(0)}%
      </p>
    </div>
  );
}

function PreviewBlock({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]" aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#0D0C22]">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">{subtitle}</p> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

