import {
  ExplanationViewer,
  FeatureImportance,
  ProxySignalTable,
  ShapChart,
} from "@/components/explainability";
import { Card } from "@/components/ui/card";

const explainabilityStats = [
  {
    label: "Top positive driver",
    value: "Product Strategy",
    detail: "Strongest upward contribution in the current audit batch",
  },
  {
    label: "Top negative driver",
    value: "Missing Portfolio",
    detail: "Largest confidence-reducing signal in recent resumes",
  },
  {
    label: "Proxy signals flagged",
    value: "5",
    detail: "2 need action and 2 more should be reviewed",
  },
] as const;

export default function ExplainabilityPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {explainabilityStats.map((stat) => (
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
        <ShapChart />
        <FeatureImportance />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        <ExplanationViewer />
        <ProxySignalTable />
      </section>
    </div>
  );
}
