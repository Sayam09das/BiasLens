"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
  ArrowRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type CounterfactualExample = {
  originalSignal:         string;
  counterfactualSignal:   string;
  originalScorePct:       number; // 0..100
  counterfactualScorePct: number; // 0..100
  interpretation:         string;
};

type Stability = "stable" | "slightly_sensitive" | "sensitive";

type StabilityIndicator = {
  key:   Stability;
  label: string;
  tone:  "success" | "warning" | "danger";
};

type CounterfactualViewProps = {
  examples?:  CounterfactualExample[] | null;
  className?: string;
};

/* ─────────────────────────────────────────────
   Design tokens
───────────────────────────────────────────── */
const T = {
  blue:    "#2563EB",
  success: "#22C55E",
  warning: "#F59E0B",
  danger:  "#EF4444",
  text:    "#0D0C22",
  muted:   "#6E6D7A",
  border:  "#E7E7E9",
  surface: "#FFFFFF",
  surface2:"#F6F8FB",
} as const;

/* ─────────────────────────────────────────────
   Framer Motion variants
───────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (d: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.44, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, y: -10, scale: 0.97,
    transition: { duration: 0.22 },
  },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -14 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 14 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

const barFill: Variants = {
  hidden: { scaleX: 0 },
  show: (w: number) => ({
    scaleX: w / 100,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function formatDeltaPct(delta: number) {
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
}

function stabilityFromDelta(deltaPct: number): StabilityIndicator {
  const abs = Math.abs(deltaPct);
  if (abs <= 1.5) return { key: "stable",            label: "Stable recommendation",    tone: "success" };
  if (abs <= 4.0) return { key: "slightly_sensitive", label: "Low sensitivity detected",  tone: "warning" };
  return               { key: "sensitive",           label: "High sensitivity detected", tone: "danger"  };
}

function toneStyles(tone: "success" | "warning" | "danger") {
  switch (tone) {
    case "success": return { bg: "rgba(34,197,94,0.10)",  bd: "rgba(34,197,94,0.25)",  fg: "#15803D", bar: T.success };
    case "warning": return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: "#92400E", bar: T.warning };
    case "danger":  return { bg: "rgba(239,68,68,0.10)",  bd: "rgba(239,68,68,0.25)",  fg: "#991B1B", bar: T.danger  };
  }
}

function stabilityDescription(stability: StabilityIndicator): string {
  switch (stability.key) {
    case "stable":
      return "Model output stays consistent after the counterfactual change.";
    case "slightly_sensitive":
      return "Output shifts modestly — recommendation may change for some candidates.";
    case "sensitive":
      return "Output shifts strongly — recommendation is sensitive to this attribute change.";
  }
}

/* ─────────────────────────────────────────────
   ScoreBar — animated progress bar
───────────────────────────────────────────── */
function ScoreBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const pct = clamp(value, 0, 100);
  return (
    <div
      className="relative h-2 w-full overflow-hidden rounded-full"
      style={{ background: T.border }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="absolute inset-y-0 left-0 h-full origin-left rounded-full"
        style={{ background: color, width: "100%" }}
        variants={barFill}
        custom={pct}
        initial="hidden"
        animate="show"
        transition={{ delay }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ScoreCard — original / counterfactual panel
───────────────────────────────────────────── */
function ScorePanel({
  tag,
  signal,
  scorePct,
  color,
  variants,
  delay,
}: {
  tag:      string;
  signal:   string;
  scorePct: number;
  color:    string;
  variants: Variants;
  delay:    number;
}) {
  const safe = clamp(scorePct, 0, 100);
  return (
    <motion.div
      variants={variants}
      className="flex flex-1 flex-col gap-3 rounded-2xl border p-4"
      style={{ borderColor: T.border, background: T.surface2 }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[.14em]"
        style={{ color: T.blue }}
      >
        {tag}
      </p>
      <p className="text-sm font-semibold leading-snug" style={{ color: T.text }}>
        {signal}
      </p>

      {/* Score row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold" style={{ color: T.muted }}>Score</span>
        <motion.span
          variants={popIn}
          className="rounded-full border px-2.5 py-0.5 text-xs font-bold"
          style={{ borderColor: T.border, background: T.surface, color: T.text }}
        >
          {safe.toFixed(1)}%
        </motion.span>
      </div>

      {/* Progress bar */}
      <ScoreBar value={safe} color={color} delay={delay} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   DeltaBadge
───────────────────────────────────────────── */
function DeltaBadge({ deltaPct }: { deltaPct: number }) {
  const abs  = Math.abs(deltaPct);
  const tone = abs <= 1.5 ? "success" : abs <= 4 ? "warning" : "danger";
  const sty  = toneStyles(tone);
  const Icon = deltaPct >= 0 ? TrendingUp : TrendingDown;

  return (
    <motion.span
      variants={popIn}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold"
      style={{ background: sty.bg, borderColor: sty.bd, color: sty.fg }}
      aria-label={`Score change: ${formatDeltaPct(deltaPct)}`}
    >
      <Icon size={13} aria-hidden="true" />
      {formatDeltaPct(deltaPct)}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   StabilityPanel
───────────────────────────────────────────── */
function StabilityPanel({ stability }: { stability: StabilityIndicator }) {
  const sty = toneStyles(stability.tone);
  const Icon =
    stability.tone === "success" ? CheckCircle2 :
    stability.tone === "warning" ? Info         : AlertCircle;
  const ShieldIcon =
    stability.tone === "success" ? ShieldCheck : ShieldX;

  return (
    <motion.div
      variants={cardIn}
      className="flex flex-col gap-2 rounded-2xl border p-3 sm:flex-row sm:items-start sm:gap-3"
      style={{ background: sty.bg, borderColor: sty.bd }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
        style={{ background: sty.bg, borderColor: sty.bd, color: sty.fg }}
        aria-hidden="true"
      >
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold" style={{ color: sty.fg }}>{stability.label}</p>
        <p className="mt-0.5 text-xs leading-relaxed" style={{ color: T.muted }}>
          {stabilityDescription(stability)}
        </p>
      </div>
      <motion.span
        whileHover={{ scale: 1.08, rotate: -4 }}
        transition={{ type: "spring", stiffness: 340, damping: 22 }}
        className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-xl border"
        style={{ background: T.surface, borderColor: T.border }}
        aria-hidden="true"
      >
        <ShieldIcon size={16} style={{ color: sty.fg }} />
      </motion.span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ExampleCard
───────────────────────────────────────────── */
function ExampleCard({
  example,
  index,
}: {
  example: CounterfactualExample;
  index:   number;
}) {
  const deltaPct  = example.counterfactualScorePct - example.originalScorePct;
  const stability = stabilityFromDelta(deltaPct);
  const origColor = T.blue;
  const cfColor   = toneStyles(stability.tone).bar;

  return (
    <motion.article
      variants={cardIn}
      layout
      initial="hidden"
      animate="show"
      exit="exit"
      custom={index}
      aria-label="Counterfactual example"
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: T.border, background: T.surface }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {/* ── Card header ── */}
      <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: T.border }}>
        <motion.span
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
          style={{ background: T.surface2, borderColor: T.border }}
          aria-hidden="true"
        >
          <Sparkles size={16} style={{ color: T.blue }} />
        </motion.span>
        <div className="flex flex-1 items-center justify-between gap-3 flex-wrap">
          <p className="text-sm font-semibold" style={{ color: T.text }}>
            Counterfactual scenario #{index + 1}
          </p>
          <DeltaBadge deltaPct={deltaPct} />
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="p-4 sm:p-5">

        {/* ── SECTION 1: Before / After score panels ── */}
        <motion.div
          className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <ScorePanel
            tag="Original"
            signal={example.originalSignal}
            scorePct={example.originalScorePct}
            color={origColor}
            variants={slideLeft}
            delay={0.15 + index * 0.04}
          />

          {/* Arrow connector */}
          <motion.div
            variants={popIn}
            className="flex shrink-0 items-center justify-center"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full border"
              style={{ background: T.surface2, borderColor: T.border }}
              aria-hidden="true"
            >
              <ArrowRight size={15} style={{ color: T.blue }} />
            </div>
          </motion.div>

          <ScorePanel
            tag="Counterfactual"
            signal={example.counterfactualSignal}
            scorePct={example.counterfactualScorePct}
            color={cfColor}
            variants={slideRight}
            delay={0.22 + index * 0.04}
          />
        </motion.div>

        {/* ── SECTION 2: Stability indicator ── */}
        <motion.div
          className="mt-3"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.12 + index * 0.04}
        >
          <StabilityPanel stability={stability} />
        </motion.div>

        {/* ── SECTION 3: Fairness interpretation ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.18 + index * 0.04}
          className="mt-3 rounded-2xl border p-4"
          style={{ borderColor: T.border, background: T.surface }}
        >
          <div className="flex items-start gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
              style={{ background: T.surface2, borderColor: T.border }}
              aria-hidden="true"
            >
              {stability.tone === "success"
                ? <ShieldCheck size={16} style={{ color: T.success }} />
                : <ShieldX     size={16} style={{ color: stability.tone === "warning" ? T.warning : T.danger }} />
              }
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[.14em]" style={{ color: T.muted }}>
                Fairness interpretation
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: T.text }}>
                {example.interpretation}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────
   Empty state
───────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={0.1}
      className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-12 text-center"
      style={{ borderColor: "#D0D5DD", background: T.surface2 }}
    >
      <motion.span
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl border"
        style={{ background: T.surface, borderColor: T.border }}
        aria-hidden="true"
      >
        <Sparkles size={22} style={{ color: T.blue }} />
      </motion.span>
      <div>
        <p className="text-sm font-semibold" style={{ color: T.text }}>No counterfactual examples yet</p>
        <p className="mt-1 text-xs" style={{ color: T.muted }}>
          Run an audit to generate controlled counterfactual comparisons.
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Root component
───────────────────────────────────────────── */
export default function CounterfactualView({
  examples,
  className,
}: CounterfactualViewProps) {
  const data = React.useMemo(() => examples ?? [], [examples]);

  return (
    <div className={className}>
      <Card className="overflow-hidden rounded-3xl border-[#E7E7E9] bg-white shadow-sm">

        {/* ── SECTION 1: HEADER ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6"
          style={{ borderColor: T.border }}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[.18em]" style={{ color: T.blue }}>
              Counterfactual view
            </p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl" style={{ color: T.text }}>
              Resume signal robustness
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: T.muted }}>
              See how fairness-related signals change outcomes when we rewrite them into a
              controlled counterfactual.
            </p>
          </div>

          {/* Header pill */}
          <motion.span
            variants={popIn}
            initial="hidden"
            animate="show"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border px-3 py-1.5 text-xs font-semibold"
            style={{ background: T.surface2, borderColor: T.border, color: T.muted }}
          >
            <Info size={14} aria-hidden="true" style={{ color: T.blue }} />
            Before / after comparison
          </motion.span>
        </motion.div>

        {/* ── SECTION 2: EXAMPLE CARDS LIST ── */}
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {data.length > 0 ? (
              <AnimatePresence mode="popLayout" initial={false}>
                {data.map((ex, idx) => (
                  <ExampleCard
                    key={`${ex.originalSignal}-${idx}`}
                    example={ex}
                    index={idx}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <EmptyState />
            )}
          </div>

          {/* ── SECTION 3: GUIDANCE FOOTER ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.22}
            className="mt-5 rounded-2xl border p-4"
            style={{ borderColor: T.border, background: T.surface2 }}
          >
            <div className="flex items-start gap-3">
              <motion.span
                whileHover={{ scale: 1.08, rotate: -4 }}
                transition={{ type: "spring", stiffness: 340, damping: 22 }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                style={{ background: T.surface, borderColor: T.border }}
                aria-hidden="true"
              >
                <ChevronRight size={16} style={{ color: T.blue }} />
              </motion.span>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: T.text }}>
                  What to look for
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: T.muted }}>
                  Smaller score deltas indicate the model is less sensitive to attribute
                  rewrites, which generally suggests improved fairness stability.
                </p>

                {/* Responsive quick-reference chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: "≤ 1.5% — Stable",         tone: "success" as const },
                    { label: "1.5–4% — Caution",         tone: "warning" as const },
                    { label: "> 4% — High sensitivity",  tone: "danger"  as const },
                  ].map(({ label, tone }) => {
                    const sty = toneStyles(tone);
                    return (
                      <motion.span
                        key={label}
                        whileHover={{ y: -1, transition: { duration: 0.14 } }}
                        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold"
                        style={{ background: sty.bg, borderColor: sty.bd, color: sty.fg }}
                      >
                        {label}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </Card>
    </div>
  );
}