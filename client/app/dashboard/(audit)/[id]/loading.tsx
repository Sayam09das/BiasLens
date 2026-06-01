"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ShimmerSweep({
  className,
  delaySeconds = 0,
}: {
  className?: string;
  delaySeconds?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      <motion.div
        aria-hidden="true"
        className={className}
        style={{
          background:
            "linear-gradient(90deg, rgba(37,99,235,0.0) 0%, rgba(37,99,235,0.55) 45%, rgba(37,99,235,0.0) 100%)",
        }}
        initial={{ x: "-120%", opacity: 0.35 }}
        animate={
          reduceMotion
            ? { x: 0, opacity: 0.85 }
            : { x: ["-120%", "120%"], opacity: [0.25, 0.95, 0.25] }
        }
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : {
                duration: 1.35 + delaySeconds,
                repeat: 0,
                ease: "easeInOut",
                delay: delaySeconds,
              }
        }
      />
    </AnimatePresence>
  );
}

export default function Loading() {
  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden bg-[#FFFFFF] text-[#0D0C22]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Premium gradient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -80px, rgba(37, 99, 235, 0.18), transparent 55%), radial-gradient(900px 500px at 15% 20%, rgba(37, 99, 235, 0.10), transparent 50%), radial-gradient(800px 480px at 85% 30%, rgba(37, 99, 235, 0.08), transparent 55%)",
        }}
      />

      {/* Subtle stripe texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.65]"
        style={{
          backgroundImage:
            "linear-gradient(transparent 0 49px, rgba(37, 99, 235, 0.06) 49px 50px)",
          backgroundSize: "100% 50px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 70%)",
        }}
      />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-0">
        {/* HEADER */}
        <div className="flex flex-col gap-4 px-0 pb-6 pt-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-44 rounded-full bg-[#EFF6FF]" />
              <Skeleton className="h-4 w-28 rounded-full bg-[#F3F7FC]" />
            </div>
            <Skeleton className="mt-3 h-10 w-[18rem] max-w-full rounded-[1rem] bg-[#EFF6FF]" />
            <Skeleton className="mt-3 h-4 w-[26rem] max-w-full rounded-full bg-[#F3F7FC]" />
          </div>

          {/* Header controls skeleton (no real buttons) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative inline-flex items-center rounded-full border border-[#DBEAFE] bg-[#EFF6FF]/70 px-4 py-2 shadow-[0_10px_30px_-15px_rgba(13,12,34,0.22)] backdrop-blur">
              <Skeleton className="h-2.5 w-2.5 rounded-full bg-[#2563EB]/70" />
              <Skeleton className="ml-2 h-3.5 w-24 rounded-full bg-[#2563EB]/20" />
              <ShimmerSweep className="absolute inset-0 opacity-70 rounded-full" delaySeconds={0.1} />
            </div>

            <Skeleton className="h-10 w-36 rounded-[1.5rem] bg-[#EFF6FF]" />
            <Skeleton className="h-10 w-36 rounded-[1.5rem] bg-[#F3F7FC]" />
            <Skeleton className="h-10 w-36 rounded-[1.5rem] bg-[#F3F7FC]" />
          </div>
        </div>

        {/* SUMMARY + SCORE CARDS */}
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Audit Summary */}
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40 rounded-xl bg-[#EFF6FF]" />
              <Skeleton className="h-4 w-72 rounded-full bg-[#F3F7FC]" />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                "Audit ID",
                "Candidate Name",
                "Audit Status",
                "Created Date",
              ].map((k, idx) => (
                <div
                  key={k}
                  className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
                >
                  <Skeleton className="h-3.5 w-28 rounded-full bg-[#6E6D7A]/20" />
                  <div className="mt-2">
                    <Skeleton
                      className={`h-4.5 w-${idx % 2 === 0 ? "32" : "40"} rounded-xl bg-[#EFF6FF]`}
                    />
                  </div>
                </div>
              ))}

              {/* Explanation banner */}
              <div className="sm:col-span-2 mt-1 rounded-[1.5rem] border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-2xl bg-[#2563EB]/15" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-56 rounded-xl bg-[#EFF6FF]" />
                    <Skeleton className="h-3.5 w-[26rem] max-w-full rounded-full bg-[#F3F7FC]" />
                  </div>
                </div>
                <div className="mt-3 relative overflow-hidden rounded-[1rem]">
                  <div className="absolute inset-0 opacity-[0.5]">
                    <ShimmerSweep className="absolute inset-0" delaySeconds={0.2} />
                  </div>
                  <Skeleton className="h-10 w-full rounded-[1rem] bg-white/40" />
                </div>
              </div>
            </div>
          </Card>

          {/* Score stack */}
          <div className="space-y-5">
            {/* Resume Score */}
            <Card className="relative overflow-hidden rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(700px 220px at 50% -60px, rgba(37,99,235,0.18), rgba(255,255,255,0) 60%)",
                }}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Skeleton className="h-3.5 w-36 rounded-full bg-[#EFF6FF]" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Skeleton className="h-10 w-16 rounded-xl bg-[#EFF6FF]" />
                      <Skeleton className="h-3.5 w-24 rounded-full bg-[#F3F7FC]" />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Skeleton className="h-2 w-full rounded-full bg-[#0D0C22]/[0.08]" />
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#0D0C22]/[0.06] relative">
                    <ShimmerSweep
                      className="absolute inset-0"
                      delaySeconds={0.12}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Job Fit */}
              <Card className="relative overflow-hidden rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
                <div className="relative">
                  <Skeleton className="h-3.5 w-24 rounded-full bg-[#EFF6FF]" />
                  <div className="mt-4 flex items-center justify-between">
                    <Skeleton className="h-10 w-14 rounded-xl bg-[#EFF6FF]" />
                    <Skeleton className="h-3.5 w-16 rounded-full bg-[#F3F7FC]" />
                  </div>
                  <div className="mt-4">
                    <Skeleton className="h-2 w-full rounded-full bg-[#0D0C22]/[0.08]" />
                  </div>
                </div>
              </Card>

              {/* Skills Match */}
              <Card className="relative overflow-hidden rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
                <div className="relative">
                  <Skeleton className="h-3.5 w-28 rounded-full bg-[#EFF6FF]" />
                  <div className="mt-4 flex items-center justify-between">
                    <Skeleton className="h-10 w-14 rounded-xl bg-[#EFF6FF]" />
                    <Skeleton className="h-3.5 w-16 rounded-full bg-[#F3F7FC]" />
                  </div>
                  <div className="mt-4">
                    <Skeleton className="h-2 w-full rounded-full bg-[#0D0C22]/[0.08]" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Fairness Risk */}
            <Card className="relative overflow-hidden rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
              <div className="relative">
                <Skeleton className="h-3.5 w-32 rounded-full bg-[#EFF6FF]" />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-16 rounded-xl bg-[#F3F7FC]" />
                    <Skeleton className="h-3.5 w-28 rounded-full bg-[#F3F7FC]" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-16 rounded-full bg-[#F3F7FC]" />
                    <Skeleton className="h-4 w-24 rounded-full bg-[#EFF6FF]" />
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#0D0C22]/[0.06] relative">
                  <ShimmerSweep
                    className="absolute inset-0"
                    delaySeconds={0.18}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CHARTS */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-44 rounded-xl bg-[#EFF6FF]" />
              <Skeleton className="h-4 w-72 rounded-full bg-[#F3F7FC]" />
            </div>
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3"
                >
                  <Skeleton className="h-4 w-40 rounded-full bg-[#F3F7FC]" />
                  <Skeleton className="h-4 w-24 rounded-full bg-[#EFF6FF]" />
                </div>
              ))}
            </div>
            <div className="mt-5 h-[168px] w-full overflow-hidden rounded-[1.5rem] bg-[#F3F7FC]/40 relative">
              <div aria-hidden="true" className="absolute inset-0 opacity-70">
                <ShimmerSweep className="absolute inset-0" delaySeconds={0.1} />
              </div>
              <Skeleton className="h-full w-full rounded-[1.5rem] bg-white/20" />
            </div>
          </Card>

          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-52 rounded-xl bg-[#EFF6FF]" />
              <Skeleton className="h-4 w-72 rounded-full bg-[#F3F7FC]" />
            </div>

            {/* Two chart cards-ish */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
                >
                  <Skeleton className="h-4 w-28 rounded-full bg-[#EFF6FF]" />
                  <div className="mt-3 h-24 w-full overflow-hidden rounded-[1.25rem] bg-[#0D0C22]/[0.06] relative">
                    <ShimmerSweep className="absolute inset-0" delaySeconds={0.14 + i * 0.08} />
                    <div className="absolute left-4 right-4 bottom-4 flex items-end gap-2">
                      {[0.45, 0.75, 0.6, 0.9, 0.55].map((h, idx) => (
                        <div
                          key={idx}
                          className="flex-1 rounded-[0.7rem] bg-[#2563EB]/15"
                          style={{ height: `${h * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Skeleton className="h-3.5 w-36 rounded-full bg-[#F3F7FC]" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* TIMELINE */}
        <Card className="mt-6 rounded-[2rem] border-[#E7E7E9] bg-white/70 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40 rounded-xl bg-[#EFF6FF]" />
            <Skeleton className="h-4 w-72 rounded-full bg-[#F3F7FC]" />
          </div>

          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4"
              >
                <Skeleton className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2563EB]/30" />
                <div className="w-full">
                  <Skeleton className="h-4 w-24 rounded-full bg-[#EFF6FF]" />
                  <Skeleton className="mt-2 h-4 w-[38rem] max-w-full rounded-full bg-[#F3F7FC]" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* REPORT SECTION */}
        <div className="mt-6 space-y-5">
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-52 rounded-xl bg-[#EFF6FF]" />
                <Skeleton className="h-4 w-[32rem] max-w-full rounded-full bg-[#F3F7FC]" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-10 w-40 rounded-[1.5rem] bg-[#EFF6FF]" />
                <Skeleton className="h-10 w-36 rounded-[1.5rem] bg-[#F3F7FC]" />
                <Skeleton className="h-10 w-28 rounded-[1.5rem] bg-[#F3F7FC]" />
              </div>
            </div>

            {/* Report body preview */}
            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-2xl bg-[#2563EB]/15" />
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-56 rounded-xl bg-[#EFF6FF]" />
                      <Skeleton className="h-4 w-[26rem] max-w-full rounded-full bg-[#F3F7FC]" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4">
                  <Skeleton className="h-4 w-44 rounded-full bg-[#EFF6FF]" />
                  <div className="mt-3 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-[36rem] max-w-full rounded-full bg-[#F3F7FC]" />
                        <Skeleton className="h-2.5 w-full rounded-full bg-[#0D0C22]/[0.06]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/60 p-4">
                  <Skeleton className="h-4 w-40 rounded-full bg-[#EFF6FF]" />
                  <div className="mt-4 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-2xl bg-[#EFF6FF]" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3.5 w-44 rounded-full bg-[#F3F7FC]" />
                          <Skeleton className="h-2.5 w-full rounded-full bg-[#0D0C22]/[0.06]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.5rem] border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                  <div aria-hidden="true" className="absolute inset-0 opacity-70">
                    <ShimmerSweep className="absolute inset-0" delaySeconds={0.2} />
                  </div>
                  <Skeleton className="relative h-5 w-52 rounded-xl bg-[#EFF6FF]" />
                  <Skeleton className="relative mt-3 h-4 w-[26rem] max-w-full rounded-full bg-[#F3F7FC]" />
                  <Skeleton className="relative mt-5 h-12 w-full rounded-[1.25rem] bg-white/40" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="pb-8" />
      </main>

      {/* subtle shimmer glow at bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-[120%] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(37,99,235,0.0) 0%, rgba(37,99,235,0.16) 40%, rgba(37,99,235,0.0) 100%)",
          filter: "blur(14px)",
          opacity: 0.9,
        }}
      />
    </div>
  );
}

