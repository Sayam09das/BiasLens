"use client";

import { cn } from "@/lib/utils";

import { AuditStatus as AuditStatusType } from "./types";

const statusClasses: Record<AuditStatusType, string> = {
  completed: "border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]",
  running: "border-[#C7D2FE] bg-[#EEF2FF] text-[#4338CA]",
  queued: "border-[#E5E7EB] bg-[#F8FAFC] text-[#475467]",
  failed: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
};

const labelMap: Record<AuditStatusType, string> = {
  completed: "Completed",
  running: "Running",
  queued: "Queued",
  failed: "Failed",
};

export default function AuditStatus({
  status,
  pulse = true,
  className,
}: {
  status: AuditStatusType;
  pulse?: boolean;
  className?: string;
}) {
  const animate = pulse && (status === "running" || status === "queued");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        statusClasses[status],
        className,
      )}
    >
      <span
        className={cn(
          "h-2.5 w-2.5 rounded-full bg-current",
          animate && "animate-pulse",
        )}
        aria-hidden="true"
      />
      {labelMap[status]}
    </span>
  );
}
