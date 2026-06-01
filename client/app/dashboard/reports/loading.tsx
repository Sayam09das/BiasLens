import * as React from "react";

type SkeletonBlockProps = Readonly<{
  className?: string;
  label?: string;
}>;

function SkeletonBlock({ className, label }: SkeletonBlockProps) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-[0.75rem] bg-[#F6F8FB] " +
        (className ?? "")
      }
      aria-label={label}
      role={label ? "status" : "presentation"}
    >
      <div className="skeleton-shimmer absolute inset-0" />
    </div>
  );
}

export default function ReportsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      {/* Page header skeleton */}
      <section
        className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-6 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:px-6"
        aria-label="Reports loading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <SkeletonBlock
              className="h-4 w-40"
              label="Loading reports header"
            />
            <SkeletonBlock className="mt-2 h-9 w-56" />
            <SkeletonBlock className="mt-3 h-4 w-[min(720px,100%)]" />
            <SkeletonBlock className="mt-2 h-4 w-[min(560px,100%)]" />
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <SkeletonBlock className="h-11 w-44" />
            <SkeletonBlock className="h-11 w-40" />
          </div>
        </div>
      </section>

      {/* Statistics cards skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)]"
          >
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="mt-3 h-9 w-20" />
            <SkeletonBlock className="mt-3 h-3 w-28" />
            <SkeletonBlock className="absolute" />
          </div>
        ))}
      </div>

      {/* Search + filter bar skeleton */}
      <div
        className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:p-6"
        aria-label="Loading search and filters"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="mt-2 h-11 w-full" />
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-3">
              <SkeletonBlock className="h-11 w-[min(220px,100%)]" />
              <SkeletonBlock className="h-11 w-[min(220px,100%)]" />
              <SkeletonBlock className="h-11 w-[min(200px,100%)]" />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <SkeletonBlock className="h-11 w-[min(240px,100%)]" />
              <SkeletonBlock className="h-11 w-[min(260px,100%)]" />
              <SkeletonBlock className="h-11 w-28 ml-auto" />
            </div>

            <div className="mt-4">
              <SkeletonBlock className="h-3 w-32" />
              <SkeletonBlock className="mt-2 h-10 w-full" />
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <SkeletonBlock className="h-3 w-[min(320px,100%)]" />
              <SkeletonBlock className="h-3 w-[min(220px,100%)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div
        className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:p-6"
        aria-label="Loading reports table"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-4 w-4 rounded-[0.5rem]" />
            <SkeletonBlock className="h-4 w-28" />
          </div>
          <SkeletonBlock className="h-4 w-[min(240px,100%)]" />
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 rounded-2xl bg-[#F6F8FB] p-3">
              {Array.from({ length: 12 }).map((_, idx) => (
                <SkeletonBlock key={idx} className="h-4 w-full rounded-[0.5rem]" />
              ))}
            </div>

            {/* Table rows */}
            <div className="mt-3 space-y-2">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] p-3"
                >
                  {Array.from({ length: 12 }).map((__, j) => (
                    <SkeletonBlock
                      key={j}
                      className={
                        j === 0
                          ? "h-4 w-4 rounded-[0.5rem]"
                          : j === 10
                            ? "h-9 w-20"
                            : "h-4 w-full"
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-10 w-20 rounded-[1.25rem]" />
            <SkeletonBlock className="h-10 w-20 rounded-[1.25rem]" />
            <SkeletonBlock className="h-10 w-20 rounded-[1.25rem]" />
            <SkeletonBlock className="h-10 w-20 rounded-[1.25rem]" />
          </div>
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-4 w-60" />
            <SkeletonBlock className="h-10 w-28 rounded-[1.25rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}

