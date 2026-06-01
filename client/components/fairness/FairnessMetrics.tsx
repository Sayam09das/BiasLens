"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  BadgeInfo,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Scale,
  ShieldCheck,
  ShieldX,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type Trend = "up" | "down" | "flat";

type RiskTone = "success" | "warning" | "danger" | "primary";

type FairnessMetricsValues = {
  demographicParityGap: number; // 0..1 (lower is better)
  equalizedOddsDifference: number; // 0..1 (lower is better)
  counterfactualConsistency: number; // 0..1 (higher is better)
  fairnessScore: number; // 0..100 (higher is better)
  biasRiskLevel: "Low" | "Medium" | "High";
  groupScoreVariance: number; // 0..1 (lower is better)
};

type MetricKey = keyof FairnessMetricsValues;

type MetricCard = {
  key: MetricKey;
  label: string;
  value: string;
  tooltip: string;
  tone: RiskTone;
  trend?: { dir: Trend; label: string };
  icon: React.ReactNode;
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

function formatPct01(n: number) {
  const v = clamp(n, 0, 1);
  return `${(v * 100).toFixed(1)}%`;
}

function format01(n: number) {
  const v = clamp(n, 0, 1);
  return v.toFixed(3);
}

function toneFromRisk(risk: FairnessMetricsValues["biasRiskLevel"]): RiskTone {
  if (risk === "Low") return "success";
  if (risk === "Medium") return "warning";
  return "danger";
}

function toneFromGap(gap: number): RiskTone {
  // Lower is better. Thresholds tuned for UI.
  const v = clamp(gap, 0, 1);
  if (v <= 0.08) return "success";
  if (v <= 0.18) return "warning";
  return "danger";
}

function toneFromVariance(v: number): RiskTone {
  const vv = clamp(v, 0, 1);
  if (vv <= 0.07) return "success";
  if (vv <= 0.16) return "warning";
  return "danger";
}

function toneFromCounterfactual(v: number): RiskTone {
  const vv = clamp(v, 0, 1);
  if (vv >= 0.82) return "success";
  if (vv >= 0.65) return "warning";
  return "danger";
}

function toneFromFairnessScore(score: number): RiskTone {
  const s = clamp(score, 0, 100);
  if (s >= 80) return "success";
  if (s >= 60) return "warning";
  return "danger";
}

function TrendBadge({ dir, label, tone }: { dir: Trend; label: string; tone: RiskTone }) {
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Circle;

  const style: Record<RiskTone, { bg: string; fg: string; bd: string }> = {
    success: { bg: "rgba(34,197,94,0.10)", fg: BRAND.success, bd: "rgba(34,197,94,0.25)" },
    warning: { bg: "rgba(245,158,11,0.10)", fg: BRAND.warning, bd: "rgba(245,158,11,0.25)" },
    danger: { bg: "rgba(239,68,68,0.10)", fg: BRAND.danger, bd: "rgba(239,68,68,0.25)" },
    primary: { bg: "rgba(37,99,235,0.10)", fg: BRAND.primary, bd: "rgba(37,99,235,0.25)" },
  };

  const s = style[tone];

  return (
    <span
      className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.fg, borderColor: s.bd }}
    >
      <Icon size={14} aria-hidden="true" />
      {label}
    </span>
  );
}

function MetricTooltip({ tooltip }: { tooltip: string }) {
  return (
    <span className="group relative inline-flex items-center" aria-label={tooltip}>
      <BadgeInfo size={14} className="text-[#2563EB]" aria-hidden="true" />
      <span
        className="pointer-events-none absolute left-1/2 top-full z-10 w-[260px] -translate-x-1/2 rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] p-3 opacity-0 shadow-[0_16px_48px_rgba(13,12,34,0.08)] transition-opacity group-hover:opacity-100 focus-within:opacity-100"
        role="tooltip"
      >
        <span className="block text-xs font-semibold text-[#0D0C22]">What this means</span>
        <span className="mt-1 block text-xs leading-5 text-[#6E6D7A]">{tooltip}</span>
      </span>
    </span>
  );
}

