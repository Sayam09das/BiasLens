import { Card } from "@/components/ui/card";

import { AuditTimelineEvent } from "./types";

export default function AuditTimeline({
  events,
}: {
  events: AuditTimelineEvent[];
}) {
  return (
    <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
          Audit Timeline
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[#0D0C22]">
          Traceability from upload to report
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        {events.map((event, index) => (
          <div key={`${event.label}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-3 w-3 rounded-full bg-[#2563EB]" />
              {index < events.length - 1 ? (
                <span className="mt-2 h-full w-px bg-[#DBEAFE]" />
              ) : null}
            </div>

            <div className="min-w-0 flex-1 rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#0D0C22]">
                  {event.label}
                </p>
                {event.at ? (
                  <span className="text-xs font-medium text-[#6E6D7A]">
                    {event.at}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-[#6E6D7A]">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
