"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, ShieldX, ShieldCheck } from "lucide-react";

type Severity = "Low" | "Moderate" | "Elevated" | "High";

type BiasSeverityScoreProps = {
  score: number; // 0..100
  label?: string;
  description?: string;
  className?: string;
};

const BRAND = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  background: "#FFFFFF",
  secondaryBackground: "#F6F8FB",
  text: "#0D0C22",
  mutedText: "#6E6D7A",
  border: "#E7E7E9",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function severityFromScore(score: number): { severity: Severity; tone: "success" | "warning" | "danger"; accent: string } {
  const s = clamp(score, 0, 100);
  if (s < 25) return { severity: "Low", tone: "success", accent: BRAND.success };
  if (s < 50) return { severity: "Moderate", tone: "warning", accent: BRAND.warning };
  if (s < 75) return { severity: "Elevated", tone: "warning", accent: BRAND.warning };
  return { severity: "High", tone: "danger", accent: BRAND.danger };
}

function explanationForSeverity(severity: Severity) {
  switch (severity) {
    case "Low":
      return "Fairness risk appears limited. Focus on maintaining current guardrails and monitoring drift.";
    case "Moderate":
      return "Some fairness gaps may exist. Consider targeted mitigations and additional validation by group.";
    case "Elevated":
      return "Higher likelihood of bias-driven impact. Prioritize mitigation, review features, and adjust thresholds.";
    case "High":
      return "Significant bias risk detected. Review training data, candidate-group coverage, and apply immediate mitigation.";
    default:
      return "";
  }
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const styles =
    severity === "Low"
      ? { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: BRAND.success }
      : severity === "Moderate"
        ? { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning }
        : severity === "Elevated"
          ? { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning }
          : { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger };

  return (
    <span
      className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
      style={{ background: styles.bg, borderColor: styles.bd, color: styles.fg }}
    >
      {severity}
    </span>
  );
}

function Gauge({ score, accent }: { score: number; accent: string }) {
  const s = clamp(score, 0, 100);
  const pct = s / 100;

  // Semi-circle gauge
  const w = 280;
  const h = 160;
  const cx = w / 2;
  const cy = 150;
  const r = 110;
  const circumference = Math.PI * r;
  const dash = circumference * pct;
  const dashGap = circumference - dash;

  return (
    <div className="relative mx-auto w-[280px] max-w-full">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Bias severity score ${s.toFixed(0)} out of 100`}>
        <defs>
          <linearGradient id="biasGaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor={BRAND.primary} stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="rgba(231,231,233,1)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* progress */}
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="url(#biasGaugeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          initial={false}
          animate={{
            strokeDasharray: `${dash} ${dashGap}`,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />

        {/* labels */}
        <text x={cx} y={h - 18} textAnchor="middle" fill={BRAND.mutedText} fontSize="12" fontWeight={600}>
          0
        </text>
        <text x={cx} y={h - 18} textAnchor="middle" fill={BRAND.mutedText} fontSize="12" fontWeight={600}>
          
        </text>

        <text x={cx} y={h - 18} textAnchor="middle" fill={BRAND.mutedText} fontSize="12" fontWeight={600}>
          
        </text>

        {/* top-ish severity ticks */}
        <text x={cx - r + 10} y={cy - 10} textAnchor="start" fill={BRAND.mutedText} fontSize="11" fontWeight={600}>
          Low
        </text>
        <text x={cx} y={cy - 36} textAnchor="middle" fill={BRAND.mutedText} fontSize="11" fontWeight={600}>
          Mod/Ele
        </text>
        <text x={cx + r - 10} y={cy - 10} textAnchor="end" fill={BRAND.mutedText} fontSize="11" fontWeight={600}>
          High
        </text>
      </svg>

      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
        <div className="text-center">
          <div className="text-4xl font-semibold tracking-[-0.04em] text-[#0D0C22]">{s.toFixed(0)}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Score</div>
        </div>
      </div>
    </div>
  );
}

function RiskIcon({ tone }: { tone: "success" | "warning" | "danger" }) {
  if (tone === "success") return <CheckCircle2 size={18} className="text-[#22C55E]" aria-hidden="true" />;
  if (tone === "warning") return <Info size={18} className="text-[#F59E0B]" aria-hidden="true" />;
  return <ShieldX size={18} className="text-[#EF4444]" aria-hidden="true" />;
}

export default function BiasSeverityScore({ score, label, description, className }: BiasSeverityScoreProps) {
  const safeScore = clamp(score, 0, 100);
  const { severity, tone, accent } = severityFromScore(safeScore);
  const expl = description ?? explanationForSeverity(severity);

  return (
    <div className={className}>
      <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Bias severity</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">{label ?? "Audit risk gauge"}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6E6D7A]">{expl}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <SeverityBadge severity={severity} />
              <span className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-xs font-semibold text-[#6E6D7A]">
                <RiskIcon tone={tone} />
                <span className="ml-2">Risk level</span>
              </span>
            </div>
          </div>

          <div className="lg:shrink-0">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={severity}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Gauge score={safeScore} accent={accent} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["Low", "Moderate", "Elevated", "High"].map((s) => {
            const sev = s as Severity;
            const active = sev === severity;
            const t = sev === "Low" ? BRAND.success : sev === "High" ? BRAND.danger : BRAND.warning;
            return (
              <div
                key={s}
                className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2"
                style={{
                  borderColor: active ? "rgba(37,99,235,0.25)" : BRAND.border,
                  background: active ? "rgba(37,99,235,0.06)" : "#F6F8FB",
                }}
                aria-label={`${s} threshold`}
              >
                <div className="text-xs font-semibold text-[#0D0C22]">{s}</div>
                <div className="mt-1 text-xs font-semibold" style={{ color: t }}>
                  {sev === "Low" ? "0–24" : sev === "Moderate" ? "25–49" : sev === "Elevated" ? "50–74" : "75–100"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]" aria-hidden="true">
              <ShieldCheck size={18} className="text-[#2563EB]" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0D0C22]">How to use this gauge</p>
              <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">
                Use the gauge to prioritize mitigation work. Combine it with metric-level explanations to decide what to fix first.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
