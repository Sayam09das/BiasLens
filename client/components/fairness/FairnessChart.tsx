"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  BarChart,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Info,
  Sparkles,
} from "lucide-react";

// NOTE: This file intentionally avoids using any backend wiring.

type TrendPoint = { label: string; fairnessScore: number; parityGap: number; equalizedOdds: number; counterfactualConsistency: number };

type GroupScorePoint = { group: string; score: number };

type FairnessChartValues = {
  fairnessScore: number; // 0..100
  parityGap: number; // 0..1 lower better
  equalizedOdds: number; // 0..1 lower better
  counterfactualConsistency: number; // 0..1 higher better
  groupComparison: GroupScorePoint[];
  trend: TrendPoint[];
};

type FairnessChartProps = {
  values?: Partial<FairnessChartValues> | null;
  className?: string;
  title?: string;
  description?: string;
};

const BRAND = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  border: "#E7E7E9",
  mutedText: "#6E6D7A",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatPct01(n: number) {
  const v = clamp(n, 0, 1);
  return `${(v * 100).toFixed(1)}%`;
}

function riskToneFromScore(score: number): "success" | "warning" | "danger" {
  const s = clamp(score, 0, 100);
  if (s >= 75) return "success";
  if (s >= 50) return "warning";
  return "danger";
}

