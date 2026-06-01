"use client";

import React from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-0" role="status" aria-live="polite">
      {/* Page header skeleton */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-36 rounded-full bg-[#EFF6FF]" />
          <Skeleton className="h-4 w-24 rounded-full bg-[#EFF6FF]" />
        </div>
        <Skeleton className="mt-3 h-10 w-2/3 rounded-3xl bg-[#EFF6FF]" />
        <Skeleton className="mt-3 h-4 w-5/6 rounded-full bg-[#F3F7FC]" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Upload Zone skeleton + Resume preview skeleton */}
        <div className="space-y-5">
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-44 rounded-xl bg-[#EFF6FF]" />
                <Skeleton className="mt-2 h-4 w-72 rounded-full bg-[#F3F7FC]" />
              </div>
              <Skeleton className="h-10 w-48 rounded-full bg-[#EFF6FF]" />
            </div>

            <div
              className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-dashed border-[#DBEAFE] bg-[linear-gradient(180deg,rgba(239,246,255,0.65)_0%,rgba(255,255,255,0.55)_100%)] p-6"
              aria-label="Upload zone skeleton"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, rgba(37,99,235,0.0) 0%, rgba(37,99,235,0.20) 45%, rgba(37,99,235,0.0) 100%)",
                }}
              />

              <div className="flex flex-col items-center justify-center gap-3 text-center relative z-10">
                <Skeleton className="h-12 w-12 rounded-2xl bg-[#EFF6FF]" />
                <Skeleton className="h-5 w-52 rounded-xl bg-[#EFF6FF]" />
                <Skeleton className="h-4 w-80 rounded-full bg-[#F3F7FC]" />
                <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-2">
                  <Skeleton className="h-10 w-40 rounded-2xl bg-[#EFF6FF]" />
                  <Skeleton className="h-10 w-28 rounded-2xl bg-[#2563EB]/10" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-48 rounded-xl bg-[#EFF6FF]" />
                <Skeleton className="mt-2 h-4 w-72 rounded-full bg-[#F3F7FC]" />
              </div>
              <Skeleton className="h-10 w-10 rounded-2xl bg-[#EFF6FF]" />
            </div>
            <div className="mt-4">
              <div className="flex flex-col gap-4 rounded-[1.5rem] border border-[#E7E7E9] bg-white/50 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-2xl bg-[#EFF6FF]" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-56 rounded-xl bg-[#EFF6FF]" />
                    <Skeleton className="h-4 w-40 rounded-full bg-[#F3F7FC]" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-28 rounded-2xl bg-[#EFF6FF]" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Form skeleton (Job description + config + CTA) */}
        <div className="space-y-5">
          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-48 rounded-xl bg-[#EFF6FF]" />
                <Skeleton className="mt-2 h-4 w-72 rounded-full bg-[#F3F7FC]" />
              </div>
              <Skeleton className="h-10 w-28 rounded-full bg-[#EFF6FF]" />
            </div>

            <div className="mt-4">
              <Skeleton className="h-[168px] w-full rounded-[1.25rem] bg-[#F3F7FC]" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-28 rounded-full bg-[#F3F7FC]" />
                <Skeleton className="h-8 w-24 rounded-2xl bg-[#EFF6FF]" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-4 w-3/4 rounded-full bg-[#F3F7FC]" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/70 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-60 rounded-xl bg-[#EFF6FF]" />
                <Skeleton className="mt-2 h-4 w-72 rounded-full bg-[#F3F7FC]" />
              </div>
              <Skeleton className="h-9 w-24 rounded-2xl bg-[#EFF6FF]" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-lg bg-[#2563EB]/15" />
                  <Skeleton className="h-4 w-28 rounded-full bg-[#F3F7FC]" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full bg-[#2563EB]/10" />
              </div>

              <div className="flex items-center justify-between rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-lg bg-[#2563EB]/15" />
                  <Skeleton className="h-4 w-36 rounded-full bg-[#F3F7FC]" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full bg-[#2563EB]/10" />
              </div>

              <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-white/60 px-4 py-3">
                <Skeleton className="h-4 w-40 rounded-full bg-[#F3F7FC]" />
                <div className="mt-2 h-2 w-full rounded-full bg-[#0D0C22]/[0.06] overflow-hidden">
                  <motion.div
                    aria-hidden="true"
                    className="h-full rounded-full bg-[#2563EB]"
                    initial={{ x: "-60%" }}
                    animate={{ x: "60%" }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <Skeleton className="mt-3 h-4 w-28 rounded-full bg-[#F3F7FC]" />
              </div>
            </div>

            <div className="mt-4">
              <Skeleton className="h-12 w-full rounded-[1.5rem] bg-[#2563EB]/20" />
              <Skeleton className="mt-3 h-4 w-4/5 mx-auto rounded-full bg-[#F3F7FC]" />
            </div>
          </Card>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div className="mt-8 hidden lg:block">
        <Card className="sticky top-4 rounded-[2rem] border-[#E7E7E9] bg-white/88 p-4 shadow-[0_24px_64px_rgba(13,12,34,0.08)] backdrop-blur">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-2xl bg-[#2563EB]/20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-full bg-[#EFF6FF]" />
              <Skeleton className="h-3 w-36 rounded-full bg-[#F3F7FC]" />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-2xl bg-[#EFF6FF]" />
                <Skeleton className="h-4 w-28 rounded-full bg-[#F3F7FC]" />
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-[#DBEAFE] bg-[#EFF6FF] p-4">
            <Skeleton className="h-4 w-44 rounded-full bg-[#2563EB]/20" />
            <Skeleton className="mt-3 h-4 w-11/12 rounded-full bg-[#F3F7FC]" />
            <Skeleton className="mt-2 h-4 w-9/12 rounded-full bg-[#F3F7FC]" />
          </div>
        </Card>
      </div>
    </div>
  );
}

