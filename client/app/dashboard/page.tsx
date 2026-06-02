"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Loader2,
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
  const failed  = history.filter((a) => normalizeStatus(a.status) === "FAILED").length;
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
      value:        isLoading ? "—" : String(failed),
      detail:       failed > 0 ? `${failed} require review` : "All clear",
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
            Good morning 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening across your hiring audits today.
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