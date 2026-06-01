"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  ShieldCheck,
  ShieldX,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type CounterfactualExample = {
  originalSignal: string;
  counterfactualSignal: string;
  originalScorePct: number; // 0..100
  counterfactualScorePct: number; // 0..100
  interpretation: string;
};

type Stability = "stable" | "slightly_sensitive" | "sensitive";

type StabilityIndicator = {
  key: Stability;
  label: string;
  tone: "success" | "warning" | "danger";
};

type CounterfactualViewProps = {
  examples?: CounterfactualExample[] | null;
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

function formatDeltaPct(delta: number) {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}%`;
}

function stabilityFromDelta(deltaPct: number): StabilityIndicator {
  // deltaPct is already in percentage points (0..100 scale); treat magnitude.
  const abs = Math.abs(deltaPct);
  if (abs <= 1.5) {
    return { key: "stable", label: "Stable recommendation", tone: "success" };
  }
  if (abs <= 4.0) {
    return {
      key: "slightly_sensitive",
      label: "Low sensitivity detected",
      tone: "warning",
    };
  }
  return { key: "sensitive", label: "High sensitivity detected", tone: "danger" };
}

function toneBadge(tone: StabilityIndicator["tone"]) {
  if (tone === "success") {
    return {
      bg: "rgba(34,197,94,0.10)",
      bd: "rgba(34,197,94,0.25)",
      fg: BRAND.success,
      label: "Stable",
    };
  }
  if (tone === "warning") {
    return {
      bg: "rgba(245,158,11,0.10)",
      bd: "rgba(245,158,11,0.25)",
      fg: BRAND.warning,
      label: "Caution",
    };
  }
  return {
    bg: "rgba(239,68,68,0.10)",
    bd: "rgba(239,68,68,0.25)",
    fg: BRAND.danger,
    label: "Risk",
  };
}

function DeltaBadge({ deltaPct }: { deltaPct: number }) {
  const deltaSign = deltaPct >= 0 ? "up" : "down";
  const tone = Math.abs(deltaPct) <= 1.5 ? "success" : Math.abs(deltaPct) <= 4 ? "warning" : "danger";
  const styles = toneBadge(tone);
  const Icon = deltaSign === "up" ? TrendingUp : TrendingDown;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-[1rem] border px-3 py-1 text-xs font-semibold"
      style={{ background: styles.bg, color: styles.fg, borderColor: styles.bd }}
      aria-label={`Score change ${formatDeltaPct(deltaPct)}`}
    >
      <Icon size={14} aria-hidden="true" />
      {formatDeltaPct(deltaPct)}
    </span>
  );
}

function ExampleCard({ example, index }: { example: CounterfactualExample; index: number }) {
  const deltaPct = example.counterfactualScorePct - example.originalScorePct;
  const stability = stabilityFromDelta(deltaPct);

  const stabilityIcon =
    stability.tone === "success" ? (
      <CheckCircle2 size={16} aria-hidden="true" />
    ) : stability.tone === "warning" ? (
      <Info size={16} aria-hidden="true" />
    ) : (
      <AlertCircle size={16} aria-hidden="true" />
    );

  const severityTextColor = stability.tone === "success" ? BRAND.success : stability.tone === "warning" ? BRAND.warning : BRAND.danger;
  const severityBg = stability.tone === "success" ? "rgba(34,197,94,0.10)" : stability.tone === "warning" ? "rgba(245,158,11,0.10)" : "rgba(239,68,68,0.10)";
  const severityBd = stability.tone === "success" ? "rgba(34,197,94,0.25)" : stability.tone === "warning" ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, delay: index * 0.03 }}
      className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 sm:p-6"
      role="article"
      aria-label="Counterfactual example"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]"
              aria-hidden="true"
            >
              <Sparkles size={18} className="text-[#2563EB]" />
            </span>
            <p className="text-sm font-semibold text-[#0D0C22]">Counterfactual scenario</p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">Original</p>
              <p className="mt-2 text-sm font-semibold text-[#0D0C22] leading-5">{example.originalSignal}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-semibold text-[#6E6D7A]">Score</span>
                <span className="rounded-[1rem] border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                  {clamp(example.originalScorePct, 0, 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">Counterfactual</p>
              <p className="mt-2 text-sm font-semibold text-[#0D0C22] leading-5">{example.counterfactualSignal}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-semibold text-[#6E6D7A]">Score</span>
                <span className="rounded-[1rem] border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                  {clamp(example.counterfactualScorePct, 0, 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <DeltaBadge deltaPct={deltaPct} />

          <div
            className="flex items-center gap-2 rounded-[1.25rem] border px-4 py-3"
            style={{ background: severityBg, borderColor: severityBd, color: severityTextColor }}
          >
            <span aria-hidden="true">{stabilityIcon}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{stability.label}</p>
              <p className="mt-1 text-xs font-semibold" style={{ color: BRAND.mutedText }}>
                {Math.abs(deltaPct) <= 1.5
                  ? "Model output stays consistent after the counterfactual change."
                  : Math.abs(deltaPct) <= 4
                    ? "Output shifts modestly—recommendation may change for some candidates."
                    : "Output shifts strongly—recommendation is sensitive to this attribute change."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
        <div className="flex items-start gap-3">
          <span
            className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]"
            aria-hidden="true"
          >
            {stability.tone === "success" ? (
              <ShieldCheck size={18} className="text-[#22C55E]" />
            ) : stability.tone === "warning" ? (
              <ShieldX size={18} className="text-[#F59E0B]" />
            ) : (
              <ShieldX size={18} className="text-[#EF4444]" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#0D0C22]">Fairness interpretation</p>
            <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">{example.interpretation}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const defaultExamples: CounterfactualExample[] = [
  {
    originalSignal: "Graduated from Tier-3 college",
    counterfactualSignal: "Graduated from Tier-1 college",
    originalScorePct: 52.4,
    counterfactualScorePct: 55.6,
    interpretation: "Low sensitivity detected. The recommendation remains mostly stable after the attribute change.",
  },
  {
    originalSignal: "Located in a higher-risk region",
    counterfactualSignal: "Located in a lower-risk region",
    originalScorePct: 47.8,
    counterfactualScorePct: 50.9,
    interpretation: "Moderate sensitivity detected. Some fairness mitigation may be needed for geographic signals.",
  },
];

export default function CounterfactualView({ examples, className }: CounterfactualViewProps) {
  const data = React.useMemo(() => examples && examples.length ? examples : defaultExamples, [examples]);
  return (
    <div className={className}>
      <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Counterfactual view</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">Resume signal robustness</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
              See how fairness-related signals change outcomes when we rewrite them into a controlled counterfactual.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm font-semibold text-[#6E6D7A]">
              <Info size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
              Before/After comparison
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <AnimatePresence initial={false} mode="popLayout">
            {data.map((ex, idx) => (
              <ExampleCard key={`${ex.originalSignal}-${idx}`} example={ex} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]" aria-hidden="true">
              <ChevronRight size={18} className="text-[#2563EB]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">What to look for</p>
              <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">
                Smaller score deltas indicate the model is less sensitive to attribute rewrites, which generally suggests improved fairness stability.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

