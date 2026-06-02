"use client";

import * as React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Circle,
  HelpCircle,
  Scale,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type CandidateGroup = "Group A" | "Group B" | "Group C" | "Group D";

type EvaluationSignal =
  | "Education"
  | "Experience"
  | "Skills"
  | "Location"
  | "Keywords"
  | "Career Gap";

type HeatSeverity = "low" | "medium" | "high";

type HeatCell = {
  severity: HeatSeverity;
  riskLabel: string;
};

type HeatmapValues = {
  [G in CandidateGroup]: {
    [S in EvaluationSignal]: HeatCell;
  };
};

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const CANDIDATE_GROUPS: CandidateGroup[] = [
  "Group A",
  "Group B",
  "Group C",
  "Group D",
];

const EVALUATION_SIGNALS: EvaluationSignal[] = [
  "Education",
  "Experience",
  "Skills",
  "Location",
  "Keywords",
  "Career Gap",
];

function emptyHeatmap(): HeatmapValues {
  const out = {} as HeatmapValues;

  for (const g of CANDIDATE_GROUPS) {
    out[g] = {} as HeatmapValues[CandidateGroup];
    for (const s of EVALUATION_SIGNALS) {
      out[g][s] = {
        severity: "low",
        riskLabel: "No stored disparity signal",
      };
    }
  }

  return out;
}

/* ─────────────────────────────────────────────
   Severity helpers
───────────────────────────────────────────── */
function getSeverityStyles(sev: HeatSeverity) {
  switch (sev) {
    case "low":
      return {
        bg:     "rgba(34,197,94,0.10)",
        border: "rgba(34,197,94,0.28)",
        fg:     "#15803D",
        label:  "Low",
        badgeCls:
          "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
      };
    case "medium":
      return {
        bg:     "rgba(245,158,11,0.10)",
        border: "rgba(245,158,11,0.28)",
        fg:     "#92400E",
        label:  "Medium",
        badgeCls:
          "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
      };
    case "high":
      return {
        bg:     "rgba(239,68,68,0.10)",
        border: "rgba(239,68,68,0.28)",
        fg:     "#991B1B",
        label:  "High",
        badgeCls:
          "bg-red-50 text-red-800 ring-1 ring-red-200",
      };
  }
}

function SeverityIcon({ sev, size = 15 }: { sev: HeatSeverity; size?: number }) {
  if (sev === "low")    return <CheckCircle2 size={size} aria-hidden="true" />;
  if (sev === "medium") return <AlertCircle  size={size} aria-hidden="true" />;
  return                       <AlertCircle  size={size} aria-hidden="true" />;
}

