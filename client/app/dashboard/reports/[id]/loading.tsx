import * as React from "react";

// Premium report skeleton loader (Next.js App Router Server Component)

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-[1rem] bg-[#F6F8FB] " +
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.3s_infinite_ease-in-out] " +
        "before:bg-gradient-to-r before:from-transparent before:via-[rgba(37,99,235,0.10)] before:to-transparent " +
        className
      }
      aria-hidden="true"
    />
  );
}

function TextBlock({ lines }: { lines: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={
            i === 0
              ? "h-4 w-[70%]"
              : i === lines - 1
                ? "h-4 w-[85%]"
                : "h-4 w-full"
          }
        />
      ))}
    </div>
  );
}

function CardShell({
  children,
  className,
  sticky,
}: {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}) {
  return (
    <section
      className={
        "rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6 " +
        (sticky ? "sticky top-6 " : "") +
        (className ?? "")
      }
      aria-hidden="true"
    >
      {children}
    </section>
  );
}

export default function ReportDetailLoading() {
  return (
    <div className="min-w-0 space-y-6">
      {/* Header / actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-[220px] rounded-[0.75rem]" />
            <Skeleton className="h-7 w-[340px] rounded-[0.75rem]" />
            <Skeleton className="h-4 w-[260px] rounded-[0.75rem]" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-11 w-[180px] rounded-[1.25rem]" />
          <Skeleton className="h-11 w-[140px] rounded-[1.25rem]" />
        </div>
      </div>

      {/* Header cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CardShell>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-[130px]" />
                  <Skeleton className="h-7 w-[120px]" />
                </div>
                <Skeleton className="h-6 w-[260px]" />
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-[85%]" />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[180px]" />
                    <Skeleton className="h-5 w-[220px]" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="h-8 w-[120px]" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-5 w-[160px]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[95%]" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[88%]" />
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-5 w-[130px]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[92%]" />
                  <Skeleton className="h-4 w-[88%]" />
                  <Skeleton className="h-4 w-[84%]" />
                </div>
              </div>
            </div>
          </CardShell>
        </div>

        {/* Sticky sidebar skeleton */}
        <div className="lg:col-span-4">
          <CardShell sticky>
            <Skeleton className="h-5 w-[180px]" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-2xl" />
                  <Skeleton className={i % 2 === 0 ? "h-5 w-[180px]" : "h-5 w-[190px]"} />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-7 w-[110px]" />
              </div>
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-3 w-[160px] rounded-[0.75rem]" />
                <Skeleton className="h-5 w-[180px]" />
              </div>
            </div>
          </CardShell>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        <CardShell>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-[220px]" />
                <Skeleton className="h-4 w-[420px] max-w-[90%]" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <Skeleton className="h-5 w-[180px]" />
              <TextBlock lines={4} />
            </div>
            <div className="space-y-3 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <Skeleton className="h-5 w-[160px]" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[140px]" />
                      <Skeleton className="h-3 w-[200px]" />
                    </div>
                    <Skeleton className="h-7 w-[110px]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <Skeleton className="h-5 w-[160px]" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[170px]" />
                      <Skeleton className="h-3 w-[230px]" />
                    </div>
                    <Skeleton className="h-9 w-9 rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
              <Skeleton className="h-5 w-[160px]" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[170px]" />
                      <Skeleton className="h-3 w-[240px]" />
                    </div>
                    <Skeleton className="h-9 w-9 rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardShell>

        {/* Additional cards skeleton */}
        <CardShell>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-[220px]" />
                <Skeleton className="h-4 w-[420px] max-w-[90%]" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                <Skeleton className="h-5 w-[220px]" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[160px]" />
                      <Skeleton className="h-3 w-[240px]" />
                    </div>
                    <Skeleton className="h-7 w-[120px]" />
                  </div>
                ))}
              </div>

              <div className="space-y-3 rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                <Skeleton className="h-5 w-[220px]" />
                <div className="grid grid-cols-1 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-[1rem]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardShell>

        {/* Timeline skeleton */}
        <CardShell>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-[190px]" />
                <Skeleton className="h-4 w-[360px] max-w-[90%]" />
              </div>
            </div>

            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-[200px]" />
                      <Skeleton className="h-4 w-[320px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-[110px]" />
                </div>
              ))}
            </div>
          </div>
        </CardShell>

        {/* Document viewer skeleton */}
        <CardShell>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[220px]" />
              <Skeleton className="h-4 w-[520px] max-w-[95%]" />
            </div>
            <Skeleton className="h-11 w-[190px] rounded-[1.25rem]" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4">
                <Skeleton className="h-44 w-full rounded-[1.25rem]" />
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full rounded-[0.75rem]" />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <Skeleton className="h-5 w-[160px]" />
                <div className="mt-3 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className={"h-4 w-[" + (70 + i * 4) + "%]"} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardShell>
      </div>

      {/* Accessible loading announcement */}
      <div className="sr-only" aria-live="polite">
        Loading report details...
      </div>
    </div>
  );
}