function GaugeCard({ score }: { score: number }) {
  const tone = riskToneFromScore(score);
  const color = tone === "success" ? BRAND.success : tone === "warning" ? BRAND.warning : BRAND.danger;

  return (
    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Fairness Score</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">{clamp(score, 0, 100).toFixed(0)}</p>
          <p className="mt-1 text-sm font-semibold" style={{ color }}>
            {tone === "success" ? "Healthy" : tone === "warning" ? "Caution" : "High risk"}
          </p>
        </div>

        <span
          className="inline-flex items-center rounded-[1.25rem] border px-3 py-2 text-xs font-semibold"
          style={{ background: tone === "success" ? "rgba(34,197,94,0.10)" : tone === "warning" ? "rgba(245,158,11,0.10)" : "rgba(239,68,68,0.10)", borderColor: tone === "success" ? "rgba(34,197,94,0.25)" : tone === "warning" ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)", color }}
          aria-label={`Fairness score status ${tone}`}
        >
          {tone === "success" ? <CheckCircle2 size={14} aria-hidden="true" /> : tone === "warning" ? <Info size={14} aria-hidden="true" /> : <AlertCircle size={14} aria-hidden="true" />} 
          <span className="ml-2">{tone}</span>
        </span>
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-[#E7E7E9]" aria-hidden="true">
        <div
          className="h-2 rounded-full"
          style={{ width: `${clamp(score, 0, 100)}%`, background: color }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#6E6D7A]" aria-hidden="true">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}

export default function FairnessChart({ values, className, title, description }: FairnessChartProps) {
  const merged: FairnessChartValues = React.useMemo(() => {
    const v = values ?? {};
    return {
      fairnessScore: typeof v.fairnessScore === "number" ? v.fairnessScore : 0,
      parityGap: typeof v.parityGap === "number" ? v.parityGap : 0,
      equalizedOdds: typeof v.equalizedOdds === "number" ? v.equalizedOdds : 0,
      counterfactualConsistency:
        typeof v.counterfactualConsistency === "number" ? v.counterfactualConsistency : 0,
      groupComparison: Array.isArray(v.groupComparison) ? v.groupComparison : [],
      trend: Array.isArray(v.trend) ? v.trend : [],
    };
  }, [values]);

  const riskTone = riskToneFromScore(merged.fairnessScore);
  const fairnessColor = riskTone === "success" ? BRAND.success : riskTone === "warning" ? BRAND.warning : BRAND.danger;

  const barData = merged.groupComparison.map((g) => ({ group: g.group, score: clamp(g.score, 0, 100) }));

  const lineData = merged.trend.map((t) => ({
    label: t.label,
    fairnessScore: clamp(t.fairnessScore, 0, 100),
    parityGap: clamp(t.parityGap, 0, 1) * 100,
    equalizedOdds: clamp(t.equalizedOdds, 0, 1) * 100,
    counterfactualConsistency: clamp(t.counterfactualConsistency, 0, 1) * 100,
  }));

  const progressPct = clamp(merged.fairnessScore, 0, 100);

  return (
    <div className={className}>
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Fairness analytics</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">{title ?? "Fairness metrics overview"}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">{description ?? "Responsive charts with accessible titles, legends, and live backend fairness metrics."}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm font-semibold text-[#6E6D7A]" aria-label={`Current fairness score ${progressPct.toFixed(0)}`}>
              <Sparkles size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
              Fairness Score: {progressPct.toFixed(0)}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <GaugeCard score={merged.fairnessScore} />

            <div className="mt-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Parity Gap</p>
                  <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{formatPct01(merged.parityGap)}</p>
                  <p className="mt-1 text-xs font-semibold text-[#6E6D7A]">Lower indicates more parity</p>
                </div>
                <span aria-hidden="true" className="text-xs font-semibold rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1" style={{ color: BRAND.primary }}>Parity</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Equalized Odds</p>
                  <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{formatPct01(merged.equalizedOdds)}</p>
                  <p className="mt-1 text-xs font-semibold text-[#6E6D7A]">Lower indicates less separation</p>
                </div>
                <span aria-hidden="true" className="text-xs font-semibold rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1" style={{ color: BRAND.primary }}>Odds</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Counterfactual Consistency</p>
                  <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{formatPct01(merged.counterfactualConsistency)}</p>
                  <p className="mt-1 text-xs font-semibold text-[#6E6D7A]">Higher indicates robustness</p>
                </div>
                <span aria-hidden="true" className="text-xs font-semibold rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1" style={{ color: BRAND.primary }}>CF</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">Group score comparison</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0C22]">Bar chart</p>
                    <p className="mt-1 text-xs text-[#6E6D7A]">Compare fairness score by candidate group.</p>
                  </div>
                  <span className="inline-flex items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1 text-xs font-semibold text-[#6E6D7A]" aria-label="Legend">
                    <Circle size={10} className="mr-2 text-[#2563EB]" aria-hidden="true" /> Score
                  </span>
                </div>

                <div className="mt-4 h-[260px]" role="img" aria-label="Bar chart comparing group fairness scores">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(231,231,233,1)" />
                      <XAxis dataKey="group" stroke={BRAND.mutedText} tick={{ fontSize: 12 }} />
                      <YAxis stroke={BRAND.mutedText} tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip
                        content={({ active, payload, label }) => (
                          <div>
                            {active && payload && payload.length ? (
                              <div className="rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] p-3 shadow-[0_16px_48px_rgba(13,12,34,0.08)]">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">{label}</p>
                                <p className="mt-2 text-sm font-semibold text-[#0D0C22]">Score: {payload[0].value?.toFixed(0)}%</p>
                              </div>
                            ) : null}
                          </div>
                        )}
                      />
                      <Legend />
                      <Bar dataKey="score" name="Score" fill={BRAND.primary} radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
              <div className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">Fairness trend</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0C22]">Line chart</p>
                    <p className="mt-1 text-xs text-[#6E6D7A]">Fairness score + supporting fairness gaps over time.</p>
                  </div>
                </div>

                <div className="mt-4 h-[260px]" role="img" aria-label="Line chart showing fairness trend">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(231,231,233,1)" />
                      <XAxis dataKey="label" stroke={BRAND.mutedText} tick={{ fontSize: 12 }} />
                      <YAxis stroke={BRAND.mutedText} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="fairnessScore" name="Fairness Score" stroke={BRAND.primary} strokeWidth={3} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="counterfactualConsistency" name="Counterfactual Consistency" stroke={BRAND.success} strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="parityGap" name="Parity Gap" stroke={BRAND.warning} strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="equalizedOdds" name="Equalized Odds" stroke={BRAND.danger} strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Interpretation</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0C22]">Higher fairness score is better.</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Lower is better</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0C22]">Parity gap & equalized odds gaps.</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Robustness</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0C22]">Counterfactual consistency increases confidence.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
              <div className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">Fairness score progress</p>
                    <p className="mt-1 text-sm font-semibold text-[#0D0C22]">Progress chart</p>
                    <p className="mt-1 text-xs text-[#6E6D7A]">A quick visual representation of overall fairness.</p>
                  </div>
                  <span className="inline-flex items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1 text-xs font-semibold text-[#6E6D7A]" aria-label="Progress percent">
                    {progressPct.toFixed(0)}%
                  </span>
                </div>

                <div className="mt-4">
                  <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                    <div className="h-3 w-full rounded-full bg-[#E7E7E9]" aria-hidden="true">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-3 rounded-full"
                        style={{ background: fairnessColor }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#6E6D7A]" aria-hidden="true">
                      <span>0</span>
                      <span>Fairness score</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Parity Gap</p>
                      <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{formatPct01(merged.parityGap)}</p>
                      <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">Lower indicates more equal outcomes.</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Counterfactual Consistency</p>
                      <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{formatPct01(merged.counterfactualConsistency)}</p>
                      <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">Higher indicates stable recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
}
