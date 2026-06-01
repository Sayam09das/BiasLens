import { AuditHistory, auditHistoryRecords, auditSummaryMetrics } from "@/components/audit";
import { Card } from "@/components/ui/card";

export default function AuditsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {auditSummaryMetrics.map((metric) => (
          <Card
            key={metric.label}
            className="rounded-[1.9rem] border-[#E7E7E9] bg-white/90 p-5 shadow-[0_20px_50px_rgba(13,12,34,0.06)]"
          >
            <p className="text-sm text-[#6E6D7A]">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-[#6E6D7A]">{metric.detail}</p>
          </Card>
        ))}
      </section>

      <AuditHistory records={auditHistoryRecords} />
    </div>
  );
}
