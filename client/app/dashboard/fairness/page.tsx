import {
  BiasHeatmap,
  BiasSeverityScore,
  CounterfactualView,
  FairnessChart,
  FairnessMetrics,
} from "@/components/fairness";
import { Card } from "@/components/ui/card";

const fairnessStats = [
  {
    label: "Overall fairness score",
    value: "63",
    detail: "Improved 5 points over the last 4 audit runs",
  },
  {
    label: "Highest-risk signal",
    value: "Career Gap",
    detail: "Shows the strongest disparity across candidate groups",
  },
  {
    label: "Counterfactual stability",
    value: "74%",
    detail: "Most recommendations remain stable under controlled rewrites",
  },
] as const;

export default function FairnessPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {fairnessStats.map((stat) => (
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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <FairnessMetrics
          trend={{
            demographicParityGap: { dir: "down", label: "Improving" },
            equalizedOddsDifference: { dir: "down", label: "Narrowing" },
            counterfactualConsistency: { dir: "up", label: "More stable" },
            fairnessScore: { dir: "up", label: "+5 points" },
            groupScoreVariance: { dir: "down", label: "Variance reduced" },
          }}
        />
        <BiasSeverityScore
          score={63}
          label="Bias severity across this audit cohort"
        />
      </section>

      <FairnessChart />
      <BiasHeatmap />
      <CounterfactualView />
    </div>
  );
}
