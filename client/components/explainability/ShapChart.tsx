"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import {
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  BarChart,
  CartesianGrid,
} from "recharts";
import { AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  MinusCircle,
  PlusCircle,
  Sparkles,
} from "lucide-react";

type ShapSignal =
  | "Product Strategy Experience"
  | "UX Research"
  | "Leadership Impact"
  | "Metrics Driven Results"
  | "Missing Portfolio Link"
  | "Limited Accessibility Evidence"
  | "Weak Quantified Outcomes";

type ShapDatum = {
  signal: ShapSignal;
  value: number; // SHAP-like contribution in percentage points
};

type ShapChartProps = {
  values?: ShapDatum[] | null;
  className?: string;
  title?: string;
  description?: string;
};

const BRAND = {
  primary: "#2563EB",
  positive: "#2563EB",
  negative: "#EF4444",
  warning: "#F59E0B",
  border: "#E7E7E9",
  mutedText: "#6E6D7A",
};

function formatSigned(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function contributionTone(v: number): "pos" | "neg" {
  return v >= 0 ? "pos" : "neg";
}

function getSummary(values: ShapDatum[]) {
  const totalAbs = values.reduce((acc, d) => acc + Math.abs(d.value), 0);
  const topPos = values.filter((d) => d.value >= 0).sort((a, b) => b.value - a.value)[0];
  const topNeg = values.filter((d) => d.value < 0).sort((a, b) => a.value - b.value)[0];
  const posAbs = values.filter((d) => d.value >= 0).reduce((acc, d) => acc + Math.abs(d.value), 0);
  const negAbs = values.filter((d) => d.value < 0).reduce((acc, d) => acc + Math.abs(d.value), 0);
  return {
    totalAbs,
    topPos,
    topNeg,
    posAbs,
    negAbs,
  };
}

type TooltipPayloadItem = {
  value?: number;
  payload?: {
    signal?: ShapSignal;
  };
};

function ContributionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  const signal = p?.payload?.signal;
  const value = p?.value;
  const tone = value != null ? contributionTone(value) : "pos";

  const bg = tone === "pos" ? "rgba(37,99,235,0.10)" : "rgba(239,68,68,0.10)";
  const borderColor = tone === "pos" ? "rgba(37,99,235,0.25)" : "rgba(239,68,68,0.25)";
  const fg = tone === "pos" ? BRAND.primary : BRAND.negative;

  return (
    <div
      className="rounded-[1.25rem] border p-3 shadow-[0_16px_48px_rgba(13,12,34,0.08)] bg-[#FFFFFF]"
      style={{ background: bg, borderColor }}
      role="status"
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">Contribution</p>
      <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{signal}</p>
      <p className="mt-1 text-sm font-semibold" style={{ color: fg }}>
        {value != null ? formatSigned(value) : "—"}
      </p>
      <p className="mt-2 text-xs text-[#6E6D7A]">
        Positive values increase the predicted outcome; negative values reduce it.
      </p>
    </div>
  );
}

