"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
  TrendingDown,
  TrendingUp,
  HelpCircle,
} from "lucide-react";

type FeatureCategory =
  | "Experience"
  | "Skills"
  | "Impact"
  | "Education"
  | "Leadership"
  | "Evidence"
  | "Quality";

type FeatureDelta = "positive" | "negative" | "neutral";

type FeatureImportanceDatum = {
  key: string;
  label: string;
  category: FeatureCategory;
  importancePct: number; // 0..100
  delta: FeatureDelta;
  helperText: string;
};

type FeatureImportanceProps = {
  features?: FeatureImportanceDatum[] | null;
  className?: string;
  title?: string;
  description?: string;
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

function toneForDelta(delta: FeatureDelta): { bg: string; bd: string; fg: string; icon: React.ReactNode } {
  if (delta === "positive") {
    return {
      bg: "rgba(34,197,94,0.10)",
      bd: "rgba(34,197,94,0.25)",
      fg: BRAND.success,
      icon: <CheckCircle2 size={14} aria-hidden="true" />,
    };
  }
  if (delta === "negative") {
    return {
      bg: "rgba(239,68,68,0.10)",
      bd: "rgba(239,68,68,0.25)",
      fg: BRAND.danger,
      icon: <AlertCircle size={14} aria-hidden="true" />,
    };
  }
  return {
    bg: "rgba(245,158,11,0.10)",
    bd: "rgba(245,158,11,0.25)",
    fg: BRAND.warning,
    icon: <Info size={14} aria-hidden="true" />,
  };
}

function DeltaPill({ delta }: { delta: FeatureDelta }) {
  const t = toneForDelta(delta);
  const text = delta === "positive" ? "Positive" : delta === "negative" ? "Negative" : "Neutral";
  return (
    <span
      className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-semibold"
      style={{ background: t.bg, borderColor: t.bd, color: t.fg }}
      aria-label={`Impact indicator: ${text}`}
    >
      <span className="mr-2" aria-hidden="true">{t.icon}</span>
      {text}
    </span>
  );
}

function CategoryBadge({ category }: { category: FeatureCategory }) {
  const map: Record<FeatureCategory, { bg: string; bd: string; fg: string }> = {
    Experience: { bg: "rgba(37,99,235,0.08)", bd: "rgba(37,99,235,0.18)", fg: BRAND.primary },
    Skills: { bg: "rgba(37,99,235,0.08)", bd: "rgba(37,99,235,0.18)", fg: BRAND.primary },
    Impact: { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.22)", fg: BRAND.success },
    Education: { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.22)", fg: BRAND.warning },
    Leadership: { bg: "rgba(37,99,235,0.08)", bd: "rgba(37,99,235,0.18)", fg: BRAND.primary },
    Evidence: { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.22)", fg: BRAND.danger },
    Quality: { bg: "rgba(37,99,235,0.08)", bd: "rgba(37,99,235,0.18)", fg: BRAND.primary },
  };

  const s = map[category];
  return (
    <span
      className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-semibold"
      style={{ background: s.bg, borderColor: s.bd, color: s.fg }}
      aria-label={`Category ${category}`}
    >
      {category}
    </span>
  );
}

function TooltipHelper({ helperText }: { helperText: string }) {
  return (
    <span className="group relative inline-flex">
      <HelpCircle size={16} className="text-[#2563EB]" aria-hidden="true" />
      <span
        className="pointer-events-none absolute left-1/2 top-full z-20 w-[260px] -translate-x-1/2 rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-3 opacity-0 shadow-[0_24px_64px_rgba(13,12,34,0.10)] transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        role="tooltip"
      >
        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">Why it matters</span>
        <span className="mt-1 block text-xs leading-5 text-[#6E6D7A]">{helperText}</span>
      </span>
    </span>
  );
}

export default function FeatureImportance({
  features,
  className,
  title,
  description,
}: FeatureImportanceProps) {
  const fallback: FeatureImportanceDatum[] = React.useMemo(
    () => [
      {
        key: "exp",
        label: "Relevant Experience",
        category: "Experience",
        importancePct: 28,
        delta: "positive",
        helperText: "Demonstrates directly transferable experience aligned to the role’s priorities.",
      },
      {
        key: "skills",
        label: "Skills Match",
        category: "Skills",
        importancePct: 24,
        delta: "positive",
        helperText: "High overlap between listed skills and the role’s required capabilities.",
      },
      {
        key: "projects",
        label: "Project Impact",
        category: "Impact",
        importancePct: 17,
        delta: "positive",
        helperText: "Shows outcomes, measurable improvements, and scope of impact.",
      },
      {
        key: "edu",
        label: "Education Alignment",
        category: "Education",
        importancePct: 12,
        delta: "neutral",
        helperText: "Supports baseline qualification but is less decisive than experience/impact.",
      },
      {
        key: "lead",
        label: "Leadership Signals",
        category: "Leadership",
        importancePct: 9,
        delta: "positive",
        helperText: "Indicates collaboration, ownership, or responsibility beyond individual tasks.",
      },
      {
        key: "evidence",
        label: "Missing Evidence",
        category: "Evidence",
        importancePct: 6,
        delta: "negative",
        helperText: "Key claims lack proof (metrics, artifacts, or concrete results).",
      },
      {
        key: "clarity",
        label: "Resume Clarity",
        category: "Quality",
        importancePct: 4,
        delta: "neutral",
        helperText: "Readability and structure improve signal extraction for evaluators.",
      },
    ],
    [],
  );

  const merged = React.useMemo(() => {
    const arr = (features ?? fallback) as FeatureImportanceDatum[];
    const safe = Array.isArray(arr) && arr.length ? arr : fallback;
    return [...safe].sort((a, b) => b.importancePct - a.importancePct);
  }, [features, fallback]);

  const maxPct = React.useMemo(() => {
    return Math.max(1, ...merged.map((f) => Math.abs(f.importancePct)));
  }, [merged]);

  const total = React.useMemo(() => merged.reduce((acc, f) => acc + clamp(f.importancePct, 0, 100), 0), [merged]);

  const positiveCount = merged.filter((f) => f.delta === "positive").length;
  const negativeCount = merged.filter((f) => f.delta === "negative").length;

  return (
    <div className={className}>
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Feature importance</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">{title ?? "Resume scoring signals"}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
              {description ?? "Ranked scoring signals with importance percentages, impact indicators, and accessible helper tooltips."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm font-semibold text-[#6E6D7A]"
              aria-label={`Positive signals: ${positiveCount}. Negative signals: ${negativeCount}. Total importance: ${total.toFixed(0)}%`}
            >
              <Sparkles size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
              {total.toFixed(0)}% total
            </span>

            {negativeCount ? (
              <span
                className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm font-semibold text-[#6E6D7A]"
                aria-label="There are negative signals"
              >
                <AlertCircle size={16} className="mr-2 text-[#EF4444]" aria-hidden="true" />
                {negativeCount} risk
              </span>
            ) : null}

            {!negativeCount ? (
              <span
                className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm font-semibold text-[#6E6D7A]"
                aria-label="No negative signals detected"
              >
                <CheckCircle2 size={16} className="mr-2 text-[#22C55E]" aria-hidden="true" />
                Stable signals
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {merged.map((f, idx) => {
            const pct = clamp(f.importancePct, 0, 100);
            const width = `${(pct / maxPct) * 100}%`;
            const tone = f.delta === "positive" ? BRAND.success : f.delta === "negative" ? BRAND.danger : BRAND.warning;
            const bg = f.delta === "positive" ? "rgba(34,197,94,0.10)" : f.delta === "negative" ? "rgba(239,68,68,0.10)" : "rgba(245,158,11,0.10)";
            const bd = f.delta === "positive" ? "rgba(34,197,94,0.25)" : f.delta === "negative" ? "rgba(239,68,68,0.25)" : "rgba(245,158,11,0.25)";

            return (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.02 }}
                className="rounded-4xl border border-[#E7E7E9] bg-[#F6F8FB] p-4"
                role="article"
                aria-label={`${f.label} importance ${pct.toFixed(0)} percent`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#0D0C22]">{idx + 1}. {f.label}</p>
                      <CategoryBadge category={f.category} />
                      <DeltaPill delta={f.delta} />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Importance</p>
                      <p className="text-sm font-semibold" style={{ color: tone }}>
                        {pct.toFixed(0)}%
                      </p>
                    </div>

                    <div className="mt-3 h-2 w-full rounded-full bg-[#E7E7E9]" aria-hidden="true">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ width, background: tone }}
                        initial={{ width: 0 }}
                        animate={{ width }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-3" style={{ borderColor: bd, background: bg }}>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5" aria-hidden="true">
                          {f.delta === "positive" ? (
                            <TrendingUp size={18} className="text-[#22C55E]" />
                          ) : f.delta === "negative" ? (
                            <TrendingDown size={18} className="text-[#EF4444]" />
                          ) : (
                            <Info size={18} className="text-[#F59E0B]" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Signal meaning</p>
                          <p className="mt-1 text-sm font-semibold text-[#0D0C22]">{f.helperText}</p>
                        </div>
                      </div>
                    </div>

                    <TooltipHelper helperText={f.helperText} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]" aria-hidden="true">
              <Sparkles size={18} className="text-[#2563EB]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">Interpretation</p>
              <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">
                Higher importance means the model relied on that signal more when generating the score. Use the category and impact indicator to decide what to strengthen.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
