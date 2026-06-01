import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

import AuditStatus from "./AuditStatus";
import { AuditDetailData } from "./types";

function formatDate(iso: string) {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return iso;

  return value.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function AuditSummary({ audit }: { audit: AuditDetailData }) {
  const summaryRows = [
    { label: "Audit ID", value: audit.auditId },
    { label: "Candidate", value: audit.candidateName },
    { label: "Role", value: audit.role },
    { label: "Created", value: formatDate(audit.createdAt) },
  ];

  return (
    <Card className="rounded-4xl border-[#E7E7E9] bg-white/70 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
            Audit Summary
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
            {audit.candidateName}
          </h2>
          <p className="mt-2 text-sm text-[#6E6D7A]">
            {audit.role} review with explainability and fairness context.
          </p>
        </div>

        <AuditStatus status={audit.status} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {summaryRows.map((row) => (
          <div
            key={row.label}
            className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
          >
            <p className="text-xs font-semibold text-[#6E6D7A]">{row.label}</p>
            <p className="mt-2 text-sm font-semibold text-[#0D0C22]">
              {row.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-[#DBEAFE] bg-[#EFF6FF] p-4">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="mt-0.5 text-[#2563EB]" />
          <div>
            <p className="text-sm font-semibold text-[#0D0C22]">
              Decision-ready explanation
            </p>
            <p className="mt-1 text-xs text-[#45628F]">
              Scores are paired with evidence, mitigation guidance, and a traceable audit timeline.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
