"use client";

import { RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";

import { ReportViewer } from "@/components/reports";
import { Button } from "@/components/ui/button";
import { useReport } from "@/hooks/useReports";
import { mapBackendReportToViewer } from "@/lib/report-mappers";

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const reportId = typeof params?.id === "string" ? params.id : null;
  const { data, isLoading, error, refetch } = useReport(reportId);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#dbe8ff] border-t-[#1463ff]" />
          <p className="text-sm text-[#667085]">Loading report…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-[#101828]">Failed to load report</p>
        <p className="text-sm text-[#667085]">{error ?? "This report could not be found."}</p>
        <Button onClick={refetch} variant="outline" className="gap-2 rounded-full">
          <RefreshCcw size={15} />
          Retry
        </Button>
      </div>
    );
  }

  return <ReportViewer report={mapBackendReportToViewer(data)} />;
}
