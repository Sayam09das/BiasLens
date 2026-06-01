"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  MoreHorizontal,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";

export type ReportStatus = "Ready" | "Processing" | "Failed";
export type ReportType = "Resume Audit" | "Fairness" | "Explainability";

type ReportCardProps = {
  reportId: string;
  auditId: string;
  candidateName: string;
  role: string;
  resumeScore: number; // 0..100
  jobFit: number; // 0..100
  fairnessRisk: "Low" | "Medium" | "High";
  explainability: "Clear" | "Moderate" | "Limited";
  status: ReportStatus;
  createdAt: string | Date;
  reportType: ReportType;
  onExport?: (reportId: string) => void;
  onDelete?: (reportId: string) => void;
  onShare?: (reportId: string) => void;
  onRegenerate?: (reportId: string) => void;
  className?: string;
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

function fairnessBadgeTone(risk: ReportCardProps["fairnessRisk"]) {
  if (risk === "Low") return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success };
  if (risk === "Medium") return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning };
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger };
}

function statusBadge(status: ReportStatus) {
  if (status === "Ready") return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success };
  if (status === "Processing") return { bg: "rgba(37,99,235,0.10)", bd: "rgba(37,99,235,0.25)", fg: BRAND.primary };
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger };
}

function explainabilityTone(t: ReportCardProps["explainability"]) {
  if (t === "Clear") return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success };
  if (t === "Moderate") return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning };
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger };
}

function Badge({ label, tone, icon }: { label: string; tone: { bg: string; bd: string; fg: string }; icon?: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-[1.25rem] border px-3 py-1 text-xs font-semibold"
      style={{ background: tone.bg, borderColor: tone.bd, color: tone.fg }}
      aria-label={label}
    >
      {icon ? <span className="mr-2" aria-hidden="true">{icon}</span> : null}
      {label}
    </span>
  );
}

export default function ReportCard(props: ReportCardProps) {
  const {
    reportId,
    auditId,
    candidateName,
    role,
    resumeScore,
    jobFit,
    fairnessRisk,
    explainability,
    status,
    createdAt,
    reportType,
    onExport,
    onDelete,
    onShare,
    onRegenerate,
    className,
  } = props;

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [busy, setBusy] = React.useState<"idle" | "exporting" | "deleting" | "regenerating">("idle");

  const rt = statusBadge(status);
  const fairness = fairnessBadgeTone(fairnessRisk);
  const expl = explainabilityTone(explainability);

  const canExport = status === "Ready";

  const createdLabel = formatDate(createdAt);

  const exportLabel = busy === "exporting" ? "Downloading…" : "Download PDF";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className={className}
    >
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">{reportType}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#0D0C22] truncate">{candidateName}</h3>
              <p className="mt-1 text-sm text-[#6E6D7A] truncate">Role: {role}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Report ID: {reportId}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge label={status} tone={rt} icon={status === "Ready" ? <CheckCircle2 size={14} aria-hidden="true" /> : status === "Processing" ? <AlertCircle size={14} aria-hidden="true" /> : <AlertCircle size={14} aria-hidden="true" />} />
              <div className="flex items-center gap-2">
                <Badge label={`Fairness: ${fairnessRisk}`} tone={fairness} icon={<ShieldCheckIcon />} />
                <Badge label={`Explainability: ${explainability}`} tone={expl} icon={<SparklesIcon />} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ScoreRow label="Resume Score" value={clamp(resumeScore, 0, 100)} />
            <ScoreRow label="Job Fit" value={clamp(jobFit, 0, 100)} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Created</p>
              <p className="mt-1 text-sm font-semibold text-[#0D0C22]">{createdLabel}</p>
              <p className="mt-1 text-xs text-[#6E6D7A]">Audit ID: {auditId}</p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center justify-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#FFFFFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                aria-label="Open report actions"
                aria-expanded={menuOpen}
              >
                <MoreHorizontal size={18} className="mr-2" aria-hidden="true" />
                Actions
              </button>

              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-10 mt-3 w-[260px] rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-3 shadow-[0_24px_64px_rgba(13,12,34,0.12)]"
                    role="menu"
                    aria-label="Report actions menu"
                  >
                    <div className="space-y-2">
                      <Link
                        href={`/dashboard/reports/${reportId}`}
                        className="block rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        aria-label="View report"
                      >
                        <span className="inline-flex items-center">
                          <Eye size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                          View Report
                        </span>
                      </Link>

                      <button
                        type="button"
                        role="menuitem"
                        disabled={!canExport}
                        onClick={async () => {
                          setMenuOpen(false);
                          setBusy("exporting");
                          try {
                            await new Promise((r) => setTimeout(r, 900));
                            onExport?.(reportId);
                          } finally {
                            setBusy("idle");
                          }
                        }}
                        className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                        aria-label="Download PDF"
                      >
                        <span className="inline-flex items-center">
                          <Download size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                          {exportLabel}
                        </span>
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          onShare?.(reportId);
                        }}
                        className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                        aria-label="Share"
                      >
                        <span className="inline-flex items-center">
                          <Share2 size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                          Share
                        </span>
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        disabled={status === "Processing"}
                        onClick={async () => {
                          setMenuOpen(false);
                          setBusy("regenerating");
                          try {
                            await new Promise((r) => setTimeout(r, 950));
                            onRegenerate?.(reportId);
                          } finally {
                            setBusy("idle");
                          }
                        }}
                        className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                        aria-label="Regenerate"
                      >
                        <span className="inline-flex items-center">
                          <RefreshCcw size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                          {busy === "regenerating" ? "Regenerating…" : "Regenerate"}
                        </span>
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        disabled={status === "Processing"}
                        onClick={async () => {
                          setMenuOpen(false);
                          setBusy("deleting");
                          try {
                            await new Promise((r) => setTimeout(r, 700));
                            onDelete?.(reportId);
                          } finally {
                            setBusy("idle");
                          }
                        }}
                        className="w-full rounded-[1.25rem] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.08)] px-4 py-2 text-sm font-semibold text-[#EF4444] hover:bg-[rgba(239,68,68,0.12)] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                        aria-label="Delete report"
                      >
                        <span className="inline-flex items-center">
                          <Trash2 size={16} className="mr-2" aria-hidden="true" />
                          {busy === "deleting" ? "Deleting…" : "Delete"}
                        </span>
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-[#6E6D7A]">
                      Tip: actions are mocked unless callbacks are provided.
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const tone = value >= 75 ? "success" : value >= 50 ? "warning" : "danger";
  const t =
    tone === "success"
      ? { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success }
      : tone === "warning"
        ? { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning }
        : { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger };

  return (
    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#0D0C22]">{clamp(value, 0, 100).toFixed(0)}%</p>
        </div>
        <span className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-semibold" style={{ background: t.bg, borderColor: t.bd, color: t.fg }}>
          {tone === "success" ? "Strong" : tone === "warning" ? "Good" : "Needs review"}
        </span>
      </div>
    </div>
  );
}

function ShieldCheckIcon() {
  // Using inline SVG-like icon composition via lucide icons would increase coupling;
  // reuse CheckCircle2/Info icons already imported in this file.
  return <ShieldCheck size={14} aria-hidden="true" />;
}

function SparklesIcon() {
  return <Sparkles size={14} aria-hidden="true" />;
}
