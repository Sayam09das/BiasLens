"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

import {
  ExportReportButton,
  ReportCard,
  ReportFilters,
  ReportPreview,
} from "@/components/reports";
import type { ReportFiltersState } from "@/components/reports/ReportFilters";
import type { FairnessRisk, ExplainabilityQuality, ReportStatus, ReportType } from "@/components/reports/ReportCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useReports, type BackendReport } from "@/hooks/useReports";

const initialFilters: ReportFiltersState = {
  query: "",
  status: "All",
  fairnessRisk: "All",
  reportType: "All",
};

type ReportListItem = {
  reportId: string;
  auditId: string;
  candidateName: string;
  role: string;
  resumeScore: number;
  jobFit: number;
  fairnessRisk: FairnessRisk;
  explainability: ExplainabilityQuality;
  status: ReportStatus;
  createdAt: string;
  reportType: ReportType;
};

function clampScore(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function mapFairnessRisk(score: number): FairnessRisk {
  if (score <= 25) return "Low";
  if (score <= 45) return "Medium";
  return "High";
}

function mapExplainability(probability: number): ExplainabilityQuality {
  if (probability >= 82) return "Clear";
  if (probability >= 65) return "Moderate";
  return "Limited";
}

function mapReportType(label: string | null): ReportType {
  const text = (label ?? "").toLowerCase();
  if (text.includes("fair")) return "Fairness";
  if (text.includes("explain")) return "Explainability";
  return "Resume Audit";
}

function parseFairnessScore(snapshot: unknown) {
  if (!snapshot || typeof snapshot !== "object") {
    return 36;
  }

  const risk = "fairnessRisk" in snapshot ? Number(snapshot.fairnessRisk) : NaN;
  return clampScore(Number.isFinite(risk) ? risk : 36);
}

function mapReport(report: BackendReport): ReportListItem {
  const confidence = clampScore(Math.round((report.topProbability ?? 0.72) * 100));
  const fairnessScore = parseFairnessScore(report.fairnessSnapshot);
  return {
    reportId: report.id,
    auditId: report.auditId ?? report.id,
    candidateName: report.title,
    role: report.predictionLabel ?? "BiasLens report",
    resumeScore: clampScore(confidence + 4),
    jobFit: confidence,
    fairnessRisk: mapFairnessRisk(fairnessScore),
    explainability: mapExplainability(confidence),
    status: "Ready",
    createdAt: report.createdAt,
    reportType: mapReportType(report.predictionLabel),
  };
}

function StatSkeleton() {
  return (
    <Card className="rounded-[1.9rem] border-[#E7E7E9] bg-white/90 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)]">
      <div className="h-3.5 w-36 animate-pulse rounded-full bg-[#f3f7fc]" />
      <div className="mt-4 h-9 w-24 animate-pulse rounded-xl bg-[#dbe8ff]" />
    </Card>
  );
}

export default function ReportsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ReportFiltersState>(initialFilters);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const { data, isLoading, error, lastFetch, refetch } = useReports();

  const reports = useMemo(() => (data ?? []).map(mapReport), [data]);

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesQuery = !query
        ? true
        : [report.reportId, report.auditId, report.candidateName, report.role]
            .join(" ")
            .toLowerCase()
            .includes(query);
      const matchesStatus =
        filters.status === "All" ? true : report.status === filters.status;
      const matchesRisk =
        filters.fairnessRisk === "All"
          ? true
          : report.fairnessRisk === filters.fairnessRisk;
      const matchesType =
        filters.reportType === "All"
          ? true
          : report.reportType === filters.reportType;

      return matchesQuery && matchesStatus && matchesRisk && matchesType;
    });
  }, [filters, reports]);

  const previewReport =
    filtered.find((report) => report.reportId === previewId) ??
    reports.find((report) => report.reportId === previewId) ??
    null;

  const stats = [
    { label: "Total reports", value: `${reports.length}` },
    {
      label: "Ready to export",
      value: `${reports.filter((report) => report.status === "Ready").length}`,
    },
    {
      label: "High fairness risk",
      value: `${reports.filter((report) => report.fairnessRisk === "High").length}`,
    },
  ] as const;

  if (error && !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-[#101828]">Failed to load reports</p>
        <p className="text-sm text-[#667085]">{error}</p>
        <Button onClick={refetch} variant="outline" className="rounded-full gap-2">
          <RefreshCcw size={15} /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1463ff]">
            Report monitoring
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#101828]">
            Audit reports
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {lastFetch && (
            <span className="hidden text-xs text-[#667085] sm:block">
              Updated {lastFetch.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-2"
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {isLoading && !data
          ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((stat) => (
              <Card
                key={stat.label}
                className="rounded-[1.9rem] border-[#E7E7E9] bg-white/90 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)]"
              >
                <p className="text-sm text-[#6E6D7A]">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                  {stat.value}
                </p>
              </Card>
            ))}
      </section>

      {error && data ? (
        <div className="rounded-[1.25rem] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ExportReportButton
          selectedReportIds={filtered.map((report) => report.reportId)}
        />
      </div>

      <ReportFilters
        value={filters}
        resultCount={filtered.length}
        onChange={setFilters}
        onReset={() => setFilters(initialFilters)}
      />

      <section className="grid gap-5 xl:grid-cols-2">
        {!isLoading && filtered.length === 0 ? (
          <Card className="rounded-4xl border-[#E7E7E9] bg-white/90 p-8 text-center shadow-[0_20px_50px_rgba(13,12,34,0.06)] xl:col-span-2">
            <p className="text-lg font-semibold text-[#0D0C22]">No reports found</p>
            <p className="mt-2 text-sm text-[#6E6D7A]">
              {reports.length === 0 ? "Completed audits will appear here as reports." : "Try adjusting your filters."}
            </p>
          </Card>
        ) : null}
        {filtered.map((report) => (
          <ReportCard
            key={report.reportId}
            reportId={report.reportId}
            auditId={report.auditId}
            candidateName={report.candidateName}
            role={report.role}
            resumeScore={report.resumeScore}
            jobFit={report.jobFit}
            fairnessRisk={report.fairnessRisk}
            explainability={report.explainability}
            status={report.status}
            createdAt={report.createdAt}
            reportType={report.reportType}
            onExport={() => {}}
            onShare={() => setPreviewId(report.reportId)}
            onRegenerate={() => {}}
            onDelete={() => {}}
          />
        ))}
      </section>

      <ReportPreview
        open={previewId !== null}
        onClose={() => setPreviewId(null)}
        report={
          previewReport
            ? {
                ...previewReport,
                generatedDate: previewReport.createdAt,
                executiveSummary: {
                  overview:
                    "BiasLens generated a review-ready report with balanced scoring, fairness context, and explainability guidance.",
                  keyStrengths: [
                    "Clear evidence chain for the top skills",
                    "Decision summary is audit-ready",
                  ],
                  keyRisks: [
                    "One or more resume claims still need recruiter verification",
                  ],
                },
                improvementSuggestions: {
                  resumeEdits: [
                    "Add stronger quantified outcomes to each role entry.",
                    "Include direct links to portfolio or supporting work.",
                  ],
                },
                auditTrail: [
                  {
                    timestamp: previewReport.createdAt,
                    actor: "BiasLens",
                    action: "Report generated",
                  },
                ],
              }
            : null
        }
        onView={(reportId) => router.push(`/dashboard/reports/${reportId}`)}
        onShare={() => {}}
        onExport={async () => {}}
      />
    </div>
  );
}
