"use client";

import { RefreshCcw } from "lucide-react";
import {
  BiasHeatmap,
  BiasSeverityScore,
  CounterfactualView,
  FairnessChart,
  FairnessMetrics,
} from "@/components/fairness";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFairness } from "@/hooks/useFairness";

// ── Skeleton card ─────────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <Card className="rounded-[1.9rem] border-[#E7E7E9] bg-white/90 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)]">
      <div className="h-3.5 w-36 animate-pulse rounded-full bg-[#f3f7fc]" />
      <div className="mt-4 h-9 w-20 animate-pulse rounded-xl bg-[#dbe8ff]" />
      <div className="mt-3 h-3 w-48 animate-pulse rounded-full bg-[#f3f7fc]" />
    </Card>
  );
}

function SectionSkeleton({ height = 320 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded-[2rem] bg-[#f3f7fc]"
      style={{ height }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FairnessPage() {
  const { data, isLoading, error, lastFetch, refetch } = useFairness();

  // ── Error state ──
  if (error && !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-[#101828]">Failed to load fairness data</p>
        <p className="text-sm text-[#667085]">{error}</p>
        <Button onClick={refetch} variant="outline" className="rounded-full gap-2">
          <RefreshCcw size={15} /> Retry
        </Button>
      </div>
    );
  }

  const stats = data
    ? [
        {
          label:  "Overall fairness score",
          value:  String(data.stats.overallFairnessScore),
          detail: `Based on ${data.stats.totalReports} report${data.stats.totalReports !== 1 ? "s" : ""}`,
        },
        {
          label:  "Highest-risk signal",
          value:  data.stats.highestRiskSignal,
          detail: "Shows the strongest disparity across candidate groups",
        },
        {
          label:  "Counterfactual stability",
          value:  `${data.stats.counterfactualStability}%`,
          detail: "Most recommendations remain stable under controlled rewrites",
        },
      ]
    : null;

  // Trend direction helpers for FairnessMetrics
  const trend = data
    ? {
        demographicParityGap:      { dir: "down" as const, label: "Improving"       },
        equalizedOddsDifference:   { dir: "down" as const, label: "Narrowing"       },
        counterfactualConsistency: { dir: "up"   as const, label: "More stable"     },
        fairnessScore:             { dir: "up"   as const, label: `${data.stats.overallFairnessScore} pts` },
        groupScoreVariance:        { dir: "down" as const, label: "Variance reduced" },
      }
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header row with last-updated + refresh */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1463ff]">
            Fairness monitoring
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#101828]">
            Bias &amp; fairness dashboard
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

      {/* Stats row */}
      <section className="grid gap-4 md:grid-cols-3">
        {isLoading && !data
          ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
          : stats!.map((stat) => (
              <Card
                key={stat.label}
                className="rounded-[1.9rem] border-[#E7E7E9] bg-white/90 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)]"
              >
                <p className="text-sm text-[#667085]">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#101828]">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#667085]">{stat.detail}</p>
              </Card>
            ))}
      </section>

      {/* Metrics + severity gauge */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        {isLoading && !data ? (
          <>
            <SectionSkeleton height={380} />
            <SectionSkeleton height={380} />
          </>
        ) : (
          <>
            <FairnessMetrics
              values={data!.metrics}
              trend={trend}
            />
            <BiasSeverityScore
              score={data!.metrics.fairnessScore}
              label="Bias severity across this audit cohort"
            />
          </>
        )}
      </section>

      {/* Charts */}
      {isLoading && !data ? (
        <SectionSkeleton height={480} />
      ) : (
        <FairnessChart
          values={{
            fairnessScore:             data!.metrics.fairnessScore,
            parityGap:                 data!.metrics.demographicParityGap,
            equalizedOdds:             data!.metrics.equalizedOddsDifference,
            counterfactualConsistency: data!.metrics.counterfactualConsistency,
            groupComparison:           data!.groupComparison,
            trend:                     data!.trend,
          }}
        />
      )}

      {/* Heatmap */}
      {isLoading && !data ? (
        <SectionSkeleton height={360} />
      ) : (
        <BiasHeatmap values={data!.heatmap as Parameters<typeof BiasHeatmap>[0]["values"]} />
      )}

      {/* Counterfactuals */}
      {isLoading && !data ? (
        <SectionSkeleton height={320} />
      ) : (
        <CounterfactualView examples={data!.counterfactuals} />
      )}
    </div>
  );
}
