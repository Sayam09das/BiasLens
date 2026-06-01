import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[color:var(--background-secondary)]",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)]",
        className,
      )}
      {...props}
    />
  );
}
