"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle2, Info, ShieldX, ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type Severity = "Low" | "Moderate" | "Elevated" | "High";

type BiasSeverityScoreProps = {
  score:        number;   // 0..100
  label?:       string;
  description?: string;
  className?:   string;
};

/* ─────────────────────────────────────────────
   Design tokens
───────────────────────────────────────────── */
const TOKEN = {
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
    transition: { duration: 0.44, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const rowSlide: Variants = {
  hidden: { opacity: 0, x: -14 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const } },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function severityFromScore(score: number): {
  severity: Severity;
  tone:     "success" | "warning" | "danger";
  accent:   string;
  range:    string;
} {
  const s = clamp(score, 0, 100);
  if (s < 25) return { severity: "Low",      tone: "success", accent: TOKEN.success, range: "0–24"   };
  if (s < 50) return { severity: "Moderate", tone: "warning", accent: TOKEN.warning, range: "25–49"  };
  if (s < 75) return { severity: "Elevated", tone: "warning", accent: TOKEN.warning, range: "50–74"  };
  return              { severity: "High",     tone: "danger",  accent: TOKEN.danger,  range: "75–100" };
}

function explanationForSeverity(severity: Severity): string {
  switch (severity) {
    case "Low":      return "Fairness risk appears limited. Focus on maintaining current guardrails and monitoring drift.";
    case "Moderate": return "Some fairness gaps may exist. Consider targeted mitigations and additional validation by group.";
    case "Elevated": return "Higher likelihood of bias-driven impact. Prioritize mitigation, review features, and adjust thresholds.";
    case "High":     return "Significant bias risk detected. Review training data, candidate-group coverage, and apply immediate mitigation.";
  }
}

function severityStyles(severity: Severity) {
  switch (severity) {
    case "Low":
      return { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.25)", fg: "#15803D" };
    case "Moderate":
    case "Elevated":
      return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: "#92400E" };
    case "High":
      return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: "#991B1B" };
  }
}

function toneColor(tone: "success" | "warning" | "danger"): string {
  return tone === "success" ? TOKEN.success : tone === "warning" ? TOKEN.warning : TOKEN.danger;
}

