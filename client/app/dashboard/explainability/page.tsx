"use client";

import { RefreshCcw } from "lucide-react";

import { ExplanationViewer, FeatureImportance, ProxySignalTable, ShapChart } from "@/components/explainability";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExplainability } from "@/hooks/useExplainability";

function StatSkeleton() {
  return (
    <Card className="rounded-[1.9rem] border-[#E7E7E9] bg-white/90 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)]">
      <div className="h-3.5 w-36 animate-pulse rounded-full bg-[#f3f7fc]" />
      <div className="mt-4 h-9 w-28 animate-pulse rounded-xl bg-[#dbe8ff]" />
      <div className="mt-3 h-3 w-48 animate-pulse rounded-full bg-[#f3f7fc]" />
    </Card>
  );
}

function SectionSkeleton({ height = 320 }: { height?: number }) {
  return <div className="animate-pulse rounded-[2rem] bg-[#f3f7fc]" style={{ height }} />;
}

export default function ExplainabilityPage() {
  const { data, isLoading, error, lastFetch, refetch } = useExplainability();

  if (error && !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-[#101828]">Failed to load explainability data</p>
        <p className="text-sm text-[#667085]">{error}</p>
        <Button onClick={refetch} variant="outline" className="rounded-full gap-2">
          <RefreshCcw size={15} /> Retry
        </Button>
      </div>
    );
  }

  const explainabilityStats = data
    ? [
        {
          label: "Top positive driver",
          value: data.stats.topPositiveDriver,
          detail: `Across ${data.stats.totalReports} report${data.stats.totalReports !== 1 ? "s" : ""}`,
        },
        {
          label: "Top negative driver",
          value: data.stats.topNegativeDriver,
          detail: "Strongest confidence-reducing signal in the latest explainability run",
        },
        {
          label: "Proxy signals flagged",
          value: String(data.stats.proxySignalCount),
          detail: `${data.proxySignals.filter((item) => item.status === "Action Needed").length} need action right now`,
        },
      ]
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1463ff]">
            Explainability monitoring
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#101828]">
            Model reasoning dashboard
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
          : explainabilityStats!.map((stat) => (
              <Card
                key={stat.label}
                className="rounded-[1.9rem] border-[#E7E7E9] bg-white/90 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)]"
              >
                <p className="text-sm text-[#6E6D7A]">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#6E6D7A]">{stat.detail}</p>
              </Card>
            ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        {isLoading && !data ? (
          <>
            <SectionSkeleton height={430} />
            <SectionSkeleton height={430} />
          </>
        ) : (
          <>
            <ShapChart values={data!.shap} />
            <FeatureImportance features={data!.features} />
          </>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        {isLoading && !data ? (
          <>
            <SectionSkeleton height={520} />
            <SectionSkeleton height={520} />
          </>
        ) : (
          <>
            <ExplanationViewer explanation={data!.explanation} />
            <ProxySignalTable signals={data!.proxySignals} />
          </>
        )}
      </section>
    </div>
  );
}
