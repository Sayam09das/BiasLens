"use client";

import { useMemo, useState } from "react";
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

export default function AuditsPage() {
  const { history, isLoading, error } = useAuditStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return history;
    return history.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.jobRole ?? "").toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
    );
  }, [history, debouncedSearch]);

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

      {/* Audit history table */}
      <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/78 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
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
                className="rounded-[1rem]"
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
                      className="rounded-[1rem]"
                      onClick={() => goTo(p as number)}
                    >
                      {p}
                    </Button>
                  )
                )}
              <Button
                variant="outline"
                size="sm"
                className="rounded-[1rem]"
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
