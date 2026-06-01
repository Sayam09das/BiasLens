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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuditStore } from "@/store/audit.store";

const RISK_COLOR: Record<string, string> = {
  Low:      "bg-[#dcfce7] text-[#16a34a]",
  Moderate: "bg-[#fef3c7] text-[#d97706]",
  High:     "bg-[#fee2e2] text-[#dc2626]",
};

const STATUS_COLOR: Record<string, string> = {
  COMPLETED:  "text-[#16a34a]",
  PROCESSING: "text-[#d97706]",
  QUEUED:     "text-[#667085]",
  FAILED:     "text-[#dc2626]",
};

function isCompleted(status: string) {
  return status === "COMPLETED" || status === "completed";
}

function isProcessing(status: string) {
  return status === "PROCESSING" || status === "processing" || status === "QUEUED" || status === "queued";
}

function isFailed(status: string) {
  return status === "FAILED" || status === "failed";
}

export default function DashboardPage() {
  const { history, isLoading } = useAuditStore();

  const completed  = history.filter((a) => isCompleted(a.status)).length;
  const processing = history.filter((a) => isProcessing(a.status)).length;
  const failed     = history.filter((a) => isFailed(a.status)).length;
  const total      = history.length;

  const stats = [
    {
      label:  "Total audits",
      value:  isLoading ? "—" : String(total),
      detail: `${processing} currently processing`,
      icon:   Activity,
      tone:   "text-[#1463ff]",
      bg:     "bg-[#dbe8ff]",
    },
    {
      label:  "Completed",
      value:  isLoading ? "—" : String(completed),
      detail: "Reports ready to export",
      icon:   TrendingUp,
      tone:   "text-[#22c55e]",
      bg:     "bg-[#dcfce7]",
    },
    {
      label:  "Fairness alerts",
      value:  isLoading ? "—" : String(failed),
      detail: failed > 0 ? `${failed} require review` : "All clear",
      icon:   ShieldCheck,
      tone:   "text-[#f59e0b]",
      bg:     "bg-[#fef3c7]",
    },
    {
      label:  "Reports generated",
      value:  isLoading ? "—" : String(completed),
      detail: "Audit-ready exports",
      icon:   BadgeCheck,
      tone:   "text-[#101828]",
      bg:     "bg-[#f3f7fc]",
    },
  ] as const;

  // Show the 5 most recent audits in the pipeline overview
  const recent = history.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-[1.75rem] border-[#E7E7E9] bg-white/90 shadow-[0_20px_50px_rgba(13,12,34,0.06)]"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#667085]">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#101828]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-[#667085]">{stat.detail}</p>
                </div>
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}>
                  <stat.icon className={stat.tone} size={20} />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        {/* Audit pipeline */}
        <Card className="rounded-[1.9rem] border-[#E7E7E9] bg-white/92 shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
          <CardHeader className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl text-[#101828]">
                Audit pipeline overview
              </CardTitle>
              <CardDescription className="text-[#667085]">
                Live hiring intelligence across resume scoring, fairness monitoring, and reporting.
              </CardDescription>
            </div>
            <Button
              asChild
              className="rounded-full bg-[#1463ff] hover:bg-[#0f4fcb]"
            >
              <Link href="/dashboard/audits">New audit</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[72px] animate-pulse rounded-[1.5rem] bg-[#F6F8FB]"
                  />
                ))}
              </div>
            )}

            {!isLoading && recent.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6F8FB]">
                  <Activity size={20} className="text-[#667085]" />
                </span>
                <p className="text-sm font-medium text-[#101828]">No audits yet</p>
                <p className="text-sm text-[#667085]">
                  Upload a resume to start your first audit.
                </p>
              </div>
            )}

            {!isLoading &&
              recent.map((audit) => (
                <div
                  key={audit.id}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#101828]">
                      {audit.title}
                    </p>
                    <p className={`mt-1 text-xs font-medium ${STATUS_COLOR[audit.status] ?? "text-[#667085]"}`}>
                      {audit.status.charAt(0) + audit.status.slice(1).toLowerCase()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${RISK_COLOR.Low}`}
                    >
                      {audit.jobRole ?? "Pending review"}
                    </span>
                    <Link
                      href={`/dashboard/audits/${audit.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1463ff]"
                    >
                      Open
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Recommendations */}
          <Card className="overflow-hidden rounded-[1.9rem] border-[#dbe8ff] bg-[linear-gradient(180deg,#f0f5ff_0%,#FFFFFF_100%)] shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1463ff]">
                <Sparkles size={16} />
                BiasLens recommendations
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#101828]">
                {failed > 0
                  ? `Review ${failed} fairness alert${failed > 1 ? "s" : ""} before publishing reports`
                  : "All fairness checks passed — reports are ready to publish"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#344054]">
                {failed > 0
                  ? "The platform detected potential drift in screening outcomes. Review before exporting."
                  : "No anomalies detected across active hiring audits."}
              </p>
              <Button
                variant="outline"
                asChild
                className="mt-5 rounded-full border-[#dbe8ff] bg-white text-[#1463ff] hover:bg-[#f0f5ff]"
              >
                <Link href="/dashboard/fairness">Open fairness center</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Today's queue */}
          <Card className="rounded-[1.9rem] border-[#E7E7E9] bg-white/92 shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
            <CardHeader className="p-6">
              <CardTitle className="text-xl text-[#101828]">Today&apos;s queue</CardTitle>
              <CardDescription className="text-[#667085]">
                Priority work for your team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="flex items-start gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <Clock3 className="mt-0.5 text-[#1463ff]" size={18} />
                <div>
                  <p className="text-sm font-semibold text-[#101828]">
                    {processing > 0
                      ? `${processing} audit${processing > 1 ? "s" : ""} currently processing`
                      : "No audits in progress"}
                  </p>
                  <p className="mt-1 text-sm text-[#667085]">
                    {processing > 0
                      ? "Results will appear in the pipeline once complete."
                      : "Upload a resume to start a new audit."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <ShieldCheck className="mt-0.5 text-[#22c55e]" size={18} />
                <div>
                  <p className="text-sm font-semibold text-[#101828]">
                    {completed > 0
                      ? `${completed} completed audit${completed > 1 ? "s" : ""} ready`
                      : "No completed audits yet"}
                  </p>
                  <p className="mt-1 text-sm text-[#667085]">
                    {completed > 0
                      ? `Audit evidence available for ${completed} role${completed > 1 ? "s" : ""}.`
                      : "Completed audits will appear here."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