/* ─────────────────────────────────────────────
   Framer Motion variants
───────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const cellVariant: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

const rowVariant: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

const tooltipVariant: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: 6, scale: 0.96, transition: { duration: 0.12 } },
};

const infoPanelVariant: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: 6,  scale: 0.97, transition: { duration: 0.15 } },
};

/* ─────────────────────────────────────────────
   HeatCell button
───────────────────────────────────────────── */
function HeatCellButton({
  group,
  signal,
  cell,
  isActive,
  rowIndex,
  colIndex,
  onSelect,
  onHoverEnter,
  onHoverLeave,
}: {
  group: CandidateGroup;
  signal: EvaluationSignal;
  cell: HeatCell;
  isActive: boolean;
  rowIndex: number;
  colIndex: number;
  onSelect: (group: CandidateGroup, signal: EvaluationSignal) => void;
  onHoverEnter: (group: CandidateGroup, signal: EvaluationSignal, el: HTMLButtonElement) => void;
  onHoverLeave: () => void;
}) {
  const sty = getSeverityStyles(cell.severity);
  const ref  = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <motion.button
        ref={ref}
        type="button"
        variants={cellVariant}
        custom={{ row: rowIndex, col: colIndex }}
        whileHover={{ scale: 1.10, y: -2, transition: { duration: 0.18 } }}
        whileTap={{ scale: 0.94 }}
        animate={isActive ? { scale: 1.12, y: -3 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 24 }}
        onClick={() => onSelect(group, signal)}
        onMouseEnter={() => ref.current && onHoverEnter(group, signal, ref.current)}
        onMouseLeave={onHoverLeave}
        onFocus={() => ref.current && onHoverEnter(group, signal, ref.current)}
        onBlur={onHoverLeave}
        aria-label={`${group} · ${signal}. ${sty.label} severity. ${cell.riskLabel}`}
        aria-pressed={isActive}
        className={[
          "relative flex h-14 w-14 flex-col items-center justify-center gap-0.5",
          "rounded-[14px] border outline-none",
          "transition-shadow focus-visible:ring-2 focus-visible:ring-[#2563EB]/50",
          isActive ? "shadow-[0_6px_18px_rgba(0,0,0,0.14)]" : "shadow-none",
        ].join(" ")}
        style={{ background: sty.bg, borderColor: sty.border, color: sty.fg }}
      >
        <SeverityIcon sev={cell.severity} size={16} />
        <span className="text-[10px] font-bold leading-none" aria-hidden="true">
          {sty.label}
        </span>
      </motion.button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Legend row
───────────────────────────────────────────── */
function LegendRow({ sev }: { sev: HeatSeverity }) {
  const sty = getSeverityStyles(sev);
  return (
    <motion.div
      variants={rowVariant}
      className="flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border"
          style={{ background: sty.bg, borderColor: sty.border, color: sty.fg }}
          aria-hidden="true"
        >
          {sev === "low"
            ? <CheckCircle2 size={16} />
            : <Circle size={16} />}
        </span>
        <p className="text-sm font-semibold text-[#0D0C22]">{sty.label}</p>
      </div>
      <span className="text-xs text-[#6E6D7A]">Severity</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Accessible fallback table
───────────────────────────────────────────── */
function AccessibleTable({ heatmap }: { heatmap: HeatmapValues }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E7E7E9] bg-white">
      <table
        className="min-w-full border-collapse text-xs"
        aria-label="Accessible bias severity table"
      >
        <thead>
          <tr className="bg-[#F6F8FB]">
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[.12em] text-[#6E6D7A]">
              Group
            </th>
            {EVALUATION_SIGNALS.map((s) => (
              <th
                key={s}
                className="px-2 py-2 text-left text-[10px] font-bold uppercase tracking-[.12em] text-[#6E6D7A]"
              >
                {s.length > 6 ? s.slice(0, 3) : s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CANDIDATE_GROUPS.map((g) => (
            <tr key={g} className="border-t border-[#E7E7E9]">
              <td className="px-3 py-2 text-xs font-semibold text-[#0D0C22]">{g}</td>
              {EVALUATION_SIGNALS.map((s) => {
                const cell = heatmap[g][s];
                const sty  = getSeverityStyles(cell.severity);
                return (
                  <td key={s} className="px-2 py-2">
                    <span
                      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        background:  sty.bg,
                        borderColor: sty.border,
                        color:       sty.fg,
                      }}
                    >
                      {sty.label.slice(0, 3)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Active info panel (sidebar)
───────────────────────────────────────────── */
function ActiveInfoPanel({
  group,
  signal,
  cell,
  onClose,
}: {
  group: CandidateGroup;
  signal: EvaluationSignal;
  cell: HeatCell;
  onClose: () => void;
}) {
  const sty = getSeverityStyles(cell.severity);
  return (
    <motion.div
      key={`${group}-${signal}`}
      variants={infoPanelVariant}
      initial="hidden"
      animate="show"
      exit="exit"
      className="rounded-2xl border border-[#E7E7E9] bg-white p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#2563EB]">
            Selected signal
          </p>
          <p className="mt-1 truncate text-sm font-bold text-[#0D0C22]">
            {group} · {signal}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#6E6D7A]">
            {cell.riskLabel}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close info panel"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7E7E9] text-[#6E6D7A] transition hover:bg-[#F6F8FB]"
          >
            <X size={13} />
          </motion.button>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold"
            style={{ background: sty.bg, borderColor: sty.border, color: sty.fg }}
          >
            <SeverityIcon sev={cell.severity} size={12} />
            {sty.label}
          </span>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[#E7E7E9] bg-[#F6F8FB] p-3">
        <p className="text-[11px] font-bold text-[#0D0C22]">Severity guidance</p>
        <p className="mt-1 text-[11px] leading-relaxed text-[#6E6D7A]">
          Lower severity indicates more stable fairness behaviour. Higher severity
          suggests stronger bias risk and is a good target for mitigation.
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Hover tooltip (desktop only)
───────────────────────────────────────────── */
type TooltipInfo = {
  group:    CandidateGroup;
  signal:   EvaluationSignal;
  cell:     HeatCell;
  rect:     DOMRect;
};

function HoverTooltip({
  info,
  containerRef,
}: {
  info: TooltipInfo;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const sty = getSeverityStyles(info.cell.severity);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      setStyle({});
      return;
    }

    const cr = container.getBoundingClientRect();
    setStyle({
      position: "absolute",
      left:  info.rect.left - cr.left + info.rect.width / 2,
      top:   info.rect.top  - cr.top,
      transform: "translate(-50%, calc(-100% - 10px))",
      zIndex: 50,
      width: 272,
      pointerEvents: "none",
    });
  }, [info.rect, containerRef]);

  return (
    <motion.div
      key={`${info.group}-${info.signal}`}
      variants={tooltipVariant}
      initial="hidden"
      animate="show"
      exit="exit"
      style={style}
      role="status"
      aria-live="polite"
      className="rounded-[14px] border border-[#E7E7E9] bg-white p-3 shadow-[0_8px_32px_rgba(13,12,34,0.10)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#2563EB]">
            Bias signal
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[#0D0C22]">
            {info.group} · {info.signal}
          </p>
          <p className="mt-1 text-xs text-[#6E6D7A]">{info.cell.riskLabel}</p>
        </div>
        <span
          className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold"
          style={{ background: sty.bg, borderColor: sty.border, color: sty.fg }}
        >
          <SeverityIcon sev={info.cell.severity} size={11} />
          {sty.label}
        </span>
      </div>

      <div className="mt-3 rounded-xl border border-[#E7E7E9] bg-[#F6F8FB] p-2.5">
        <p className="text-[11px] font-semibold text-[#0D0C22]">Severity guidance</p>
        <p className="mt-1 text-[11px] leading-relaxed text-[#6E6D7A]">
          Lower severity → stable fairness. Higher severity → bias risk, target for
          mitigation.
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
type BiasHeatmapProps = {
  values?:    Partial<HeatmapValues> | null;
  className?: string;
};

export default function BiasHeatmap({ values, className }: BiasHeatmapProps) {
  /* ── Normalize prop values into a complete heatmap shape ── */
  const heatmap: HeatmapValues = React.useMemo(() => {
    const base = emptyHeatmap();
    if (!values) return base;
    const out = {} as HeatmapValues;
    for (const g of CANDIDATE_GROUPS) {
      out[g] = {} as HeatmapValues[CandidateGroup];
      for (const s of EVALUATION_SIGNALS) {
        const override = values[g]?.[s];
        out[g][s] = override?.severity
          ? { severity: override.severity, riskLabel: override.riskLabel ?? base[g][s].riskLabel }
          : base[g][s];
      }
    }
    return out;
  }, [values]);

  /* ── Selected cell (sidebar panel) ── */
  const [selected, setSelected] = React.useState<{
    group: CandidateGroup;
    signal: EvaluationSignal;
  } | null>(null);

  const handleSelect = React.useCallback(
    (group: CandidateGroup, signal: EvaluationSignal) => {
      setSelected((prev) =>
        prev?.group === group && prev?.signal === signal ? null : { group, signal }
      );
    },
    []
  );

  /* ── Hover tooltip ── */
  const [hovering, setHovering] = React.useState<TooltipInfo | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleHoverEnter = React.useCallback(
    (group: CandidateGroup, signal: EvaluationSignal, el: HTMLButtonElement) => {
      setHovering({ group, signal, cell: heatmap[group][signal], rect: el.getBoundingClientRect() });
    },
    [heatmap]
  );
  const handleHoverLeave = React.useCallback(() => setHovering(null), []);

  /* ── Keyboard: Escape deselects ── */
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className={className}>
      {/* ── SECTION 1: HEADER ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#2563EB]">
            Fairness heatmap
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#0D0C22] sm:text-2xl">
            Bias &amp; fairness signals
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6E6D7A]">
            Hover or click a cell to inspect bias risk severity across candidate
            groups and evaluation signals.
          </p>
        </div>

        {/* Legend + accessible hover pills */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1.5 text-xs font-semibold text-[#6E6D7A]">
            <Scale size={14} className="text-[#2563EB]" aria-hidden="true" />
            Legend
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E7E9] bg-white px-3 py-1.5 text-xs font-semibold text-[#6E6D7A]">
            <HelpCircle size={14} className="text-[#2563EB]" aria-hidden="true" />
            Accessible hover
          </span>
        </div>
      </motion.div>

      {/* ── SECTION 2: MAIN GRID (heatmap + sidebar) ── */}
      <div
        ref={containerRef}
        className="relative mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]"
      >
        {/* ── LEFT: Heatmap ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.06}
        >
          {/* Mobile scroll hint */}
          <p className="mb-2 text-[11px] text-[#6E6D7A] sm:hidden">
            ← Scroll horizontally to see all signals
          </p>

          <div className="overflow-x-auto rounded-[18px] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
            <div className="min-w-[460px]">
              {/* Column headers */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `180px repeat(${EVALUATION_SIGNALS.length}, minmax(64px,1fr))`,
                }}
              >
                <div className="px-2 py-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#6E6D7A]">
                    Candidate Groups
                  </p>
                </div>
                {EVALUATION_SIGNALS.map((sig) => (
                  <div key={sig} className="px-2 py-1.5">
                    <p className="truncate text-[10px] font-bold uppercase tracking-[.13em] text-[#6E6D7A]">
                      {sig}
                    </p>
                  </div>
                ))}
              </div>

              {/* Rows */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {CANDIDATE_GROUPS.map((group, rowIdx) => (
                  <motion.div
                    key={group}
                    variants={rowVariant}
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: `180px repeat(${EVALUATION_SIGNALS.length}, minmax(64px,1fr))`,
                    }}
                  >
                    {/* Row label */}
                    <div className="px-2 py-2">
                      <p className="text-sm font-semibold text-[#0D0C22]">{group}</p>
                    </div>

                    {/* Cells */}
                    <motion.div
                      className="contents"
                      variants={staggerContainer}
                    >
                      {EVALUATION_SIGNALS.map((sig, colIdx) => (
                        <div key={sig} className="px-2 py-2">
                          <HeatCellButton
                            group={group}
                            signal={sig}
                            cell={heatmap[group][sig]}
                            isActive={
                              selected?.group === group && selected?.signal === sig
                            }
                            rowIndex={rowIdx}
                            colIndex={colIdx}
                            onSelect={handleSelect}
                            onHoverEnter={handleHoverEnter}
                            onHoverLeave={handleHoverLeave}
                          />
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Hover tooltip (desktop) */}
          <AnimatePresence>
            {hovering && !selected && (
              <HoverTooltip
                key={`${hovering.group}-${hovering.signal}`}
                info={hovering}
                containerRef={containerRef as React.RefObject<HTMLDivElement>}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── RIGHT: Sidebar ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.14}
          className="flex flex-col gap-4"
        >
          {/* ── SECTION 3: RISK LEGEND ── */}
          <div className="rounded-2xl border border-[#E7E7E9] bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7E7E9] bg-[#F6F8FB]">
                <ChevronRight size={16} className="text-[#2563EB]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Risk legend</p>
                <p className="mt-0.5 text-xs text-[#6E6D7A]">
                  Color intensity shows bias severity.
                </p>
              </div>
            </div>

            <motion.div
              className="mt-4 space-y-3"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {(["low", "medium", "high"] as HeatSeverity[]).map((sev) => (
                <LegendRow key={sev} sev={sev} />
              ))}
            </motion.div>

            {/* Divider */}
            <div className="my-4 h-px bg-[#E7E7E9]" />

            {/* ── SECTION 4: ACCESSIBLE TABLE ── */}
            <div className="rounded-xl border border-[#E7E7E9] bg-[#F6F8FB] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#6E6D7A]">
                Accessible fallback
              </p>
              <p className="mt-1 text-sm font-semibold text-[#0D0C22]">Table view</p>
              <p className="mt-0.5 text-xs text-[#6E6D7A]">
                All severity labels readable without the interactive grid.
              </p>
              <div className="mt-3">
                <AccessibleTable heatmap={heatmap} />
              </div>
            </div>
          </div>

          {/* ── SECTION 5: ACTIVE SIGNAL INFO PANEL ── */}
          <AnimatePresence mode="wait">
            {selected && (
              <ActiveInfoPanel
                key={`${selected.group}-${selected.signal}`}
                group={selected.group}
                signal={selected.signal}
                cell={heatmap[selected.group][selected.signal]}
                onClose={() => setSelected(null)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
