import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

import { AuditDetailData } from "./types";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
      <h3 className="text-xl font-semibold text-[#0D0C22]">{title}</h3>
      <p className="mt-2 text-sm text-[#6E6D7A]">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

export default function AuditDetails({ audit }: { audit: AuditDetailData }) {
  return (
    <div className="space-y-5">
      <Section
        title="Candidate Overview"
        subtitle="Narrative takeaways extracted from the resume and scoring rubric."
      >
        <ul className="space-y-3">
          {audit.overview.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-[#2563EB]" />
              <p className="text-sm text-[#0D0C22]">{item}</p>
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section
          title="Audit Metadata"
          subtitle="Operational context for reviewers and downstream reporting."
        >
          <div className="space-y-3">
            {audit.metadata.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3"
              >
                <p className="text-sm font-semibold text-[#0D0C22]">
                  {item.label}
                </p>
                <p className="text-sm text-[#6E6D7A]">{item.value}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Explainability Insights"
          subtitle="Transparent reasons behind the model’s recommendation."
        >
          <div className="space-y-4">
            {audit.explainabilityInsights.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
              >
                <p className="text-sm font-semibold text-[#0D0C22]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-[#6E6D7A]">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section
          title="Fairness Analysis"
          subtitle="Risk framing and mitigation guidance before a final decision."
        >
          <div className="space-y-4">
            {audit.fairnessAnalysis.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
              >
                <p className="text-sm font-semibold text-[#0D0C22]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-[#6E6D7A]">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Improvement Suggestions"
          subtitle="Concrete changes that would strengthen evidence quality and reviewer confidence."
        >
          <div className="grid gap-3">
            {audit.improvementSuggestions.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
              >
                <p className="text-sm text-[#0D0C22]">{item}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