/* ─────────────────────────────────────────────
   SeverityBadge
───────────────────────────────────────────── */
function SeverityBadge({ severity }: { severity: Severity }) {
  const sty = severityStyles(severity);
  return (
    <motion.span
      variants={popIn}
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold"
      style={{ background: sty.bg, borderColor: sty.bd, color: sty.fg }}
    >
      {severity}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   RiskIcon
───────────────────────────────────────────── */
function RiskIcon({ tone, size = 18 }: { tone: "success" | "warning" | "danger"; size?: number }) {
  if (tone === "success") return <CheckCircle2  size={size} aria-hidden="true" className="text-[#22C55E]" />;
  if (tone === "warning") return <Info          size={size} aria-hidden="true" className="text-[#F59E0B]" />;
  return                         <ShieldX       size={size} aria-hidden="true" className="text-[#EF4444]" />;
}

/* ─────────────────────────────────────────────
   AnimatedScore (count-up number)
───────────────────────────────────────────── */
function AnimatedScore({ value }: { value: number }) {
  const [displayed, setDisplayed] = React.useState(0);

  React.useEffect(() => {
    let start: number | null = null;
    const duration = 900;
    const from = 0;
    const to   = clamp(value, 0, 100);

    function step(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [value]);

  return <>{displayed}</>;
}

/* ─────────────────────────────────────────────
   Gauge (semi-circle SVG)
───────────────────────────────────────────── */
function Gauge({ score, accent }: { score: number; accent: string }) {
  const s   = clamp(score, 0, 100);
  const pct = s / 100;

  /* SVG geometry */
  const W  = 280;
  const H  = 158;
  const cx = W / 2;
  const cy = H - 8;           // baseline at bottom
  const R  = 108;
  const arc = Math.PI * R;    // semicircle circumference

  const dash    = arc * pct;
  const dashGap = arc - dash;

  /* Needle angle: -180deg (0%) → 0deg (100%) */
  const needleAngle = -180 + pct * 180;

  /* Severity zone fills (three arcs behind the progress) */
  const zones: { pct: number; color: string }[] = [
    { pct: 0.25, color: "rgba(34,197,94,0.18)"   },
    { pct: 0.50, color: "rgba(245,158,11,0.18)"  },
    { pct: 0.25, color: "rgba(239,68,68,0.18)"   },
  ];

  let zoneCursor = 0;

  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: W, maxWidth: "100%" }}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Bias severity score ${s} out of 100`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={accent}     stopOpacity="1" />
            <stop offset="100%" stopColor={TOKEN.blue}  stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Zone arcs (background colour segments) */}
        {zones.map(({ pct: zonePct, color }, i) => {
          const zStart = zoneCursor;
          zoneCursor  += zonePct;
          const zDash  = arc * zonePct;
          const offset = arc * zStart;
          return (
            <path
              key={i}
              d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
              fill="none"
              stroke={color}
              strokeWidth={14}
              strokeLinecap="butt"
              strokeDasharray={`${zDash} ${arc - zDash}`}
              strokeDashoffset={-offset}
            />
          );
        })}

        {/* Track */}
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke={TOKEN.border}
          strokeWidth={14}
          strokeLinecap="round"
          opacity={0.6}
        />

        {/* Progress arc */}
        <motion.path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={14}
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 999" }}
          animate={{ strokeDasharray: `${dash} ${dashGap}` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 }}
        />

        {/* Needle */}
        <motion.g
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
          initial={{ rotate: -180 }}
          animate={{ rotate: needleAngle }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 }}
        >
          <line
            x1={cx} y1={cy}
            x2={cx} y2={cy - R + 20}
            stroke={accent}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r={6} fill={accent} />
          <circle cx={cx} cy={cy} r={3} fill={TOKEN.surface} />
        </motion.g>

        {/* Zone labels */}
        <text x={cx - R + 4} y={cy - 14} textAnchor="start" fill={TOKEN.muted} fontSize={10} fontWeight={600}>Low</text>
        <text x={cx}         y={cy - R + 6} textAnchor="middle" fill={TOKEN.muted} fontSize={10} fontWeight={600}>Mid</text>
        <text x={cx + R - 4} y={cy - 14} textAnchor="end"   fill={TOKEN.muted} fontSize={10} fontWeight={600}>High</text>

        {/* Range ticks: 0 / 50 / 100 */}
        <text x={cx - R - 4} y={cy + 4}  textAnchor="end"    fill={TOKEN.muted} fontSize={10} fontWeight={600}>0</text>
        <text x={cx}         y={cy + 14} textAnchor="middle"  fill={TOKEN.muted} fontSize={10} fontWeight={600}>50</text>
        <text x={cx + R + 4} y={cy + 4}  textAnchor="start"  fill={TOKEN.muted} fontSize={10} fontWeight={600}>100</text>
      </svg>

      {/* Centred score readout */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-6">
        <div className="text-center">
          <p
            className="text-4xl font-bold tracking-tight"
            style={{ color: TOKEN.text }}
          >
            <AnimatedScore value={s} />
          </p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: TOKEN.muted }}>
            Score
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Threshold grid (4 range cards)
───────────────────────────────────────────── */
const THRESHOLDS: { label: Severity; range: string; tone: "success" | "warning" | "danger" }[] = [
  { label: "Low",      range: "0–24",   tone: "success" },
  { label: "Moderate", range: "25–49",  tone: "warning" },
  { label: "Elevated", range: "50–74",  tone: "warning" },
  { label: "High",     range: "75–100", tone: "danger"  },
];

function ThresholdCard({
  label,
  range,
  tone,
  isActive,
}: {
  label: Severity;
  range: string;
  tone: "success" | "warning" | "danger";
  isActive: boolean;
}) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className="rounded-2xl border px-3 py-2.5 transition-colors"
      style={{
        borderColor: isActive ? "rgba(37,99,235,0.30)" : TOKEN.border,
        background:  isActive ? "rgba(37,99,235,0.06)" : TOKEN.surface2,
      }}
      aria-label={`${label} threshold: ${range}`}
    >
      <p className="text-xs font-semibold" style={{ color: TOKEN.text }}>{label}</p>
      <p className="mt-0.5 text-xs font-bold" style={{ color: toneColor(tone) }}>{range}</p>
      {isActive && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: "rgba(37,99,235,0.10)", color: TOKEN.blue }}
        >
          Current
        </motion.span>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Breakdown rows
───────────────────────────────────────────── */
function BreakdownRow({
  label,
  value,
  accent,
  delay,
}: {
  label: string;
  value: number;
  accent: string;
  delay: number;
}) {
  const pct = clamp(value, 0, 100);
  return (
    <motion.div variants={rowSlide} className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold" style={{ color: TOKEN.text }}>{label}</span>
        <span className="font-bold" style={{ color: accent }}>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: TOKEN.border }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: accent }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: 0.2 + delay * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function BiasSeverityScore({
  score,
  label,
  description,
  className,
}: BiasSeverityScoreProps) {
  const safeScore = clamp(score, 0, 100);
  const { severity, tone, accent } = severityFromScore(safeScore);
  const expl = description ?? explanationForSeverity(severity);

  /* Derived breakdown bars — deterministic from score */
  const breakdowns = React.useMemo(() => {
    const s = safeScore;
    return [
      { label: "Training data",    value: Math.round(s * 0.85 + 5) },
      { label: "Feature weighting",value: Math.round(s * 0.70 + 8) },
      { label: "Group coverage",   value: Math.round(s * 0.60 + 10) },
      { label: "Proxy signals",    value: Math.round(s * 0.90 + 3) },
    ].map((b) => ({ ...b, value: clamp(b.value, 0, 100) }));
  }, [safeScore]);

  return (
    <div className={className}>
      <Card className="overflow-hidden rounded-3xl border-[#E7E7E9] bg-[#FFFFFF] shadow-sm">

        {/* ── SECTION 1: HEADER ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between"
        >
          {/* Left: title + description + badges */}
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[.18em]" style={{ color: TOKEN.blue }}>
              Bias severity
            </p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl" style={{ color: TOKEN.text }}>
              {label ?? "Audit risk gauge"}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: TOKEN.muted }}>
              {expl}
            </p>

            <motion.div
              className="mt-4 flex flex-wrap items-center gap-2.5"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <SeverityBadge severity={severity} />

              <motion.span
                variants={popIn}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                style={{ background: TOKEN.surface2, borderColor: TOKEN.border, color: TOKEN.muted }}
              >
                <RiskIcon tone={tone} size={14} />
                Risk level
              </motion.span>

              <motion.span
                variants={popIn}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
                style={{ background: TOKEN.surface2, borderColor: TOKEN.border, color: TOKEN.muted }}
              >
                <TrendingUp size={14} aria-hidden="true" style={{ color: TOKEN.blue }} />
                Score {safeScore}/100
              </motion.span>
            </motion.div>
          </div>

          {/* Right: Gauge */}
          <motion.div
            className="lg:shrink-0"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.08}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={severity}
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1,    y: 0 }}
                exit={{    opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
              >
                <Gauge score={safeScore} accent={accent} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* ── SECTION 2: THRESHOLD GRID ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.12}
          className="px-5 pb-0 sm:px-6"
        >
          <motion.div
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {THRESHOLDS.map(({ label: tl, range, tone: t }) => (
              <ThresholdCard
                key={tl}
                label={tl}
                range={range}
                tone={t}
                isActive={tl === severity}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* ── SECTION 3: BREAKDOWN BARS ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.18}
          className="px-5 pt-5 sm:px-6"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[.14em]" style={{ color: TOKEN.muted }}>
            Score breakdown
          </p>
          <motion.div
            className="space-y-3"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {breakdowns.map((b, i) => (
              <BreakdownRow key={b.label} {...b} accent={accent} delay={i} />
            ))}
          </motion.div>
        </motion.div>

        {/* ── SECTION 4: HOW TO USE ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.24}
          className="p-5 pt-5 sm:p-6 sm:pt-5"
        >
          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: TOKEN.border, background: TOKEN.surface }}
          >
            <div className="flex items-start gap-3">
              <motion.span
                whileHover={{ scale: 1.08, rotate: -4 }}
                transition={{ type: "spring", stiffness: 340, damping: 22 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                style={{ background: TOKEN.surface2, borderColor: TOKEN.border }}
                aria-hidden="true"
              >
                <ShieldCheck size={18} style={{ color: TOKEN.blue }} />
              </motion.span>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: TOKEN.text }}>
                  How to use this gauge
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: TOKEN.muted }}>
                  Use the gauge to prioritize mitigation work. Combine it with metric-level
                  explanations to decide what to fix first.
                </p>
              </div>
            </div>

            {/* Responsive action chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { icon: AlertTriangle, label: "Review training data",  tone: "danger"  as const },
                { icon: ShieldCheck,  label: "Check group coverage",   tone: "success" as const },
                { icon: Info,         label: "Inspect proxy signals",  tone: "warning" as const },
              ].map(({ icon: Icon, label: cl, tone: ct }) => (
                <motion.span
                  key={cl}
                  whileHover={{ y: -1, transition: { duration: 0.15 } }}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                  style={{
                    borderColor: TOKEN.border,
                    background:  TOKEN.surface2,
                    color:       TOKEN.muted,
                  }}
                >
                  <Icon size={12} aria-hidden="true" style={{ color: toneColor(ct) }} />
                  {cl}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

      </Card>
    </div>
  );
}
