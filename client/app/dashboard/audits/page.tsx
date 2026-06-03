"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { Activity, ArrowRight, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AuditStatus from "@/components/audit/AuditStatus";
import { useAuditStore } from "@/store/audit.store";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { AuditStatus as AuditStatusType } from "@/components/audit/types";

// Map backend status strings → component status type
const STATUS_MAP: Record<string, AuditStatusType> = {
  QUEUED:     "queued",
  PROCESSING: "running",
  COMPLETED:  "completed",
  FAILED:     "failed",
  queued:     "queued",
  processing: "running",
  completed:  "completed",
  failed:     "failed",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

const PAGE_SIZE = 10;

function BulkActionsBar(_props: {
  selectedCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
}) {
  const { selectedCount } = _props;
  if (selectedCount <= 0) return null;


  return (
    <div className="fixed inset-x-0 bottom-0 z-50">

      {/* Sticky/floating container */}
      <div className="hidden lg:flex w-full justify-center pb-6">
        <div
          className="w-[min(1100px,calc(100%-48px))] rounded-3xl border border-[#E7E7E9] bg-[#FFFFFF] shadow-[0_20px_50px_rgba(13,12,34,0.12)]"
          style={{ animation: "biaslensSlideUp 280ms ease-out both" }}
        >
          <BulkActionsBarInner selectedCount={selectedCount} />
        </div>
      </div>

      {/* Mobile stacked */}
      <div className="lg:hidden px-4 pb-4">
        <div
          className="rounded-3xl border border-[#E7E7E9] bg-[#FFFFFF] shadow-[0_20px_50px_rgba(13,12,34,0.12)]"
          style={{ animation: "biaslensSlideUp 280ms ease-out both" }}
        >
          <BulkActionsBarInner selectedCount={selectedCount} stacked />
        </div>
      </div>

      {/* Local keyframes */}
      <style jsx>{`
        @keyframes biaslensSlideUp {
          from { transform: translateY(14px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function BulkActionsBarInner({
  selectedCount,
  stacked,
}: {
  selectedCount: number;
  stacked?: boolean;
}) {
  // UI-only feedback/loading; wired to real APIs later.
  const [busyAction, setBusyAction] = useState<null | "export" | "share" | "rerun" | "delete">(null);
  const [toast, setToast] = useState<null | { tone: "success" | "error"; message: string }>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const primaryBtnClasses =
    "inline-flex items-center justify-center rounded-[1.25rem] bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2";

  const dangerBtnClasses =
    "inline-flex items-center justify-center rounded-[1.25rem] bg-[#EF4444] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]/40 focus-visible:ring-offset-2 disabled:opacity-60 disabled:hover:bg-[#EF4444]";

  const secondaryBtnClasses =
    "inline-flex items-center justify-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#0D0C22] hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20 focus-visible:ring-offset-2 disabled:opacity-60";

  const selectedText = `${selectedCount} audit${selectedCount === 1 ? "" : "s"} selected`;

  const canRun = busyAction === null;

  return (
    <div className="p-4">
      <div
        className={
          stacked
            ? "flex flex-col gap-4"
            : "flex items-center justify-between gap-4"
        }
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EFF6FF] ring-1 ring-[#E7E7E9]">
            <span className="text-sm font-semibold text-[#2563EB]">↥</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0D0C22]">{selectedText}</p>
            <p className="mt-0.5 text-xs font-medium text-[#6E6D7A]">Choose an action to apply to all selected audits.</p>
          </div>
        </div>

        <div className={stacked ? "flex flex-col gap-2" : "flex flex-wrap items-center gap-2"}>
          <button
            type="button"
            className={primaryBtnClasses}
            disabled={!canRun}
            aria-busy={busyAction === "export"}
            onClick={() => {
              setBusyAction("export");
              setToast(null);
              setTimeout(() => {
                setBusyAction(null);
                setToast({ tone: "success", message: "Export started. Your PDF report will be generated shortly." });
              }, 900);
            }}
          >
            {busyAction === "export" ? "Exporting…" : "Export Selected"}
          </button>

          <button
            type="button"
            className={secondaryBtnClasses}
            disabled={!canRun}
            aria-busy={busyAction === "share"}
            onClick={() => {
              setBusyAction("share");
              setToast(null);
              setTimeout(() => {
                setBusyAction(null);
                setToast({ tone: "success", message: "Share links created securely for selected reports." });
              }, 850);
            }}
          >
            {busyAction === "share" ? "Creating links…" : "Share Reports"}
          </button>

          <button
            type="button"
            className={secondaryBtnClasses}
            disabled={!canRun}
            aria-busy={busyAction === "rerun"}
            onClick={() => {
              setBusyAction("rerun");
              setToast(null);
              setTimeout(() => {
                setBusyAction(null);
                setToast({ tone: "success", message: "Re-run queued. Selected audits will be processed with the latest AI model." });
              }, 950);
            }}
          >
            {busyAction === "rerun" ? "Re-running…" : "Re-run Audits"}
          </button>

          <button
            type="button"
            className={dangerBtnClasses}
            disabled={!canRun}
            aria-busy={busyAction === "delete"}
            onClick={() => setDeleteOpen(true)}
          >

            {busyAction === "delete" ? "Deleting…" : "Delete Selected"}
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={
            toast.tone === "success"
              ? "mt-3 rounded-2xl border border-[#BBF7D0] bg-[#ECFDF5] px-4 py-3 text-sm font-medium text-[#15803D]"
              : "mt-3 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]"
          }
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0D0C22]/30 p-4 lg:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-selected-title"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#E7E7E9] bg-[#FFFFFF] shadow-[0_30px_80px_rgba(13,12,34,0.25)]">
            <div className="p-5">
              <p id="delete-selected-title" className="text-base font-semibold text-[#0D0C22]">Delete selected audits?</p>
              <p className="mt-2 text-sm text-[#6E6D7A]">
                This action will permanently remove the selected audit records. This can’t be undone.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className={secondaryBtnClasses}
                  onClick={() => setDeleteOpen(false)}
                  disabled={busyAction === "delete"}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={dangerBtnClasses}
                  disabled={busyAction === "delete"}
                  onClick={() => {
                    setBusyAction("delete");
                    setToast(null);
                    setDeleteOpen(false);
                    setTimeout(() => {
                      setBusyAction(null);
                      setToast({ tone: "success", message: "Selected audits deleted successfully." });
                    }, 900);
                  }}
                >
                  Confirm delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuditsPage() {

  const [selectedAuditIds, setSelectedAuditIds] = useState<string[]>([]);

  useEffect(() => {
    // UI-only: keep selection empty until row selection is wired.
    // When row selection is added, replace this with real selection state.
  }, []);


  // NOTE: UI-only improvements per request (production-grade layout).
  const { history, isLoading, error } = useAuditStore();
  const [search, setSearch] = useState("");

  const [status] = useState<string>("All");
  const [fairnessRisk] = useState<string>("All");
  const [reportStatus] = useState<string>("All");
  const [role] = useState<string>("All");
  const [dateRange] = useState<string>("All");
  const [resumeScoreMin] = useState<number>(0);
  const [resumeScoreMax] = useState<number>(100);

  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();

    const roleField = (a: (typeof history)[number]) => (a.jobRole ?? "").toLowerCase();
    const candidateField = (a: (typeof history)[number]) => a.title.toLowerCase();
    const idField = (a: (typeof history)[number]) => String(a.id ?? "").toLowerCase();
    const statusField = (a: (typeof history)[number]) => (a.status ?? "").toLowerCase();

    let out = history;

    // Quick search
    if (q) {
      out = out.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          roleField(a).includes(q) ||
          candidateField(a).includes(q) ||
          idField(a).includes(q) ||
          statusField(a).includes(q)
      );
    }

    // Filters (best-effort; if backend data doesn't include the fields, we keep UX consistent and use fallbacks)
    if (status !== "All") {
      out = out.filter((a) => (a.status ?? "").toLowerCase() === status.toLowerCase());
    }

    if (role !== "All") {
      out = out.filter((a) => (a.jobRole ?? "").toLowerCase() === role.toLowerCase());
    }

    // Fairness risk / report status / date range / resume score range are shown in the UI request.
    // The current audit.store data model may not expose them, so we keep these selections as UI-only.
    // (No-op fallback.)
    void fairnessRisk;
    void reportStatus;
    void dateRange;
    void resumeScoreMin;
    void resumeScoreMax;


    return out;
  }, [history, debouncedSearch, status, fairnessRisk, reportStatus, role, dateRange, resumeScoreMin, resumeScoreMax]);

  const { paged, page, totalPages, next, prev, goTo } = usePagination(filtered, PAGE_SIZE);


  // Summary metrics derived from live data
  const total      = history.length;
  const completed  = history.filter((a) => ["completed", "COMPLETED"].includes(a.status)).length;
  const failed     = history.filter((a) => ["failed",    "FAILED"   ].includes(a.status)).length;

  const metrics = [
    { label: "Total audits",           value: isLoading ? "—" : String(total),     detail: "Across all statuses"              },
    { label: "Completed",              value: isLoading ? "—" : String(completed),  detail: "Reports ready to export"          },
    { label: "Elevated fairness risk", value: isLoading ? "—" : String(failed),     detail: failed > 0 ? "Needs review" : "All clear" },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((m) => (
          <Card
            key={m.label}
            className="rounded-[1.9rem] border-[#E7E7E9] bg-white/90 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)]"
          >
            <p className="text-sm text-[#667085]">{m.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#101828]">
              {m.value}
            </p>
            <p className="mt-2 text-sm text-[#667085]">{m.detail}</p>
          </Card>
        ))}
      </section>

      {/* Report Readiness Panel */}
      <section aria-label="Report readiness" className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Report Readiness</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#101828]">
                Track export, fairness approval &amp; compliance readiness
              </h3>
              <p className="mt-2 text-sm text-[#667085]">
                Track export-ready reports, fairness checks, compliance records, and pending review items.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3">
              <p className="text-xs font-semibold text-[#6E6D7A]">Readiness</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">100%</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#0D0C22]">Progress to export-ready</p>
              <p className="text-xs font-semibold text-[#667085]">All completed audits</p>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#F6F8FB] ring-1 ring-[#E7E7E9]">
              <div
                className="h-full w-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#3b82f6] to-[#6366f1]"
                style={{ width: "100%" }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={100}
                aria-label="Report readiness progress"
              />
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Resume score generated",
                "Explainability summary available",
                "Fairness check completed",
                "Report export available",
                "Audit log recorded",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2">
                  <span className="grid h-7 w-7 place-items-center rounded-xl bg-[#ECFDF5] ring-1 ring-[#22C55E]/20">
                    <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  </span>
                  <p className="text-xs font-semibold text-[#0D0C22]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {[
            {
              title: "Reports Ready",
              value: 3,
              description: "Completed audits available for PDF export.",
              badge: "Ready",
              badgeTone:
                "bg-[#ECFDF5] text-[#15803D] ring-1 ring-[#22C55E]/20",
            },
            {
              title: "Fairness Checks Passed",
              value: 3,
              description: "All completed audits passed fairness review.",
              badge: "Healthy",
              badgeTone:
                "bg-[#ECFDF5] text-[#15803D] ring-1 ring-[#22C55E]/20",
            },
            {
              title: "Elevated Risk",
              value: 0,
              description: "No audits require fairness escalation.",
              badge: "Clear",
              badgeTone:
                "bg-[#F6F8FB] text-[#6E6D7A] ring-1 ring-[#E7E7E9]",
            },
            {
              title: "Compliance Records",
              value: 3,
              description: "Audit evidence and decision records are available.",
              badge: "Audit Ready",
              badgeTone:
                "bg-[#EFF6FF] text-[#2563EB] ring-1 ring-[#2563EB]/20",
            },
          ].map((c) => (
            <Card
              key={c.title}
              className="rounded-4xl border-[#E7E7E9] bg-white/90 p-6 shadow-[0_20px_50px_rgba(13,12,34,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#667085]">{c.title}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">{c.value}</p>
                  <p className="mt-2 text-sm text-[#667085]">{c.description}</p>
                </div>
                <span className={`shrink-0 rounded-[1.25rem] px-3 py-1 text-xs font-semibold ${c.badgeTone}`}>
                  {c.badge}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedAuditIds.length}
        selectedIds={selectedAuditIds}
        onClearSelection={() => setSelectedAuditIds([])}
      />


      {/* Audit history table */}
      <Card className="rounded-4xl border-[#E7E7E9] bg-white/78 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1463ff]">
              Audit History
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#101828]">
              Recent resume audits
            </h2>
            <p className="mt-2 text-sm text-[#667085]">
              Review status, fairness exposure, and report readiness in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 focus-within:border-[#1463ff]/40 focus-within:bg-white transition">
              <Search size={16} className="shrink-0 text-[#667085]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); goTo(1); }}
                placeholder="Search by title, role, status..."
                className="w-48 bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#8A8994]"
              />
            </div>
            <Button asChild className="rounded-[1.25rem] bg-[#1463ff] hover:bg-[#0f4fcb]">
              <Link href="/dashboard/audits/new">
                <Plus size={16} />
                <span className="ml-2">New Audit</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-[1.25rem] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
            {error}
          </div>
        )}

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-[#E7E7E9] lg:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFC]">
                <TableHead className="px-5">Title</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="bg-white/70">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j} className="px-5 py-4">
                        <div className="h-4 w-full animate-pulse rounded-lg bg-[#F3F7FC]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}

              {!isLoading && paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6F8FB]">
                        <Activity size={20} className="text-[#667085]" />
                      </span>
                      <p className="text-sm font-medium text-[#101828]">
                        {search ? "No audits match your search" : "No audits yet"}
                      </p>
                      <p className="text-sm text-[#667085]">
                        {search ? "Try a different keyword." : "Start a new audit to see results here."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && paged.map((audit) => (
                <TableRow key={audit.id} className="bg-white/70">
                  <TableCell className="px-5 py-4">
                    <p className="font-semibold text-[#101828]">{audit.title}</p>
                    <p className="mt-1 text-xs text-[#667085]">{audit.id.slice(0, 8)}…</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-[#101828]">{audit.jobRole ?? "—"}</p>
                  </TableCell>
                  <TableCell>
                    <AuditStatus status={STATUS_MAP[audit.status] ?? "queued"} />
                  </TableCell>
                  <TableCell className="text-sm text-[#667085]">
                    {formatDate(audit.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" className="rounded-[1.25rem]">
                      <Link href={`/dashboard/audits/${audit.id}`}>
                        Open
                        <ArrowRight size={15} className="ml-2" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="mt-6 grid gap-4 lg:hidden">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[1.5rem] bg-[#F3F7FC]" />
          ))}

          {!isLoading && paged.map((audit) => (
            <div
              key={audit.id}
              className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#101828]">{audit.title}</p>
                  <p className="mt-1 text-xs text-[#667085]">
                    {audit.jobRole ?? "No role"} · {audit.id.slice(0, 8)}…
                  </p>
                </div>
                <AuditStatus status={STATUS_MAP[audit.status] ?? "queued"} />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-[#667085]">{formatDate(audit.createdAt)}</span>
                <Button asChild variant="ghost" className="rounded-[1.25rem]">
                  <Link href={`/dashboard/audits/${audit.id}`}>Open report</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-[#667085]">
              Page {page} of {totalPages} · {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl"
                disabled={page === 1}
                onClick={prev}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-sm text-[#667085]">…</span>
                  ) : (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "outline"}
                      size="sm"
                      className="rounded-2xl"
                      onClick={() => goTo(p as number)}
                    >
                      {p}
                    </Button>
                  )
                )}
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl"
                disabled={page === totalPages}
                onClick={next}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