function MetricCardView({ metric }: { metric: MetricCard }) {
  const toneStyles: Record<RiskTone, { bg: string; fg: string; bd: string }> = {
    success: { bg: "rgba(34,197,94,0.10)", fg: BRAND.success, bd: "rgba(34,197,94,0.25)" },
    warning: { bg: "rgba(245,158,11,0.10)", fg: BRAND.warning, bd: "rgba(245,158,11,0.25)" },
    danger: { bg: "rgba(239,68,68,0.10)", fg: BRAND.danger, bd: "rgba(239,68,68,0.25)" },
    primary: { bg: "rgba(37,99,235,0.10)", fg: BRAND.primary, bd: "rgba(37,99,235,0.25)" },
  };

  const t = toneStyles[metric.tone];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4 sm:p-5"
      role="group"
      aria-label={metric.label}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]" aria-hidden="true">
              {metric.icon}
            </span>
            <p className="truncate text-sm font-semibold text-[#0D0C22]">{metric.label}</p>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <p className="text-2xl font-semibold tracking-[-0.02em] text-[#0D0C22]">{metric.value}</p>
            <MetricTooltip tooltip={metric.tooltip} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {metric.trend ? (
            <TrendBadge dir={metric.trend.dir} label={metric.trend.label} tone={metric.tone} />
          ) : null}
          <span
            className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-semibold"
            style={{ background: t.bg, color: t.fg, borderColor: t.bd }}
          >
            {metric.tone === "success"
              ? "Healthy"
              : metric.tone === "warning"
                ? "Caution"
                : metric.tone === "danger"
                  ? "Risk"
                  : "Info"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export type FairnessMetricsProps = {
  values?: Partial<FairnessMetricsValues> | null;
  trend?: Partial<Record<MetricKey, { dir: Trend; label: string }>> | null;
  className?: string;
};

export default function FairnessMetrics({ values, trend, className }: FairnessMetricsProps) {
  const fallback: FairnessMetricsValues = React.useMemo(
    () => ({
      demographicParityGap: 0.12,
      equalizedOddsDifference: 0.09,
      counterfactualConsistency: 0.74,
      fairnessScore: 63,
      biasRiskLevel: "Medium",
      groupScoreVariance: 0.11,
    }),
    [],
  );

  const merged: FairnessMetricsValues = React.useMemo(() => {
    const v = values ?? {};
    return {
      demographicParityGap: typeof v.demographicParityGap === "number" ? v.demographicParityGap : fallback.demographicParityGap,
      equalizedOddsDifference:
        typeof v.equalizedOddsDifference === "number" ? v.equalizedOddsDifference : fallback.equalizedOddsDifference,
      counterfactualConsistency:
        typeof v.counterfactualConsistency === "number" ? v.counterfactualConsistency : fallback.counterfactualConsistency,
      fairnessScore: typeof v.fairnessScore === "number" ? v.fairnessScore : fallback.fairnessScore,
      biasRiskLevel: v.biasRiskLevel ?? fallback.biasRiskLevel,
      groupScoreVariance: typeof v.groupScoreVariance === "number" ? v.groupScoreVariance : fallback.groupScoreVariance,
    };
  }, [values, fallback]);

  const derived = React.useMemo(() => {
    const dpTone = toneFromGap(merged.demographicParityGap);
    const eoTone = toneFromGap(merged.equalizedOddsDifference);
    const cfTone = toneFromCounterfactual(merged.counterfactualConsistency);
    const scoreTone = toneFromFairnessScore(merged.fairnessScore);
    const varTone = toneFromVariance(merged.groupScoreVariance);
    const riskTone = toneFromRisk(merged.biasRiskLevel);

    const cards: MetricCard[] = [
      {
        key: "demographicParityGap",
        label: "Demographic Parity Gap",
        value: formatPct01(merged.demographicParityGap),
        tooltip:
          "Measures difference in positive outcomes across demographic groups. Lower indicates more parity.",
        tone: dpTone,
        trend: trend?.demographicParityGap,
        icon: <Scale size={18} className="text-[#2563EB]" aria-hidden="true" />,
      },
      {
        key: "equalizedOddsDifference",
        label: "Equalized Odds Difference",
        value: formatPct01(merged.equalizedOddsDifference),
        tooltip:
          "Captures separation between groups for true/false positive rates. Lower is better.",
        tone: eoTone,
        trend: trend?.equalizedOddsDifference,
        icon: <ShieldCheck size={18} className="text-[#2563EB]" aria-hidden="true" />,
      },
      {
        key: "counterfactualConsistency",
        label: "Counterfactual Consistency",
        value: `${(clamp(merged.counterfactualConsistency, 0, 1) * 100).toFixed(1)}%`,
        tooltip:
          "How often the prediction remains consistent after counterfactual changes. Higher indicates robustness.",
        tone: cfTone,
        trend: trend?.counterfactualConsistency,
        icon: <Sparkles size={18} className="text-[#2563EB]" aria-hidden="true" />,
      },
      {
        key: "fairnessScore",
        label: "Fairness Score",
        value: `${clamp(merged.fairnessScore, 0, 100).toFixed(0)}`,
        tooltip:
          "Composite score reflecting overall fairness. Higher suggests fewer disparities.",
        tone: scoreTone,
        trend: trend?.fairnessScore,
        icon: <BadgeInfo size={18} className="text-[#2563EB]" aria-hidden="true" />,
      },
      {
        key: "biasRiskLevel",
        label: "Bias Risk Level",
        value: merged.biasRiskLevel,
        tooltip:
          "High-level classification derived from fairness metrics. Use it to prioritize mitigation.",
        tone: riskTone,
        trend: trend?.biasRiskLevel,
        icon:
          merged.biasRiskLevel === "Low" ? (
            <CheckCircle2 size={18} className="text-[#22C55E]" aria-hidden="true" />
          ) : merged.biasRiskLevel === "Medium" ? (
            <TriangleAlert size={18} className="text-[#F59E0B]" aria-hidden="true" />
          ) : (
            <AlertCircle size={18} className="text-[#EF4444]" aria-hidden="true" />
          ),
      } as MetricCard,
      {
        key: "groupScoreVariance",
        label: "Group Score Variance",
        value: format01(merged.groupScoreVariance),
        tooltip:
          "Variance in model scores across groups. Lower variance indicates more consistent performance.",
        tone: varTone,
        trend: trend?.groupScoreVariance,
        icon: <Clock size={18} className="text-[#2563EB]" aria-hidden="true" />,
      },
    ];

    return { cards };
  }, [merged, trend]);

  return (
    <div className={className}>
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Fairness metrics</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">Resume audit fairness snapshot</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
              Metric cards with risk color coding, tooltips, and trend indicators. Data is mock-friendly and fully responsive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm font-semibold text-[#6E6D7A]"
              aria-label={`Bias risk: ${merged.biasRiskLevel}`}
            >
              <ShieldX size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
              {merged.biasRiskLevel} bias risk
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {derived.cards.map((m) => (
            <MetricCardView key={m.key} metric={m} />
          ))}
        </div>

        <AnimatePresence>
          {/* subtle safety footnote */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-5 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4"
            role="note"
          >
            <div className="flex items-start gap-3">
              <span
                className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]"
                aria-hidden="true"
              >
                <ExternalLink size={18} className="text-[#2563EB]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Interpretation note</p>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  Lower parity/odds gaps and lower variance generally indicate fewer fairness disparities. Higher counterfactual consistency indicates greater robustness to counterfactual changes.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
