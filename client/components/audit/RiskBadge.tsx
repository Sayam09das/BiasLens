import { cn } from "@/lib/utils";

import { RiskLevel } from "./types";

const levelClasses: Record<RiskLevel, string> = {
  low: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
  moderate: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
  high: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
};

export default function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize",
        levelClasses[level],
        className,
      )}
    >
      {level} risk
    </span>
  );
}
