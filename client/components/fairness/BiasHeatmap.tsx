"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Circle,
  HelpCircle,
  Scale,
} from "lucide-react";

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

type TooltipState = {
  open: boolean;
  group: CandidateGroup | null;
  signal: EvaluationSignal | null;
  severity: HeatSeverity | null;
  riskLabel: string;
  anchorRect: DOMRect | null;
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

const candidateGroups: CandidateGroup[] = ["Group A", "Group B", "Group C", "Group D"];
const evaluationSignals: EvaluationSignal[] = [
  "Education",
  "Experience",
  "Skills",
  "Location",
  "Keywords",
  "Career Gap",
];

function severityToTone(sev: HeatSeverity) {
  if (sev === "low") return { bg: "rgba(34,197,94,0.12)", bd: "rgba(34,197,94,0.28)", fg: BRAND.success };
  if (sev === "medium") return { bg: "rgba(245,158,11,0.12)", bd: "rgba(245,158,11,0.28)", fg: BRAND.warning };
  return { bg: "rgba(239,68,68,0.12)", bd: "rgba(239,68,68,0.28)", fg: BRAND.danger };
}

function severityAriaLabel(sev: HeatSeverity) {
  if (sev === "low") return "Low severity";
  if (sev === "medium") return "Medium severity";
  return "High severity";
}

function severityToA11yIcon(sev: HeatSeverity) {
  if (sev === "low") return <CheckCircle2 size={14} aria-hidden="true" />;
  if (sev === "medium") return <AlertCircle size={14} aria-hidden="true" />;
  return <AlertCircle size={14} aria-hidden="true" />;
}

function AccessibleHeatCell({
  group,
  signal,
  cell,
  onHover,
  onFocus,
  onLeave,
}: {
  group: CandidateGroup;
  signal: EvaluationSignal;
  cell: HeatCell;
  onHover: (group: CandidateGroup, signal: EvaluationSignal, rect: DOMRect) => void;
  onFocus: (group: CandidateGroup, signal: EvaluationSignal, rect: DOMRect) => void;
  onLeave: () => void;
}) {
  const tone = severityToTone(cell.severity);

  return (
    <button
      type="button"
      onMouseEnter={(e) => onHover(group, signal, e.currentTarget.getBoundingClientRect())}
      onMouseMove={(e) => onHover(group, signal, e.currentTarget.getBoundingClientRect())}
      onFocus={(e) => onFocus(group, signal, e.currentTarget.getBoundingClientRect())}
      onBlur={onLeave}
      onMouseLeave={onLeave}
      className="relative h-12 w-12 rounded-2xl border outline-none transition focus-visible:ring-2 focus-visible:ring-[#2563EB]"
      style={{
        background: tone.bg,
        borderColor: tone.bd,
      }}
      aria-label={`${group} · ${signal}. ${severityAriaLabel(cell.severity)}. ${cell.riskLabel}`}
    >
      <span className="sr-only">{cell.riskLabel}</span>

      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{ color: tone.fg }}
      >
        {severityToA11yIcon(cell.severity)}
      </span>

      {/* subtle label for keyboard users */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1 bottom-1 truncate text-[10px] font-semibold"
        style={{ color: tone.fg }}
      >
        {cell.severity === "low" ? "Low" : cell.severity === "medium" ? "Med" : "High"}
      </span>
    </button>
  );
}

type BiasHeatmapProps = {
  values?: Partial<HeatmapValues> | null;
  className?: string;
};

export default function BiasHeatmap({ values, className }: BiasHeatmapProps) {
  const fallback: HeatmapValues = React.useMemo(
    () => ({
      "Group A": {
        Education: { severity: "low", riskLabel: "Minimal skew" },
        Experience: { severity: "medium", riskLabel: "Slight disparity" },
        Skills: { severity: "low", riskLabel: "Aligned outcomes" },
        Location: { severity: "medium", riskLabel: "Regional weighting" },
        Keywords: { severity: "medium", riskLabel: "Keyword sensitivity" },
        "Career Gap": { severity: "high", riskLabel: "Gap penalization" },
      },
      "Group B": {
        Education: { severity: "medium", riskLabel: "Education weighting" },
        Experience: { severity: "low", riskLabel: "Stable" },
        Skills: { severity: "medium", riskLabel: "Tool mismatch" },
        Location: { severity: "low", riskLabel: "No major skew" },
        Keywords: { severity: "low", riskLabel: "Balanced" },
        "Career Gap": { severity: "medium", riskLabel: "Mild disadvantage" },
      },
      "Group C": {
        Education: { severity: "high", riskLabel: "Qualification bias" },
        Experience: { severity: "medium", riskLabel: "Seniority mismatch" },
        Skills: { severity: "high", riskLabel: "Skill under-recognition" },
        Location: { severity: "medium", riskLabel: "Local signal dominance" },
        Keywords: { severity: "high", riskLabel: "Keyword overfit" },
        "Career Gap": { severity: "low", riskLabel: "Robust" },
      },
      "Group D": {
        Education: { severity: "low", riskLabel: "Consistent" },
        Experience: { severity: "high", riskLabel: "Tenure advantage" },
        Skills: { severity: "medium", riskLabel: "Partial disparity" },
        Location: { severity: "high", riskLabel: "Geo bias" },
        Keywords: { severity: "medium", riskLabel: "Résumé phrasing" },
        "Career Gap": { severity: "medium", riskLabel: "Moderate penalty" },
      },
    }),
    [],
  );

  const merged: HeatmapValues = React.useMemo(() => {
    const v = values ?? {};
    const out = {} as HeatmapValues;

    for (const g of candidateGroups) {
      const groupOverride = v[g];
      const nextGroup = {} as HeatmapValues[CandidateGroup];

      for (const s of evaluationSignals) {
        const cell = groupOverride?.[s];
        nextGroup[s] =
          cell?.severity
            ? {
                severity: cell.severity,
                riskLabel:
                  typeof cell.riskLabel === "string"
                    ? cell.riskLabel
                    : fallback[g][s].riskLabel,
              }
            : fallback[g][s];
      }

      out[g] = nextGroup;
    }

    return out;
  }, [values, fallback]);

  const [tip, setTip] = React.useState<TooltipState>({
    open: false,
    group: null,
    signal: null,
    severity: null,
    riskLabel: "",
    anchorRect: null,
  });

  const hide = React.useCallback(() => setTip((t) => ({ ...t, open: false })), []);

  const show = React.useCallback((group: CandidateGroup, signal: EvaluationSignal, rect: DOMRect) => {
    const cell = merged[group][signal];
    setTip({
      open: true,
      group,
      signal,
      severity: cell.severity,
      riskLabel: cell.riskLabel,
      anchorRect: rect,
    });
  }, [merged]);

  const toneLegend = {
    low: severityToTone("low"),
    medium: severityToTone("medium"),
    high: severityToTone("high"),
  } as const;

  const tooltipStyle: React.CSSProperties | undefined = React.useMemo(() => {
    if (!tip.open || !tip.anchorRect) return undefined;
    const left = tip.anchorRect.left + tip.anchorRect.width / 2;
    const top = tip.anchorRect.top;

    // Position tooltip above the hovered cell when possible.
    const tentativeTop = top - 12;

    return {
      left,
      top: tentativeTop,
      transform: "translate(-50%, -100%)",
    };
  }, [tip.open, tip.anchorRect]);

  return (
    <div className={className}>
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Fairness heatmap</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">Bias & fairness signals</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
              Hover or focus a cell to inspect bias risk severity across candidate groups and evaluation signals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm font-semibold text-[#6E6D7A]"
              aria-label="Heatmap legend"
            >
              <Scale size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
              Legend
            </span>

            <span className="inline-flex items-center gap-2 rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-2 text-sm font-semibold text-[#6E6D7A]">
              <HelpCircle size={16} className="text-[#2563EB]" aria-hidden="true" />
              <span className="sr-only">Tip</span>
              Accessible hover
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-x-auto rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
              <div className="min-w-max">
                <div className="grid" style={{ gridTemplateColumns: `180px repeat(${evaluationSignals.length}, minmax(56px, 1fr))` }}>
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Candidate Groups</p>
                  </div>
                  {evaluationSignals.map((s) => (
                    <div key={s} className="px-2 py-2">
                      <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">{s}</p>
                    </div>
                  ))}

                  {candidateGroups.map((g) => (
                    <React.Fragment key={g}>
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-[#0D0C22]">{g}</p>
                      </div>
                      {evaluationSignals.map((s) => (
                        <div key={`${g}-${s}`} className="px-2 py-2">
                          <AccessibleHeatCell
                            group={g}
                            signal={s}
                            cell={merged[g][s]}
                            onHover={show}
                            onFocus={show}
                            onLeave={hide}
                          />
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {tip.open && tip.anchorRect ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  style={tooltipStyle}
                  className="fixed z-50 w-[280px] rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-3 shadow-[0_24px_64px_rgba(13,12,34,0.10)]"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">Bias signal</p>
                      <p className="mt-1 text-sm font-semibold text-[#0D0C22] truncate">
                        {tip.group} · {tip.signal}
                      </p>
                      <p className="mt-1 text-sm text-[#6E6D7A]">{tip.riskLabel}</p>
                    </div>

                    <span
                      className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-semibold"
                      style={(() => {
                        if (!tip.severity) return { background: "rgba(37,99,235,0.10)", color: BRAND.primary, borderColor: "rgba(37,99,235,0.25)" };
                        const t = severityToTone(tip.severity);
                        return { background: t.bg, color: t.fg, borderColor: t.bd };
                      })()}
                    >
                      {tip.severity === "low" ? "Low" : tip.severity === "medium" ? "Medium" : "High"}
                    </span>
                  </div>

                  <div className="mt-3 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                    <p className="text-xs font-semibold text-[#0D0C22]">Severity guidance</p>
                    <p className="mt-1 text-xs leading-5 text-[#6E6D7A]">
                      Lower severity indicates more stable fairness behavior. Higher severity suggests stronger bias risk and a good target for mitigation.
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                  <ChevronRight size={18} className="text-[#2563EB]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">Risk legend</p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">Color intensity shows bias severity.</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <LegendRow label="Low" style={toneLegend.low} />
                <LegendRow label="Medium" style={toneLegend.medium} />
                <LegendRow label="High" style={toneLegend.high} />
              </div>

              <div className="mt-6 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Accessible fallback</p>
                <p className="mt-2 text-sm font-semibold text-[#0D0C22]">Table view</p>
                <p className="mt-1 text-sm text-[#6E6D7A]">
                  If interactive heatmap is not available, you can still read all severity labels below.
                </p>

                <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-[#F6F8FB]">
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Group</th>
                        {evaluationSignals.map((s) => (
                          <th key={s} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {candidateGroups.map((g) => (
                        <tr key={g} className="border-t border-[#E7E7E9]">
                          <td className="px-3 py-3 text-sm font-semibold text-[#0D0C22]">{g}</td>
                          {evaluationSignals.map((s) => {
                            const cell = merged[g][s];
                            const t = severityToTone(cell.severity);
                            return (
                              <td key={`${g}-${s}-fallback`} className="px-3 py-3">
                                <span
                                  className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-semibold"
                                  style={{ background: t.bg, color: t.fg, borderColor: t.bd }}
                                >
                                  {cell.severity === "low" ? "Low" : cell.severity === "medium" ? "Med" : "High"}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LegendRow({
  label,
  style,
}: {
  label: "Low" | "Medium" | "High";
  style: { bg: string; bd: string; fg: string };
}) {
  const icon = label === "Low" ? <CheckCircle2 size={16} aria-hidden="true" /> : <Circle size={16} aria-hidden="true" />;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-2xl border"
          style={{ background: style.bg, borderColor: style.bd, color: style.fg }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <p className="text-sm font-semibold text-[#0D0C22]">{label}</p>
      </div>
      <span className="text-xs font-semibold text-[#6E6D7A]">Severity</span>
    </div>
  );
}
