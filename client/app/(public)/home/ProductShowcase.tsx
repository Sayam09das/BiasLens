"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Sparkles,
  ShieldCheck,
  FileText,
  BarChart3,
  AlertTriangle,
  ClipboardCheck,
  Lock,
  CheckCircle2,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.4, delay },
});

/* ── tabs ── */
const tabItems = [
  {
    key: "upload",
    label: "Upload Resume",
    description: "Securely upload resumes and job descriptions into the audit workflow.",
    icon: <Upload className="h-5 w-5" aria-hidden="true" />,
  },
  {
    key: "analysis",
    label: "AI Analysis",
    description: "Generate job-fit scores, skill matching, and structured resume intelligence.",
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
  },
  {
    key: "fairness",
    label: "Fairness Evaluation",
    description: "Surface fairness risks, bias indicators, and counterfactual differences.",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    key: "report",
    label: "Report Generation",
    description: "Export audit-ready reports with explanations, scores, and recommendations.",
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
  },
];

/* ── chart data ── */
const radialData = [
  { name: "Resume Score", value: 92, fill: "#2563EB" },
  { name: "Job Fit",      value: 89, fill: "#7C3AED" },
  { name: "Skills Match", value: 87, fill: "#22C55E" },
];

const areaData = [
  { week: "W1", score: 72, fairness: 60 },
  { week: "W2", score: 78, fairness: 68 },
  { week: "W3", score: 82, fairness: 74 },
  { week: "W4", score: 87, fairness: 80 },
  { week: "W5", score: 89, fairness: 85 },
  { week: "W6", score: 92, fairness: 90 },
];

/* ── gauge bar ── */
function GaugeBar({ label, value, color = "#2563EB" }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#6E6D7A]">{label}</span>
        <span className="text-xs font-semibold text-[#0D0C22]">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#E7E7E9]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        />
      </div>
    </div>
  );
}

const dashboard = {
  status: "Completed",
  resumeScore: 92,
  jobFit: 89,
  skillsMatch: 87,
  fairnessRisk: "Low",
  explainability: "High",
  missingSkills: 3,
};