export default function ShapChart({ values, className, title, description }: ShapChartProps) {
  const fallback: ShapDatum[] = React.useMemo(
    () => [
      { signal: "Product Strategy Experience", value: 6.4 },
      { signal: "UX Research", value: 3.2 },
      { signal: "Leadership Impact", value: 2.1 },
      { signal: "Metrics Driven Results", value: 1.4 },
      { signal: "Missing Portfolio Link", value: -2.6 },
      { signal: "Limited Accessibility Evidence", value: -3.9 },
      { signal: "Weak Quantified Outcomes", value: -5.2 },
    ],
    []
  );

  const data = React.useMemo(() => {
    const arr = values && values.length ? values : fallback;
    // Keep stable order by sorting magnitude descending for a readable chart.
    return [...arr].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [values, fallback]);

  const summary = React.useMemo(() => getSummary(data), [data]);

  const hasNeg = summary.negAbs > 0;
  const hasPos = summary.posAbs > 0;

  const [hovered, setHovered] = React.useState<ShapDatum | null>(null);

  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 0.1);
  const xDomain: [number, number] = [-maxAbs * 1.15, maxAbs * 1.15];

  return (
    <div className={className}>
      <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Explainability</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
              {title ?? "SHAP-style contribution overview"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
              {description ??
                "Horizontal bars show which resume signals push the decision up or down. Values are mock-friendly and computed from provided props."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasPos ? (
              <span className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-xs font-semibold text-[#6E6D7A]" aria-label="Positive signals">
                <PlusCircle size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" /> Positive
              </span>
            ) : null}
            {hasNeg ? (
              <span className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-xs font-semibold text-[#6E6D7A]" aria-label="Negative signals">
                <MinusCircle size={16} className="mr-2 text-[#EF4444]" aria-hidden="true" /> Negative
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
              <div className="flex items-start justify-between gap-4 px-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Signal impact</p>
                  <p className="mt-1 text-sm font-semibold text-[#0D0C22]">Contribution bars</p>
                  <p className="mt-1 text-xs text-[#6E6D7A]">Hover a bar for details.</p>
                </div>

                <span className="inline-flex items-center rounded-[1rem] border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#6E6D7A]" aria-label="Legend">
                  <Sparkles size={14} className="mr-2 text-[#2563EB]" aria-hidden="true" /> SHAP
                </span>
              </div>

              <div className="mt-3 h-[320px]" role="img" aria-label="Horizontal bar chart of SHAP contributions">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.map((d) => ({ ...d, label: d.signal }))}
                    layout="vertical"
                    margin={{ top: 8, right: 14, left: 10, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(231,231,233,1)" />
                    <XAxis type="number" domain={xDomain} tick={{ fontSize: 12, fill: BRAND.mutedText }} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fontSize: 12, fill: BRAND.mutedText }}
                      width={190}
                    />
                    <Tooltip content={<ContributionTooltip />} />
                    <Legend />

                    <Bar
                      dataKey="value"
                      name="Contribution"
                      barSize={18}
                      onMouseEnter={(data) => {
                        const payload = data?.payload;
                        if (
                          payload &&
                          typeof payload.signal === "string" &&
                          typeof payload.value === "number"
                        ) {
                          setHovered(payload as ShapDatum);
                        }
                      }}
                      onMouseLeave={() => setHovered(null)}
                      radius={[8, 8, 8, 8]}
                      fill="#2563EB"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 px-2">
                {hovered ? (
                  <span
                    className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#6E6D7A]"
                    aria-live="polite"
                    aria-label={`Hovered signal ${hovered.signal}`}
                  >
                    {contributionTone(hovered.value) === "pos" ? (
                      <CheckCircle2 size={16} className="mr-2 text-[#22C55E]" aria-hidden="true" />
                    ) : (
                      <AlertCircle size={16} className="mr-2 text-[#EF4444]" aria-hidden="true" />
                    )}
                    {hovered.signal}: {formatSigned(hovered.value)}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#6E6D7A]">
                    <Info size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                    Hover over a signal bar to see its impact.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Score impact summary</p>

              <div className="mt-4 space-y-3">
                <SummaryRow
                  tone={"pos"}
                  label="Top positive"
                  value={summary.topPos ? summary.topPos.value : null}
                  fallbackText="—"
                />
                <SummaryRow
                  tone={"neg"}
                  label="Top negative"
                  value={summary.topNeg ? summary.topNeg.value : null}
                  fallbackText="—"
                />
              </div>

              <div className="mt-4 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Interpretation</p>
                <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">
                  Use this chart to prioritize which resume signals to strengthen. Larger magnitude values indicate stronger influence on the decision.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Legend notes</p>
              <ul className="mt-3 space-y-2 text-sm text-[#6E6D7A]">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: BRAND.primary }} aria-hidden="true" />
                  Positive contributions push the predicted score upward.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: BRAND.negative }} aria-hidden="true" />
                  Negative contributions reduce the predicted score.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {/* Keep AnimatePresence mounted for smoothness; no extra modals */}
      </AnimatePresence>
    </div>
  );
}

function SummaryRow({
  tone,
  label,
  value,
  fallbackText,
}: {
  tone: "pos" | "neg";
  label: string;
  value: number | null;
  fallbackText: string;
}) {
  const isPos = tone === "pos";
  const Icon = isPos ? CheckCircle2 : AlertCircle;
  const color = isPos ? BRAND.primary : BRAND.negative;
  const bg = isPos ? "rgba(37,99,235,0.10)" : "rgba(239,68,68,0.10)";
  const bd = isPos ? "rgba(37,99,235,0.25)" : "rgba(239,68,68,0.25)";

  return (
    <div
      className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-3"
      style={{ borderColor: bd, background: bg }}
      aria-label={label}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className={isPos ? "text-[#22C55E]" : "text-[#EF4444]"} aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.mutedText }}>
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold" style={{ color: BRAND.text }}>
            {value == null ? fallbackText : formatSigned(value)}
          </p>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }} aria-hidden="true">
        {isPos ? "+" : "−"}
      </span>
    </div>
  );
}
