"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Share2,
  Trash2,
  Archive,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";



type ReportStatus = "PDF_READY" | "DRAFT" | "GENERATING" | "FAILED" | "SHARED";
type FairnessRisk = "LOW" | "MEDIUM" | "HIGH";
type ReportType = "RESUME" | "ATS";

type ReportRow = {
  id: string;
  auditId: string;
  candidateName: string;
  role: string;
  resumeScore: number; // 0-100
  jobFit: number; // 0-100
  fairnessRisk: FairnessRisk;
  explainability: number; // 0-100
  status: ReportStatus;
  createdAt: string; // ISO
  reportType: ReportType;
  isPdfReady: boolean;
  isShared: boolean;
  isComplianceReady: boolean;
};

type SortKey = keyof Pick<
  ReportRow,
  "id" | "auditId" | "candidateName" | "role" | "resumeScore" | "jobFit" | "createdAt"
>;

type SortState = { key: SortKey; direction: "asc" | "desc" };

type PaginationState = { pageIndex: number; pageSize: number };

type QuickFilter =
  | "ALL"
  | "PDF_READY"
  | "DRAFT"
  | "SHARED"
  | "COMPLIANCE_READY"
  | "LOW_RISK";

const BRAND = {
  primary: "#2563EB",
  background: "#FFFFFF",
  secondaryBackground: "#F6F8FB",
  text: "#0D0C22",
  mutedText: "#6E6D7A",
  border: "#E7E7E9",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function statusBadgeStyle(status: ReportStatus) {
  switch (status) {
    case "PDF_READY":
      return {
        bg: "rgba(34, 197, 94, 0.10)",
        fg: BRAND.success,
        border: "rgba(34, 197, 94, 0.25)",
      };
    case "SHARED":
      return {
        bg: "rgba(37, 99, 235, 0.10)",
        fg: BRAND.primary,
        border: "rgba(37, 99, 235, 0.25)",
      };
    case "DRAFT":
      return {
        bg: "rgba(245, 158, 11, 0.10)",
        fg: BRAND.warning,
        border: "rgba(245, 158, 11, 0.25)",
      };
    case "GENERATING":
      return {
        bg: "rgba(37, 99, 235, 0.08)",
        fg: "#3B82F6",
        border: "rgba(37, 99, 235, 0.20)",
      };
    case "FAILED":
      return {
        bg: "rgba(239, 68, 68, 0.10)",
        fg: BRAND.danger,
        border: "rgba(239, 68, 68, 0.25)",
      };
    default:
      return { bg: "#F6F8FB", fg: BRAND.mutedText, border: BRAND.border };
  }
}

function riskBadgeStyle(risk: FairnessRisk) {
  switch (risk) {
    case "LOW":
      return {
        bg: "rgba(34, 197, 94, 0.10)",
        fg: BRAND.success,
        border: "rgba(34, 197, 94, 0.25)",
      };
    case "MEDIUM":
      return {
        bg: "rgba(245, 158, 11, 0.10)",
        fg: BRAND.warning,
        border: "rgba(245, 158, 11, 0.25)",
      };
    case "HIGH":
      return {
        bg: "rgba(239, 68, 68, 0.10)",
        fg: BRAND.danger,
        border: "rgba(239, 68, 68, 0.25)",
      };
    default:
      return { bg: "#F6F8FB", fg: BRAND.mutedText, border: BRAND.border };
  }
}

function computeTotals(rows: ReportRow[]) {
  const total = rows.length;
  const pdfReports = rows.filter((r) => r.isPdfReady).length;
  const sharedReports = rows.filter((r) => r.isShared).length;
  const complianceReady = rows.filter((r) => r.isComplianceReady).length;
  const avgResume = total
    ? Math.round(rows.reduce((acc, r) => acc + r.resumeScore, 0) / total)
    : 0;
  const lowRisk = rows.filter((r) => r.fairnessRisk === "LOW").length;

  return {
    total,
    pdfReports,
    sharedReports,
    complianceReady,
    avgResume,
    lowRisk,
  };
}

function buildMockReports(): ReportRow[] {
  const now = Date.now();
  const days = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString();

  const base: Omit<ReportRow, "createdAt">[] = [
    {
      id: "RPT-1042",
      auditId: "AUD-7721",
      candidateName: "Aisha Thompson",
      role: "Product Manager",
      resumeScore: 84,
      jobFit: 78,
      fairnessRisk: "LOW",
      explainability: 92,
      status: "PDF_READY",
      reportType: "RESUME",
      isPdfReady: true,
      isShared: true,
      isComplianceReady: true,
    },
    {
      id: "RPT-1043",
      auditId: "AUD-7722",
      candidateName: "Daniel Kim",
      role: "Software Engineer",
      resumeScore: 73,
      jobFit: 81,
      fairnessRisk: "MEDIUM",
      explainability: 84,
      status: "SHARED",
      reportType: "ATS",
      isPdfReady: true,
      isShared: true,
      isComplianceReady: false,
    },
    {
      id: "RPT-1044",
      auditId: "AUD-7723",
      candidateName: "Priya Nair",
      role: "Data Analyst",
      resumeScore: 66,
      jobFit: 69,
      fairnessRisk: "LOW",
      explainability: 79,
      status: "DRAFT",
      reportType: "RESUME",
      isPdfReady: false,
      isShared: false,
      isComplianceReady: false,
    },
    {
      id: "RPT-1045",
      auditId: "AUD-7724",
      candidateName: "Miguel Alvarez",
      role: "UX Researcher",
      resumeScore: 58,
      jobFit: 63,
      fairnessRisk: "HIGH",
      explainability: 71,
      status: "FAILED",
      reportType: "RESUME",
      isPdfReady: false,
      isShared: false,
      isComplianceReady: false,
    },
    {
      id: "RPT-1046",
      auditId: "AUD-7725",
      candidateName: "Sophia Williams",
      role: "Marketing Analyst",
      resumeScore: 79,
      jobFit: 74,
      fairnessRisk: "MEDIUM",
      explainability: 88,
      status: "GENERATING",
      reportType: "ATS",
      isPdfReady: false,
      isShared: false,
      isComplianceReady: false,
    },
    {
      id: "RPT-1047",
      auditId: "AUD-7726",
      candidateName: "Noah Patel",
      role: "Systems Engineer",
      resumeScore: 91,
      jobFit: 86,
      fairnessRisk: "LOW",
      explainability: 95,
      status: "PDF_READY",
      reportType: "ATS",
      isPdfReady: true,
      isShared: false,
      isComplianceReady: true,
    },
    {
      id: "RPT-1048",
      auditId: "AUD-7727",
      candidateName: "Emma Johnson",
      role: "HR Specialist",
      resumeScore: 64,
      jobFit: 60,
      fairnessRisk: "MEDIUM",
      explainability: 76,
      status: "DRAFT",
      reportType: "RESUME",
      isPdfReady: false,
      isShared: false,
      isComplianceReady: false,
    },
    {
      id: "RPT-1049",
      auditId: "AUD-7728",
      candidateName: "Liam Chen",
      role: "Backend Engineer",
      resumeScore: 88,
      jobFit: 83,
      fairnessRisk: "LOW",
      explainability: 93,
      status: "SHARED",
      reportType: "ATS",
      isPdfReady: true,
      isShared: true,
      isComplianceReady: true,
    },
    {
      id: "RPT-1050",
      auditId: "AUD-7729",
      candidateName: "Olivia Brown",
      role: "Business Analyst",
      resumeScore: 71,
      jobFit: 68,
      fairnessRisk: "HIGH",
      explainability: 80,
      status: "PDF_READY",
      reportType: "RESUME",
      isPdfReady: true,
      isShared: false,
      isComplianceReady: false,
    },
    {
      id: "RPT-1051",
      auditId: "AUD-7730",
      candidateName: "Ethan Wright",
      role: "Sales Engineer",
      resumeScore: 76,
      jobFit: 79,
      fairnessRisk: "LOW",
      explainability: 86,
      status: "PDF_READY",
      reportType: "ATS",
      isPdfReady: true,
      isShared: true,
      isComplianceReady: true,
    },
  ];

  const createdAtOffsets = [1, 2, 5, 8, 3, 10, 12, 7, 6, 4];

  return base.map((r, idx) => ({ ...r, createdAt: days(createdAtOffsets[idx] ?? idx) }));
}

function getQuickFilterPredicate(filter: QuickFilter) {
  switch (filter) {
    case "ALL":
      return (_r: ReportRow) => true;
    case "PDF_READY":
      return (r: ReportRow) => r.isPdfReady;
    case "DRAFT":
      return (r: ReportRow) => r.status === "DRAFT";
    case "SHARED":
      return (r: ReportRow) => r.isShared;
    case "COMPLIANCE_READY":
      return (r: ReportRow) => r.isComplianceReady;
    case "LOW_RISK":
      return (r: ReportRow) => r.fairnessRisk === "LOW";
    default:
      return (_r: ReportRow) => true;
  }
}

function downloadPdfMock(report: ReportRow) {
  // Mock download via a data URI - keeps it production-safe without backend.
  const content = [
    `BiasLens Report (Mock)`,
    `Report ID: ${report.id}`,
    `Audit ID: ${report.auditId}`,
    `Candidate: ${report.candidateName}`,
    `Role: ${report.role}`,
    `Resume Score: ${report.resumeScore}/100`,
    `Job Fit: ${report.jobFit}/100`,
    `Fairness Risk: ${report.fairnessRisk}`,
    `Explainability: ${report.explainability}/100`,
    `Status: ${report.status}`,
    `Created: ${report.createdAt}`,
    ``,
    `This PDF export is a UI mock. Wire it to your backend export endpoint for real downloads.`,
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.id}.pdf.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function generateReportMock() {
  // Mock: no-op UI action
  // Kept client-only for button handlers.
  return;
}

export default function ReportsPage() {
  const [rows, setRows] = React.useState<ReportRow[]>(() => buildMockReports());

  const totals = React.useMemo(() => computeTotals(rows), [rows]);

  // Search
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Filters
  const [statusFilter, setStatusFilter] = React.useState<
    ReportStatus | "ALL"
  >("ALL");
  const [fairnessFilter, setFairnessFilter] = React.useState<
    FairnessRisk | "ALL"
  >("ALL");
  const [typeFilter, setTypeFilter] = React.useState<ReportType | "ALL">(
    "ALL"
  );

  const [minScore, setMinScore] = React.useState<number>(0);
  const [maxScore, setMaxScore] = React.useState<number>(100);

  // Date Range (simple)
  const [dateFrom, setDateFrom] = React.useState<string>("");
  const [dateTo, setDateTo] = React.useState<string>("");

  // Quick filters
  const [quickFilter, setQuickFilter] = React.useState<QuickFilter>("ALL");

  // Sorting
  const [sort, setSort] = React.useState<SortState>({
    key: "createdAt",
    direction: "desc",
  });

  // Pagination
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  // Row selection
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set()
  );

  const quickPredicate = React.useMemo(
    () => getQuickFilterPredicate(quickFilter),
    [quickFilter]
  );

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
    const toTs = dateTo ? new Date(dateTo).getTime() : null;

    const withinDate = (r: ReportRow) => {
      const ts = new Date(r.createdAt).getTime();
      if (fromTs !== null && ts < fromTs) return false;
      if (toTs !== null && ts > toTs) return false;
      return true;
    };

    return rows
      .filter(quickPredicate)
      .filter((r) => {
        if (!normalizedSearch) return true;
        const haystack = [r.id, r.auditId, r.candidateName, r.role]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedSearch);
      })
      .filter((r) => (statusFilter === "ALL" ? true : r.status === statusFilter))
      .filter(
        (r) => (fairnessFilter === "ALL" ? true : r.fairnessRisk === fairnessFilter)
      )
      .filter((r) => (typeFilter === "ALL" ? true : r.reportType === typeFilter))
      .filter((r) => r.resumeScore >= minScore && r.resumeScore <= maxScore)
      .filter(withinDate);
  }, [
    rows,
    quickPredicate,
    normalizedSearch,
    statusFilter,
    fairnessFilter,
    typeFilter,
    minScore,
    maxScore,
    dateFrom,
    dateTo,
  ]);

  const sorted = React.useMemo(() => {
    const { key, direction } = sort;
    const dir = direction === "asc" ? 1 : -1;

    const getVal = (r: ReportRow): string | number => {
      if (key === "createdAt") return new Date(r.createdAt).getTime();
      if (key === "id") return r.id;
      if (key === "auditId") return r.auditId;
      if (key === "candidateName") return r.candidateName;
      if (key === "role") return r.role;
      if (key === "resumeScore") return r.resumeScore;
      if (key === "jobFit") return r.jobFit;
      return r.createdAt;
    };

    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return copy;
  }, [filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pagination.pageSize));

  // Keep pagination in-range (derived to avoid setState in effects)
  const safePagination = React.useMemo(() => {
    return {
      ...pagination,
      pageIndex: clamp(pagination.pageIndex, 0, pageCount - 1),
    };
  }, [pagination, pageCount]);

  const paged = React.useMemo(() => {
    const startSafe = safePagination.pageIndex * safePagination.pageSize;
    return sorted.slice(startSafe, startSafe + safePagination.pageSize);
  }, [sorted, safePagination]);

  const pageCountIndexSafe = safePagination.pageIndex;

  // Actions
  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allOnPageSelected =
    paged.length > 0 && paged.every((r) => selectedIds.has(r.id));

  const toggleAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        paged.forEach((r) => next.delete(r.id));
      } else {
        paged.forEach((r) => next.add(r.id));
      }
      return next;
    });
  };

  const exportAll = () => {
    const exportable = rows.filter((r) => r.isPdfReady);
    if (!exportable.length) return;

    exportable.slice(0, 10).forEach((r, idx) => {
      setTimeout(() => downloadPdfMock(r), idx * 120);
    });

    // Selection reset is optional; keep it consistent.
    setSelectedIds(new Set());
  };

  const onSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setFairnessFilter("ALL");
    setTypeFilter("ALL");
    setMinScore(0);
    setMaxScore(100);
    setDateFrom("");
    setDateTo("");
    setQuickFilter("ALL");
    setSort({ key: "createdAt", direction: "desc" });
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
    setSelectedIds(new Set());
  };

  const quickFilters: { label: string; value: QuickFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "PDF Ready", value: "PDF_READY" },
    { label: "Draft", value: "DRAFT" },
    { label: "Shared", value: "SHARED" },
    { label: "Compliance Ready", value: "COMPLIANCE_READY" },
    { label: "Low Risk", value: "LOW_RISK" },
  ];

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
            Reports
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6E6D7A]">
            Manage generated audit reports, export PDFs, and review explainability and fairness summaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => generateReportMock()}
            className="rounded-[1.25rem] bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
          >
            <Plus size={16} className="mr-2" />
            Generate Report
          </Button>

          <Button
            variant="outline"
            onClick={exportAll}
            className="rounded-[1.25rem] border-[#E7E7E9] bg-[#FFFFFF] hover:bg-[#F6F8FB]"
          >
            <Download size={16} className="mr-2 text-[#2563EB]" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Reports" value={totals.total} hint="All report states" />
        <StatCard title="PDF Reports" value={totals.pdfReports} hint="Ready for export" />
        <StatCard title="Shared Reports" value={totals.sharedReports} hint="Access granted" />
        <StatCard title="Compliance Ready" value={totals.complianceReady} hint="Audit-ready" />
        <StatCard title="Average Resume Score" value={`${totals.avgResume}/100`} hint="Aggregate scoring" />
        <StatCard title="Low Risk Reports" value={totals.lowRisk} hint="Fairness risk" />
      </div>

      {/* Search + filters */}
      <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              Search
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2.5">
              <Search size={16} className="text-[#6E6D7A]" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
                placeholder="Search by report ID, audit ID, candidate name, or role"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8A8994]"
                aria-label="Search reports"
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[180px] flex-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                  Report Status
                </label>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v as ReportStatus | "ALL");
                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                  }}
                >
                  <SelectTrigger className="mt-2 rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="PDF_READY">PDF Ready</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="GENERATING">Generating</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="SHARED">Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[180px] flex-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                  Fairness Risk
                </label>
                <Select
                  value={fairnessFilter}
                  onValueChange={(v) => {
                    setFairnessFilter(v as FairnessRisk | "ALL");
                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                  }}
                >
                  <SelectTrigger className="mt-2 rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB]">
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="LOW">Low Risk</SelectItem>
                    <SelectItem value="MEDIUM">Medium Risk</SelectItem>
                    <SelectItem value="HIGH">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[160px] flex-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                  Report Type
                </label>
                <Select
                  value={typeFilter}
                  onValueChange={(v) => {
                    setTypeFilter(v as ReportType | "ALL");
                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                  }}
                >
                  <SelectTrigger className="mt-2 rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="RESUME">Resume</SelectItem>
                    <SelectItem value="ATS">ATS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div className="min-w-[180px]">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                  Resume Score Range
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={minScore}
                    onChange={(e) => setMinScore(clamp(Number(e.target.value || 0), 0, 100))}
                    className="w-24 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm outline-none"
                    aria-label="Minimum resume score"
                  />
                  <span className="text-sm text-[#6E6D7A]">to</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={maxScore}
                    onChange={(e) => setMaxScore(clamp(Number(e.target.value || 0), 0, 100))}
                    className="w-24 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm outline-none"
                    aria-label="Maximum resume score"
                  />
                </div>
              </div>

              <div className="min-w-[190px] flex-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                  Date Range
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setPagination((p) => ({ ...p, pageIndex: 0 }));
                    }}
                    className="w-[50%] rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm outline-none"
                    aria-label="From date"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setPagination((p) => ({ ...p, pageIndex: 0 }));
                    }}
                    className="w-[50%] rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm outline-none"
                    aria-label="To date"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="ml-auto rounded-[1.25rem] border-[#E7E7E9] text-[#6E6D7A] hover:bg-[#F6F8FB]"
              >
                Reset
              </Button>
            </div>

            {/* Quick filters */}
            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Quick Filters
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {quickFilters.map((f) => {
                  const active = quickFilter === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => {
                        setQuickFilter(f.value);
                        setPagination((p) => ({ ...p, pageIndex: 0 }));
                      }}
                      className={
                        "rounded-[1.25rem] border px-3 py-2 text-sm font-medium transition focus:outline-none " +
                        (active
                          ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                          : "border-[#E7E7E9] bg-[#FFFFFF] text-[#6E6D7A] hover:bg-[#F6F8FB]")
                      }
                      aria-pressed={active}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[#6E6D7A]">
            Showing <span className="font-semibold text-[#0D0C22]">{paged.length}</span> of{" "}
            <span className="font-semibold text-[#0D0C22]">{sorted.length}</span> results
          </p>
          <p className="text-sm text-[#6E6D7A]">
            Selected: <span className="font-semibold text-[#0D0C22]">{selectedIds.size}</span>
          </p>
        </div>
      </Card>

      {/* Table */}
      <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#2563EB]"
                checked={allOnPageSelected}
                onChange={toggleAllOnPage}
                aria-label="Select all rows on page"
              />
            </div>
            <p className="text-sm font-semibold text-[#0D0C22]">Reports</p>
          </div>

          <div className="text-sm text-[#6E6D7A]">
            Tip: Use column headers to sort.
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[44px]">
                  <span className="sr-only">Select</span>
                </TableHead>
                <SortableHead
                  label="Report ID"
                  activeKey={sort.key}
                  activeDir={sort.direction}
                  sortKey="id"
                  onSort={onSort}
                />
                <SortableHead
                  label="Audit ID"
                  activeKey={sort.key}
                  activeDir={sort.direction}
                  sortKey="auditId"
                  onSort={onSort}
                />
                <SortableHead
                  label="Candidate Name"
                  activeKey={sort.key}
                  activeDir={sort.direction}
                  sortKey="candidateName"
                  onSort={onSort}
                />
                <SortableHead
                  label="Role"
                  activeKey={sort.key}
                  activeDir={sort.direction}
                  sortKey="role"
                  onSort={onSort}
                />
                <SortableHead
                  label="Resume Score"
                  activeKey={sort.key}
                  activeDir={sort.direction}
                  sortKey="resumeScore"
                  onSort={onSort}
                />
                <TableHead className="whitespace-nowrap">Job Fit</TableHead>
                <TableHead className="whitespace-nowrap">Fairness Risk</TableHead>
                <TableHead className="whitespace-nowrap">Explainability</TableHead>
                <TableHead className="whitespace-nowrap">Report Status</TableHead>
                <SortableHead
                  label="Created"
                  activeKey={sort.key}
                  activeDir={sort.direction}
                  sortKey="createdAt"
                  onSort={onSort}
                />
                <TableHead className="w-[1%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12}>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6F8FB]">
                        <FileText size={20} className="text-[#2563EB]" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-[#0D0C22]">
                        No Reports Found
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-[#6E6D7A]">
                        Generate your first audit report to review explainability, fairness, and hiring insights.
                      </p>
                      <Button
                        onClick={() => generateReportMock()}
                        className="mt-5 rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8]"
                      >
                        Generate Report
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {paged.map((r) => {
                    const selected = selectedIds.has(r.id);
                    const s = statusBadgeStyle(r.status);
                    const fr = riskBadgeStyle(r.fairnessRisk);

                    return (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="align-middle"
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#2563EB]"
                            checked={selected}
                            onChange={() => toggleSelected(r.id)}
                            aria-label={`Select report ${r.id}`}
                          />
                        </TableCell>

                        <TableCell className="font-medium text-[#0D0C22]">{r.id}</TableCell>
                        <TableCell className="text-[#6E6D7A]">{r.auditId}</TableCell>
                        <TableCell className="text-[#0D0C22]">{r.candidateName}</TableCell>
                        <TableCell className="text-[#6E6D7A]">{r.role}</TableCell>
                        <TableCell>
                          <ScorePill value={r.resumeScore} />
                        </TableCell>

                        <TableCell>
                          <span className="text-sm font-semibold text-[#0D0C22]">{r.jobFit}/100</span>
                        </TableCell>

                        <TableCell>
                          <span
                            className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
                            style={{
                              background: fr.bg,
                              color: fr.fg,
                              borderColor: fr.border,
                            }}
                          >
                            {r.fairnessRisk === "LOW"
                              ? "Low Risk"
                              : r.fairnessRisk === "MEDIUM"
                                ? "Medium Risk"
                                : "High Risk"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm font-semibold text-[#0D0C22]">{r.explainability}/100</span>
                        </TableCell>

                        <TableCell>
                          <span
                            className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
                            style={{
                              background: s.bg,
                              color: s.fg,
                              borderColor: s.border,
                            }}
                          >
                            {r.status === "PDF_READY"
                              ? "PDF Ready"
                              : r.status === "DRAFT"
                                ? "Draft"
                                : r.status === "GENERATING"
                                  ? "Generating"
                                  : r.status === "FAILED"
                                    ? "Failed"
                                    : "Shared"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm text-[#6E6D7A]">{formatDate(r.createdAt)}</span>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-2xl border-[#E7E7E9] bg-[#FFFFFF] hover:bg-[#F6F8FB]"
                                aria-label={`Actions for ${r.id}`}
                              >
                                <MoreHorizontal size={16} className="text-[#6E6D7A]" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 rounded-[1.25rem]">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => {
                                  // This is a UI mock; route wiring can be added.
                                  window.location.href = `/dashboard/reports/${encodeURIComponent(r.id)}`;
                                }}
                              >
                                <FileText size={16} className="mr-2 text-[#2563EB]" />
                                View Report
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                disabled={!r.isPdfReady}
                                onClick={() => downloadPdfMock(r)}
                                className={!r.isPdfReady ? "opacity-60" : undefined}
                              >
                                <Download size={16} className="mr-2" />
                                Download PDF
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  setRows((prev) =>
                                    prev.map((x) =>
                                      x.id === r.id
                                        ? {
                                            ...x,
                                            isShared: true,
                                            status: x.status === "DRAFT" ? "SHARED" : x.status,
                                          }
                                        : x
                                    )
                                  );
                                }}
                              >
                                <Share2 size={16} className="mr-2" />
                                Share Report
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  setRows((prev) =>
                                    prev.map((x) =>
                                      x.id === r.id
                                        ? {
                                            ...x,
                                            status: "GENERATING",
                                            isPdfReady: false,
                                            isComplianceReady: false,
                                          }
                                        : x
                                    )
                                  );
                                  setTimeout(() => {
                                    setRows((prev) =>
                                      prev.map((x) =>
                                        x.id === r.id
                                          ? {
                                              ...x,
                                              status: "PDF_READY",
                                              isPdfReady: true,
                                              isComplianceReady: x.fairnessRisk === "LOW",
                                            }
                                          : x
                                      )
                                    );
                                  }, 900);
                                }}
                              >
                                <RotateCcw size={16} className="mr-2" />
                                Regenerate
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  setRows((prev) =>
                                    prev.map((x) =>
                                      x.id === r.id
                                        ? { ...x, status: "FAILED" } // mock archive
                                        : x
                                    )
                                  );
                                }}
                              >
                                <Archive size={16} className="mr-2" />
                                Archive
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="text-[#EF4444] focus:text-[#EF4444]"
                                onClick={() => {
                                  setRows((prev) => prev.filter((x) => x.id !== r.id));
                                  setSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    next.delete(r.id);
                                    return next;
                                  });
                                }}
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-[1.25rem] border-[#E7E7E9]"
              disabled={pagination.pageIndex <= 0}
              onClick={() => setPagination((p) => ({ ...p, pageIndex: 0 }))}
            >
              First
            </Button>
            <Button
              variant="outline"
              className="rounded-[1.25rem] border-[#E7E7E9]"
              disabled={pagination.pageIndex <= 0}
              onClick={() =>
                setPagination((p) => ({ ...p, pageIndex: Math.max(0, p.pageIndex - 1) }))
              }
            >
              Prev
            </Button>
            <Button
              variant="outline"
              className="rounded-[1.25rem] border-[#E7E7E9]"
              disabled={pagination.pageIndex >= pageCount - 1}
              onClick={() =>
                setPagination((p) => ({ ...p, pageIndex: Math.min(pageCount - 1, p.pageIndex + 1) }))
              }
            >
              Next
            </Button>
            <Button
              variant="outline"
              className="rounded-[1.25rem] border-[#E7E7E9]"
              disabled={pagination.pageIndex >= pageCount - 1}
              onClick={() => setPagination((p) => ({ ...p, pageIndex: pageCount - 1 }))}
            >
              Last
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[#6E6D7A]">
              Page <span className="font-semibold text-[#0D0C22]">{pagination.pageIndex + 1}</span> of{" "}
              <span className="font-semibold text-[#0D0C22]">{pageCount}</span>
            </span>

            <Select
              value={String(pagination.pageSize)}
              onValueChange={(v) => {
                const nextSize = Number(v);
                setPagination({ pageIndex: 0, pageSize: nextSize });
              }}
            >
              <SelectTrigger className="rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB] w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: number | string;
  hint: string;
}) {
  return (
    <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E6D7A]">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
            {value}
          </p>
          <p className="mt-1 text-sm text-[#6E6D7A]">{hint}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F6F8FB]">
          <span className="h-2 w-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}

function ScorePill({ value }: { value: number }) {
  const v = clamp(value, 0, 100);
  const risk: "LOW" | "MEDIUM" | "HIGH" = v >= 80 ? "LOW" : v >= 65 ? "MEDIUM" : "HIGH";
  const style =
    risk === "LOW"
      ? { bg: "rgba(34, 197, 94, 0.10)", fg: BRAND.success, border: "rgba(34, 197, 94, 0.25)" }
      : risk === "MEDIUM"
        ? { bg: "rgba(245, 158, 11, 0.10)", fg: BRAND.warning, border: "rgba(245, 158, 11, 0.25)" }
        : { bg: "rgba(239, 68, 68, 0.10)", fg: BRAND.danger, border: "rgba(239, 68, 68, 0.25)" };

  return (
    <span
      className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
      style={{ background: style.bg, color: style.fg, borderColor: style.border }}
    >
      {v}/100
    </span>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) {
    return <span className="inline-flex">&nbsp;</span>;
  }
  return dir === "asc" ? (
    <ArrowUp size={14} className="ml-1 text-[#2563EB]" />
  ) : (
    <ArrowDown size={14} className="ml-1 text-[#2563EB]" />
  );
}

function SortableHead<T extends string>({
  label,
  sortKey,
  activeKey,
  activeDir,
  onSort,
}: {
  label: string;
  sortKey: T;
  activeKey: T;
  activeDir: "asc" | "desc";
  onSort: (key: T) => void;
}) {
  const active = activeKey === sortKey;

  return (
    <TableHead className="whitespace-nowrap">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center rounded-[0.75rem] px-2 py-1 text-left text-sm font-semibold text-[#0D0C22] hover:bg-[#F6F8FB]"
        aria-sort={active ? (activeDir === "asc" ? "ascending" : "descending") : "none"}
      >
        {label}
        <SortIcon active={active} dir={activeDir} />
      </button>
    </TableHead>
  );
}