const riskColor = "bg-[#22C55E]/10 text-[#16A34A] border-[#22C55E]/35";

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = React.useState("upload");

  return (
    <section className="bg-[#F6F8FB]" aria-label="BiasLens Product Showcase">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

        {/* ── Section label ── */}
        <motion.div className="flex items-center justify-center sm:justify-start" {...fadeIn(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]" aria-hidden="true">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            Product Showcase
          </span>
        </motion.div>

        {/* ── Heading ── */}
        <motion.div className="mt-6 max-w-3xl text-center sm:text-left" {...fadeUp(0.06)}>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            See BiasLens in Action
          </h2>
          <p className="mt-4 max-w-[68ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            From resume upload to audit-ready reports, BiasLens gives hiring teams a clear visual workflow for
            analyzing job fit, fairness signals, explainability, and improvement opportunities.
          </p>
        </motion.div>

        {/* ── Main grid ── */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">

          {/* ── Left tabs ── */}
          <motion.div className="lg:col-span-4" {...fadeUp(0.1)}>
            <div className="rounded-[1.8rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_20px_60px_rgba(13,12,34,0.04)]">
              <div className="space-y-2" role="tablist" aria-label="BiasLens workflow steps">
                {tabItems.map((item) => {
                  const isActive = item.key === activeTab;
                  return (
                    <motion.button
                      key={item.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(item.key)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 340, damping: 24 }}
                      className={
                        "group flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition sm:p-4 " +
                        (isActive
                          ? "border-[#2563EB]/35 bg-[#2563EB]/5"
                          : "border-[#E7E7E9] bg-[#FFFFFF] hover:bg-[#F6F8FB]")
                      }
                    >
                      <span
                        className={
                          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border transition sm:h-10 sm:w-10 " +
                          (isActive
                            ? "border-[#2563EB]/40 bg-[#2563EB]/10 text-[#2563EB]"
                            : "border-[#E7E7E9] bg-[#F6F8FB] text-[#0D0C22]")
                        }
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-[#0D0C22]">{item.label}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-[#6E6D7A] sm:text-sm sm:leading-6">{item.description}</span>
                      </span>
                      <span
                        className={
                          "mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition sm:h-8 sm:w-8 " +
                          (isActive
                            ? "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]"
                            : "border-[#E7E7E9] bg-[#FFFFFF] text-[#6E6D7A]")
                        }
                        aria-hidden="true"
                      >
                        <span className={`inline-block h-2 w-2 rounded-full transition ${isActive ? "bg-[#2563EB]" : "bg-[#D1D5DB]"}`} />
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Secure badge */}
              <div className="mt-4 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB] sm:h-10 sm:w-10">
                    <Lock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">Secure Audit Trail</p>
                    <p className="mt-0.5 text-xs leading-5 text-[#6E6D7A] sm:text-sm sm:leading-6">
                      Every decision is recorded for review—so teams can explain and improve outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Center dashboard ── */}
          <motion.div className="lg:col-span-5" {...fadeUp(0.16)}>
            <div className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_30px_90px_rgba(13,12,34,0.06)]">

              {/* header */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] bg-[#F6F8FB] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] sm:h-10 sm:w-10">
                    <ShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">BiasLens Audit Workspace</p>
                    <p className="text-xs text-[#6E6D7A]">Candidate: Senior Product Designer</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
                  {dashboard.status}
                </span>
              </div>

              {/* ── Recharts: Radial score chart ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + "-radial"}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="mt-4 rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4"
                >
                  <p className="mb-1 text-xs font-semibold text-[#0D0C22]">Score Overview</p>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="30%"
                        outerRadius="90%"
                        data={radialData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          minAngle={15}
                          dataKey="value"
                          cornerRadius={8}
                          background={{ fill: "#F3F4F6" }}
                        />
                        <Tooltip
                          formatter={(v) => [`${v}%`]}
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #E7E7E9",
                            fontSize: 12,
                            boxShadow: "0 4px 16px rgba(13,12,34,0.08)",
                          }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* legend */}
                  <div className="mt-2 flex flex-wrap justify-center gap-3">
                    {radialData.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.fill }} />
                        <span className="text-xs text-[#6E6D7A]">{d.name}: <b className="text-[#0D0C22]">{d.value}%</b></span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ── Gauge bars ── */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 space-y-3">
                  <GaugeBar label="Resume Score" value={dashboard.resumeScore} color="#2563EB" />
                  <GaugeBar label="Job Fit" value={dashboard.jobFit} color="#7C3AED" />
                  <GaugeBar label="Skills Match" value={dashboard.skillsMatch} color="#22C55E" />
                </div>

                {/* Fairness risk */}
                <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-[#6E6D7A]">Fairness Risk</p>
                    <span className={"inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold " + riskColor}>
                      <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                      {dashboard.fairnessRisk}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
                      <ShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#0D0C22]">Explainability: {dashboard.explainability}</p>
                      <p className="mt-0.5 text-xs leading-5 text-[#6E6D7A]">Signals surfaced for review</p>
                    </div>
                  </div>
                  {/* missing skills dots */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-[#6E6D7A] mb-2">
                      <span>Missing Skills</span>
                      <span className="font-semibold text-[#0D0C22]">{dashboard.missingSkills}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={"h-2 flex-1 rounded-full " + (i < dashboard.missingSkills ? "bg-[#F59E0B]" : "bg-[#E7E7E9]")}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Recharts: Area trend chart ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + "-area"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35 }}
                  className="mt-4 rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-[#0D0C22]">Score & Fairness Trend</p>
                    <span className="text-xs text-[#6E6D7A]">Last 6 weeks</span>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                        <defs>
                          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="fairnessGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.18} />
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 10,
                            border: "1px solid #E7E7E9",
                            fontSize: 11,
                            boxShadow: "0 4px 12px rgba(13,12,34,0.08)",
                          }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} fill="url(#scoreGrad)" name="Score" dot={false} />
                        <Area type="monotone" dataKey="fairness" stroke="#22C55E" strokeWidth={2} fill="url(#fairnessGrad)" name="Fairness" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ── Bottom cards ── */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Improvement suggestions */}
                <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] text-[#2563EB]">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-[#0D0C22]">Improvement Suggestions</p>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {[
                      "Add portfolio artifacts tied to strategy outcomes.",
                      "Highlight measurable cross-team collaboration.",
                      "Include fairness-aware evaluation examples.",
                    ].map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]" aria-hidden="true">
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                        <span className="text-xs leading-5 text-[#6E6D7A]">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Audit report summary */}
                <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] text-[#2563EB]">
                      <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-[#0D0C22]">Audit Report</p>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Resume Score", value: `${dashboard.resumeScore}%` },
                      { label: "Job Fit",       value: `${dashboard.jobFit}%` },
                      { label: "Fairness Risk", value: dashboard.fairnessRisk },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-xs text-[#6E6D7A]">{row.label}</span>
                        <span className="text-xs font-semibold text-[#0D0C22]">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2">
                    <p className="text-xs font-semibold text-[#0D0C22]">Report Readiness</p>
                    <p className="mt-0.5 text-xs leading-5 text-[#6E6D7A]">
                      Audit artifacts ready with explainability checks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right insight cards ── */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {[
                {
                  title: "Explainable Decisions",
                  description: "Every recommendation includes interpretable signals so teams understand what influenced outcomes.",
                  icon: <BarChart3 className="h-5 w-5" aria-hidden="true" />,
                },
                {
                  title: "Responsible AI Signals",
                  description: "Bias indicators and fairness risks are surfaced before decisions affect candidates.",
                  icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
                },
                {
                  title: "Secure Audit Trail",
                  description: "Protected workflows record scoring, fairness checks, and report generation for review.",
                  icon: <Lock className="h-5 w-5" aria-hidden="true" />,
                },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_20px_60px_rgba(13,12,34,0.04)] cursor-default sm:p-5"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2563EB]/60 via-[#2563EB]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] text-[#2563EB] transition-colors duration-300 group-hover:border-[#2563EB]/25 group-hover:bg-[#2563EB]/8">
                      {c.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22] sm:text-base">{c.title}</p>
                      <p className="mt-1.5 text-xs leading-5 text-[#6E6D7A] sm:text-sm sm:leading-6">{c.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
