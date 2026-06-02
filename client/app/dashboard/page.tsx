"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Brain,
  Clock3,
  FileText,
  History,
  Loader2,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Audit, useAuditStore } from "@/store/audit.store";

/* ─────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────── */

/** Fade + slide up — used on containers */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Stagger children */
const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Card pop-in */
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Slide-in from left for list rows */
const rowVariant: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────────────────────────────────
   Color maps
───────────────────────────────────────────── */
const RISK_COLOR: Record<string, string> = {
  Low:      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Moderate: "bg-amber-50   text-amber-700   ring-1 ring-amber-200",
  High:     "bg-red-50     text-red-700     ring-1 ring-red-200",
};

const STATUS_META: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  COMPLETED:  { label: "Completed",  color: "text-emerald-600", dot: "bg-emerald-500" },
  PROCESSING: { label: "Processing", color: "text-amber-600",   dot: "bg-amber-500 animate-pulse" },
  QUEUED:     { label: "Queued",     color: "text-slate-500",   dot: "bg-slate-400" },
  FAILED:     { label: "Failed",     color: "text-red-600",     dot: "bg-red-500" },
};

const normalizeStatus = (s: string) => s.toUpperCase();

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Skeleton shimmer row */
function SkeletonRow() {
  return (
    <motion.div
      className="h-[72px] rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      style={{ backgroundSize: "200% 200%" }}
    />
  );
}

