"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ExportReportButton,
  getReportList,
  ReportCard,
  ReportFilters,
  ReportPreview,
} from "@/components/reports";
import type { ReportFiltersState } from "@/components/reports/ReportFilters";
import { Card } from "@/components/ui/card";

const initialFilters: ReportFiltersState = {
  query: "",
  status: "All",
  fairnessRisk: "All",
  reportType: "All",
};

export default function ReportsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ReportFiltersState>(initialFilters);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const reports = useMemo(() => getReportList(), []);

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

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
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