/** Stat card */
function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  bg,
  accentBorder,
  index,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ElementType;
  tone: string;
  bg: string;
  accentBorder: string;
  index: number;
}) {
  return (
    <motion.div variants={cardVariant} custom={index}>
      <motion.div
        className={`group relative overflow-hidden rounded-2xl border bg-white/90 p-5 shadow-sm transition-shadow hover:shadow-md ${accentBorder}`}
        whileHover={{ y: -3, transition: { duration: 0.22, ease: "easeOut" } }}
      >
        {/* Subtle corner glow */}
        <div
          className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 blur-2xl ${bg}`}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <motion.p
              className="mt-2 text-3xl font-bold tracking-tight text-slate-900"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.15 + index * 0.06 }}
            >
              {value}
            </motion.p>
            <p className="mt-1.5 text-xs text-slate-500">{detail}</p>
          </div>

          <motion.span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}
            whileHover={{ scale: 1.12, rotate: -6 }}
            transition={{ type: "spring", stiffness: 340, damping: 20 }}
          >
            <Icon className={tone} size={20} strokeWidth={2} />
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Pipeline audit row */
function AuditRow({
  audit,
  index,
}: {
  audit: Audit;
  index: number;
}) {
  const status = normalizeStatus(audit.status);
  const meta   = STATUS_META[status] ?? STATUS_META.QUEUED;

  return (
    <motion.div
      variants={rowVariant}
      custom={index}
      className="group flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-colors hover:border-[#1463ff]/20 hover:bg-[#f0f5ff]/60 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Status dot */}
        <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {audit.title}
          </p>
          <p className={`mt-0.5 text-xs font-medium ${meta.color}`}>
            {meta.label}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pl-5 sm:pl-0">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            RISK_COLOR[audit.jobRole ?? ""] ?? RISK_COLOR.Low
          }`}
        >
          {audit.jobRole ?? "Pending review"}
        </span>
        <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
          <Link
            href={`/dashboard/audits/${audit.id}`}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1463ff] transition-colors hover:bg-[#1463ff]/10"
          >
            Open
            <ArrowUpRight size={13} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

/** Queue item */
function QueueItem({
  // NOTE: used in the existing dashboard pipeline card

  icon: Icon,
  iconClass,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      variants={rowVariant}
      custom={index}
      className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-colors hover:border-[#1463ff]/20 hover:bg-[#f0f5ff]/40"
    >
      <span className={`mt-0.5 shrink-0 ${iconClass}`}>
        <Icon size={17} strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function DashboardPage() {
  const { history, isLoading } = useAuditStore();

  const completed  = history.filter((a) => normalizeStatus(a.status) === "COMPLETED").length;
  const processing = history.filter((a) =>
    ["PROCESSING", "QUEUED"].includes(normalizeStatus(a.status))
  ).length;
  const fairnessAlerts = history.filter((a) => normalizeStatus(a.status) === "FAILED").length;
  const failed = fairnessAlerts;
  const total   = history.length;
  const recent  = history.slice(0, 5);

  const stats = [
    {
      label:        "Total audits",
      value:        isLoading ? "—" : String(total),
      detail:       `${processing} currently processing`,
      icon:         Activity,
      tone:         "text-[#1463ff]",
      bg:           "bg-[#dbe8ff]",
      accentBorder: "border-[#1463ff]/10",
    },
    {
      label:        "Completed",
      value:        isLoading ? "—" : String(completed),
      detail:       "Reports ready to export",
      icon:         TrendingUp,
      tone:         "text-emerald-600",
      bg:           "bg-emerald-50",
      accentBorder: "border-emerald-100",
    },
    {
      label:        "Fairness alerts",
      value:        isLoading ? "—" : String(fairnessAlerts),
      detail:       fairnessAlerts > 0 ? `${fairnessAlerts} require review` : "All clear",
      icon:         ShieldCheck,
      tone:         "text-amber-500",
      bg:           "bg-amber-50",
      accentBorder: "border-amber-100",
    },
    {
      label:        "Reports generated",
      value:        isLoading ? "—" : String(completed),
      detail:       "Audit-ready exports",
      icon:         BadgeCheck,
      tone:         "text-slate-600",
      bg:           "bg-slate-100",
      accentBorder: "border-slate-200/80",
    },
  ] as const;

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* ── Hero greeting ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1463ff]">
            BiasLens · Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Decision Intelligence Hub
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-700">
            Every resume. Every signal. Every decision.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {isLoading
              ? "Loading your latest audit signals..."
              : `${completed} completed audits • ${fairnessAlerts} fairness alerts • ${completed} reports ready`}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
        >
          <Button
            asChild
            className="mt-3 rounded-full bg-[#1463ff] px-5 text-sm font-semibold shadow-[0_4px_14px_rgba(20,99,255,0.35)] hover:bg-[#0f4fcb] sm:mt-0"
          >
            <Link href="/dashboard/audits">+ New audit</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* ── Stats grid ── */}
      <motion.section
        className="grid gap-3 grid-cols-2 sm:gap-4 xl:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </motion.section>

      {/* ── BiasLens AI Insights ── */}
      <motion.section
        className="space-y-4 sm:space-y-5"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.12}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              BiasLens AI Insights
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#0D0C22] sm:text-2xl">
              AI-powered hiring intelligence, fairness &amp; explainability
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[#6E6D7A]">
              AI-powered recommendations and observations generated from your latest resume audits.
            </p>
          </div>

          {/* AI assistant badge */}
          <div className="flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-2 shadow-sm">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#2563EB]/10">
              <Bot size={16} className="text-[#2563EB]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[#0D0C22]">AI Copilot</p>
              <p className="text-[10px] text-[#6E6D7A]">Live insights · Audit-linked</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {/* Featured insight */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] shadow-sm lg:col-span-2"
            variants={cardVariant}
            initial="hidden"
            animate="show"
            custom={0}
          >
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#2563EB]/10 blur-2xl" />
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-[#22C55E]/10 blur-2xl" />
            <div className="relative p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-semibold text-[#15803D] ring-1 ring-[#22C55E]/20">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#22C55E]/15">
                    <CheckCircle2 size={14} className="text-[#15803D]" />
                  </span>
                  Healthy
                </span>
                <span className="inline-flex items-center rounded-full bg-[#2563EB]/10 px-3 py-1 text-[11px] font-semibold text-[#2563EB] ring-1 ring-[#2563EB]/20">
                  Fairness Verified
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold tracking-tight text-[#0D0C22] sm:text-xl">
                All Fairness Checks Passed
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6D7A]">
                No significant fairness risks detected across active resume audits. Counterfactual testing and fairness monitoring indicate stable scoring behavior.
              </p>

              {/* Example metrics */}
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6E6D7A]">
                    AI Confidence
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[#0D0C22]">96%</p>
                </div>
                <div className="rounded-xl border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6E6D7A]">
                    Fairness Score
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[#0D0C22]">94%</p>
                </div>
                <div className="rounded-xl border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6E6D7A]">
                    Audit Coverage
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[#0D0C22]">100%</p>
                </div>
              </div>

              {/* Risk level / recommendations indicator */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E7E7E9] bg-[#FFFFFF] p-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#2563EB]/10">
                    <ShieldCheck size={16} className="text-[#2563EB]" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#0D0C22]">Recommendation</p>
                    <p className="text-[11px] text-[#6E6D7A]">Proceed to export with confidence</p>
                  </div>
                </div>

                <Link
                  href="/dashboard/fairness"
                  className="group inline-flex items-center gap-2 rounded-xl border border-[#E7E7E9] bg-white px-3 py-2 text-xs font-semibold text-[#2563EB] shadow-[0_10px_30px_rgba(37,99,235,0.08)] transition hover:border-[#2563EB]/30 hover:bg-[#F6F8FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
                >
                  Review Fairness
                  <span className="inline-flex transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Supporting insights */}
          <div className="grid gap-4 lg:col-span-2 lg:grid-cols-1">
            {[ 
              {
                title: "Resume Quality Insights",
                description: "2 resumes are missing measurable achievements and quantified business impact.",
                priority: "Medium",
                priorityTone: "text-[#F59E0B] bg-[#F59E0B]/10 ring-[#F59E0B]/20",
                actionLabel: "Review Candidates",
                href: "/dashboard/audits",
                iconBg: "bg-[#F59E0B]/10",
              },
              {
                title: "Explainability Signals",
                description: "3 candidates show strong experience alignment but limited supporting evidence.",
                priority: "Medium",
                priorityTone: "text-[#F59E0B] bg-[#F59E0B]/10 ring-[#F59E0B]/20",
                actionLabel: "View Explanations",
                href: "/dashboard/explainability",
                iconBg: "bg-[#2563EB]/10",
              },
              {
                title: "Reporting Status",
                description: "All generated reports are audit-ready and available for export.",
                priority: "Low",
                priorityTone: "text-[#22C55E] bg-[#22C55E]/10 ring-[#22C55E]/20",
                actionLabel: "Open Reports",
                href: "/dashboard/reports",
                iconBg: "bg-[#22C55E]/10",
              },
            ].map((insight, idx) => (
              <motion.div
                key={insight.title}
                className="relative overflow-hidden rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] shadow-sm"
                variants={cardVariant}
                initial="hidden"
                animate="show"
                custom={0.08 + idx}
              >
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#2563EB]/5 blur-2xl" />
                <div className="relative p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`grid h-10 w-10 place-items-center rounded-xl ${insight.iconBg}`}>
                          {idx === 0 ? <Sparkles size={18} className="text-[#2563EB]" /> : idx === 1 ? <Brain size={18} className="text-[#2563EB]" /> : <FileText size={18} className="text-[#22C55E]" />}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${insight.priorityTone}`}>
                          {insight.priority}
                        </span>
                      </div>

                      <h4 className="mt-3 text-sm font-bold tracking-tight text-[#0D0C22]">
                        {insight.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-[#6E6D7A]">
                        {insight.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">
                      Confidence: {idx === 0 ? "82%" : idx === 1 ? "89%" : "96%"}
                    </p>
                    <Link
                      href={insight.href}
                      className="group inline-flex items-center gap-2 rounded-xl border border-[#E7E7E9] bg-white px-3 py-2 text-xs font-semibold text-[#2563EB] transition hover:border-[#2563EB]/30 hover:bg-[#F6F8FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
                    >
                      {insight.actionLabel}
                      <span className="inline-flex transition-transform duration-200 group-hover:translate-x-0.5">
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insight Categories (Smart suggestion cards) */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {["Fairness", "Explainability", "Resume Quality", "Audit Readiness", "AI Recommendations"].map((cat) => (
            <motion.div
              key={cat}
              className="rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-[#2563EB]/40"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs font-semibold text-[#0D0C22]">{cat}</p>
              <p className="mt-1 text-[11px] text-[#6E6D7A]">
                {cat === "Fairness" ? "Verified stability" : cat === "Explainability" ? "Evidence-backed reasoning" : cat === "Resume Quality" ? "Impact &amp; metrics checks" : cat === "Audit Readiness" ? "Export-ready coverage" : "Actionable next steps"}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Audit Queue ── */}
      <motion.section
        className="space-y-4 sm:space-y-5"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.1}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              Recent Activity
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#0D0C22] sm:text-2xl">
              Track audits, reports, fairness reviews &amp; AI actions
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[#6E6D7A]">
              Track the latest audit events, report actions, fairness reviews, and AI-powered hiring decisions.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold text-[#0D0C22]">Today&apos;s Activity</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Audits Completed", value: 3 },
                { label: "Reports Generated", value: 3 },
                { label: "Fairness Reviews", value: 3 },
                { label: "Exports", value: 2 },
              ].map((m) => (
                <div key={m.label} className="min-w-0">
                  <p className="text-[11px] font-semibold text-[#6E6D7A]">{m.label}</p>
                  <p className="mt-0.5 text-base font-bold text-[#0D0C22]">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] shadow-sm">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E7E7E9]">
              <p className="text-sm font-semibold text-[#0D0C22]">Activity Feed</p>
              <span className="text-[11px] font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2 py-1 rounded-full">Newest first</span>
            </div>

            <div className="max-h-[520px] overflow-y-auto p-4">
              {[
                {
                  type: "Upload",
                  statusTone: "success",
                  title: "Resume Uploaded",
                  description: "Sayam Das.pdf uploaded for Full Stack Developer audit.",
                  time: "2 minutes ago",
                },
                {
                  type: "Audit",
                  statusTone: "info",
                  title: "Audit Completed",
                  description: "Resume analysis completed successfully. Resume Score: 92% · Job Fit: 89%",
                  time: "5 minutes ago",
                },
                {
                  type: "Fairness",
                  statusTone: "success",
                  title: "Fairness Review Passed",
                  description: "All fairness checks passed. No significant bias signals detected.",
                  time: "8 minutes ago",
                },
                {
                  type: "Report",
                  statusTone: "info",
                  title: "Report Generated",
                  description: "Audit report successfully generated and ready for export.",
                  time: "12 minutes ago",
                },
                {
                  type: "Export",
                  statusTone: "neutral",
                  title: "PDF Exported",
                  description: "Report REP-001 exported as PDF.",
                  time: "15 minutes ago",
                },
                {
                  type: "AI Agent",
                  statusTone: "warning",
                  title: "AI Agent Recommendation",
                  description: "AI Agent identified missing quantified achievements.",
                  time: "18 minutes ago",
                },
              ].map((event, idx) => {
                const tone = event.statusTone;


                const iconWrapBg =
                  tone === "success"
                    ? "bg-[#22C55E]/10"
                    : tone === "warning"
                      ? "bg-[#F59E0B]/10"
                      : tone === "info"
                        ? "bg-[#2563EB]/10"
                        : "bg-[#F6F8FB]";

                const iconFg =
                  tone === "success"
                    ? "text-[#22C55E]"
                    : tone === "warning"
                      ? "text-[#F59E0B]"
                      : tone === "info"
                        ? "text-[#2563EB]"
                        : "text-[#6E6D7A]";

                const Icon =
                  event.type === "Upload"
                    ? Upload
                    : event.type === "Audit"
                      ? Sparkles
                      : event.type === "Fairness"
                        ? ShieldCheck
                        : event.type === "Report"
                          ? FileText
                          : event.type === "Export"
                            ? FileText
                            : Bot;

                const badgeBg =
                  tone === "success"
                    ? "bg-[#ECFDF5] text-[#15803D] ring-[#22C55E]/20"
                    : tone === "warning"
                      ? "bg-[#FFFBEB] text-[#B45309] ring-[#F59E0B]/20"
                      : tone === "info"
                        ? "bg-[#EFF6FF] text-[#2563EB] ring-[#2563EB]/20"
                        : "bg-[#F6F8FB] text-[#6E6D7A] ring-[#E7E7E9]";

                return (
                  <div
                    key={event.title}
                    className="relative flex gap-4 pb-4 last:pb-0"
                  >
                    {/* Timeline */}
                    <div className="relative flex w-10 flex-col items-center">
                      <div className="z-10 grid h-10 w-10 place-items-center rounded-xl border border-[#E7E7E9] bg-white">
                        <span className={["grid h-9 w-9 place-items-center rounded-xl", iconWrapBg].join(" ")}
                          >
                          <Icon size={18} className={iconFg} />
                        </span>
                      </div>
                      {idx !== 5 && (
                        <div className="absolute top-10 h-full w-px bg-[#E7E7E9]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0D0C22] truncate">{event.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-[#6E6D7A]">{event.description}</p>
                        </div>
                        <span className={["inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1", badgeBg].join(" ")}
                          >
                          {event.type}
                        </span>
                      </div>
                      <div className="mt-3 text-[11px] font-semibold text-[#94A3B8]">
                        {event.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E7E7E9]">
              <p className="text-sm font-semibold text-[#0D0C22]">AI Signal Summary</p>
              <p className="mt-1 text-xs text-[#6E6D7A]">What changed most recently in your workflow.</p>
            </div>
            <div className="p-4 space-y-3">
              {[ 
                { title: "Audit readiness", value: "High", tone: "success" },
                { title: "Fairness signals", value: "Verified", tone: "success" },
                { title: "Explainability", value: "Ready", tone: "info" },
                { title: "AI recommendations", value: "Review suggested", tone: "warning" },
              ].map((s) => (
                <div key={s.title} className="rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-[#6E6D7A]">{s.title}</p>
                    <span
                      className={
                        s.tone === "success"
                          ? "inline-flex items-center rounded-full bg-[#ECFDF5] px-3 py-1 text-[11px] font-semibold text-[#15803D] ring-1 ring-[#22C55E]/20"
                          : s.tone === "warning"
                            ? "inline-flex items-center rounded-full bg-[#FFFBEB] px-3 py-1 text-[11px] font-semibold text-[#B45309] ring-1 ring-[#F59E0B]/20"
                            : "inline-flex items-center rounded-full bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold text-[#2563EB] ring-1 ring-[#2563EB]/20"
                      }
                    >
                      {s.value}
                    </span>
                  </div>
                </div>
              ))}
              <Link
                href="/dashboard/reports"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E7E7E9] bg-white px-4 py-3 text-sm font-semibold text-[#2563EB] shadow-sm transition hover:border-[#2563EB]/30 hover:bg-[#F6F8FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
              >
                Open reports
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Quick Actions ── */}
      <motion.section
        className="space-y-4 sm:space-y-5"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.15}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              Quick Actions
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#0D0C22] sm:text-2xl">
              One-click hiring workflows for recruiters
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[#6E6D7A]">
              Jump directly into resume auditing, fairness analysis, reporting, and AI-powered hiring workflows.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
              {
                title: "New Audit",
                description: "Start a new resume audit and generate hiring intelligence.",
                href: "/dashboard/audits/new",
                icon: PlusCircle,
                iconBg: "bg-[#1463ff]/10",
                iconFg: "text-[#2563EB]",
              },
              {
                title: "Upload Resume",
                description: "Upload a candidate resume for analysis and scoring.",
                href: "/dashboard/audits/new",
                icon: Upload,
                iconBg: "bg-[#2563EB]/10",
                iconFg: "text-[#2563EB]",
              },
            {
              title: "Generate Report",
              description: "Create an audit-ready PDF report with explainability insights.",
              href: "/dashboard/reports",
                icon: FileText,
              iconBg: "bg-[#1463ff]/10",
              iconFg: "text-[#2563EB]",
            },
            {
              title: "Open AI Agent",
              description: "Use the BiasLens AI Agent to review, explain, and improve hiring decisions.",
              href: "/ai-agent",
                icon: Bot,
              iconBg: "bg-[#1463ff]/10",
              iconFg: "text-[#2563EB]",
            },
            {
              title: "Fairness Center",
              description: "Review fairness metrics, bias signals, and counterfactual analysis.",
              href: "/dashboard/fairness",
                icon: ShieldCheck,
              iconBg: "bg-[#22c55e]/10",
              iconFg: "text-[#22c55e]",
            },
            {
              title: "Audit History",
              description: "Browse completed audits, reports, and compliance records.",
              href: "/dashboard/audits",
                icon: History,
              iconBg: "bg-[#1463ff]/10",
              iconFg: "text-[#2563EB]",
            },
          ].map((action, idx) => {
            // Avoid react element type import gymnastics from require(); recover the component type.
            const Icon = action.icon as React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
            return (
              <motion.div
                key={action.title}
                custom={idx}
                variants={cardVariant}
                initial="hidden"
                animate="show"
              >
                <Link
                  href={action.href}
                  className="group block rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-sm transition-all will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={[
                        "mt-0.5 grid h-11 w-11 place-items-center rounded-xl transition-colors",
                        action.iconBg,
                      ].join(" ")}
                    >
                      <Icon
                        size={18}
                        strokeWidth={2.2}
                        className={["transition-transform duration-200", action.iconFg, "group-hover:scale-105"].join(" ")}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold tracking-tight text-[#0D0C22]">
                        {action.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#6E6D7A]">
                        {action.description}
                      </p>
                    </div>

                    <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#E7E7E9] bg-white/70 text-[#2563EB] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:border-[#2563EB]/30">
                      <ArrowUpRight size={14} strokeWidth={2.5} />
                    </span>
                  </div>

                  <span className="pointer-events-none mt-4 block h-[1px] w-full bg-gradient-to-r from-transparent via-[#1463ff]/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Main 2-col section ── */}
      <motion.section
        className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.2}
      >
        {/* Pipeline card */}
        <motion.div
          variants={cardVariant}
          initial="hidden"
          animate="show"
        >
          <Card className="rounded-3xl border-slate-200/70 bg-white/95 shadow-sm">
            <CardHeader className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
              <div className="min-w-0">
                <CardTitle className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Audit pipeline
                </CardTitle>
                <CardDescription className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  Live hiring intelligence — scoring, fairness monitoring &amp; reporting.
                </CardDescription>
              </div>
              {/* Status chips */}
              <div className="flex shrink-0 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {completed} done
                </span>
                {processing > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                    {processing} live
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              {/* Loading skeletons */}
              {isLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && recent.length === 0 && (
                <motion.div
                  className="flex flex-col items-center gap-3 py-12 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <Activity size={22} className="text-slate-400" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">No audits yet</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Upload a resume to start your first audit.
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="mt-1 rounded-full bg-[#1463ff] text-xs hover:bg-[#0f4fcb]"
                  >
                    <Link href="/dashboard/audits">Get started</Link>
                  </Button>
                </motion.div>
              )}

              {/* Audit rows */}
              {!isLoading && recent.length > 0 && (
                <motion.div
                  className="space-y-2.5"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {recent.map((audit, i) => (
                    <AuditRow key={audit.id} audit={audit} index={i} />
                  ))}
                </motion.div>
              )}

              {/* Footer link */}
              {!isLoading && total > 5 && (
                <motion.div
                  className="mt-4 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href="/dashboard/audits"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1463ff] hover:underline"
                  >
                    View all {total} audits
                    <ArrowUpRight size={13} />
                  </Link>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <div className="flex flex-col gap-5 sm:gap-6">

          {/* Recommendations card */}
          <motion.div
            variants={cardVariant}
            initial="hidden"
            animate="show"
            custom={0.1}
          >
            <Card className="overflow-hidden rounded-3xl border-[#dbe8ff] shadow-sm">
              {/* Blue gradient top strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#1463ff] via-[#3b82f6] to-[#6366f1]" />
              <CardContent className="bg-gradient-to-b from-[#f0f5ff] to-white p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1463ff]/10">
                    <Sparkles size={14} className="text-[#1463ff]" />
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-[#1463ff]">
                    BiasLens AI
                  </span>
                </div>

                <motion.h2
                  className="mt-3 text-base font-bold leading-snug tracking-tight text-slate-900 sm:text-lg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  {failed > 0
                    ? `Review ${failed} fairness alert${failed > 1 ? "s" : ""} before publishing`
                    : "All fairness checks passed — ready to publish"}
                </motion.h2>

                <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  {failed > 0
                    ? "Potential drift detected in screening outcomes. Review before exporting."
                    : "No anomalies detected across all active hiring audits."}
                </p>

                {/* Status pill */}
                <motion.div
                  className="mt-3"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.35 }}
                >
                  {failed > 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600 ring-1 ring-red-200">
                      <AlertTriangle size={11} />
                      Action required
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <CheckCircle2 size={11} />
                      All systems healthy
                    </span>
                  )}
                </motion.div>

                <motion.div
                  className="mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22 }}
                >
                  <Button
                    variant="outline"
                    asChild
                    className="rounded-full border-[#dbe8ff] bg-white text-xs font-semibold text-[#1463ff] hover:bg-[#f0f5ff] sm:text-sm"
                  >
                    <Link href="/dashboard/fairness">Open fairness center →</Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's queue */}
          <motion.div
            variants={cardVariant}
            initial="hidden"
            animate="show"
            custom={0.2}
          >
            <Card className="rounded-3xl border-slate-200/70 bg-white/95 shadow-sm">
              <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
                <CardTitle className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  Today&apos;s queue
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Priority work items for your team.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                <motion.div
                  className="space-y-2.5"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  <QueueItem
                    icon={processing > 0 ? Loader2 : Clock3}
                    iconClass={processing > 0 ? "text-amber-500 animate-spin" : "text-[#1463ff]"}
                    title={
                      processing > 0
                        ? `${processing} audit${processing > 1 ? "s" : ""} processing`
                        : "No audits in progress"
                    }
                    description={
                      processing > 0
                        ? "Results will appear in the pipeline once complete."
                        : "Upload a resume to start a new audit."
                    }
                    index={0}
                  />
                  <QueueItem
                    icon={ShieldCheck}
                    iconClass="text-emerald-500"
                    title={
                      completed > 0
                        ? `${completed} completed audit${completed > 1 ? "s" : ""} ready`
                        : "No completed audits yet"
                    }
                    description={
                      completed > 0
                        ? `Audit evidence available for ${completed} role${completed > 1 ? "s" : ""}.`
                        : "Completed audits will appear here."
                    }
                    index={1}
                  />
                  {failed > 0 && (
                    <QueueItem
                      icon={AlertTriangle}
                      iconClass="text-red-500"
                      title={`${failed} fairness alert${failed > 1 ? "s" : ""} need attention`}
                      description="Review flagged audits before publishing reports."
                      index={2}
                    />
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
