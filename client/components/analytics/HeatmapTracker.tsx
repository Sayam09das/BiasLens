"use client";

import { useState } from "react";
import { Monitor, Smartphone, Tablet, Clock, Flame } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

const pageSections = [
  { label: "Hero / CTA", clicks: 3842, pct: 92 },
  { label: "Audit pipeline", clicks: 2910, pct: 70 },
  { label: "Resume uploader", clicks: 2481, pct: 60 },
  { label: "Fairness metrics", clicks: 1763, pct: 42 },
  { label: "Explainability panel", clicks: 1204, pct: 29 },
  { label: "Reports section", clicks: 874, pct: 21 },
  { label: "Settings / nav", clicks: 512, pct: 12 },
];

const recentInteractions = [
  { action: "Clicked\"New audit\"", page: "/dashboard", device: "desktop", ago: "2s ago" },
  { action: "Scrolled to fairness chart", page: "/dashboard/fairness", device: "mobile", ago: "14s ago" },
  { action: "Opened report preview", page: "/dashboard/reports", device: "desktop", ago: "31s ago" },
  { action: "Hovered SHAP chart tooltip", page: "/dashboard/explainability", device: "tablet", ago: "48s ago" },
  { action: "Downloaded PDF export", page: "/dashboard/reports", device: "desktop", ago: "1m ago" },
];

// 7 days × 6 time-slots — intensity 0–4
const engagementGrid: number[][] = [
  [1, 2, 3, 4, 3, 2],
  [0, 1, 2, 3, 4, 3],
  [1, 3, 4, 4, 3, 1],
  [2, 3, 4, 4, 4, 2],
  [1, 2, 3, 4, 3, 2],
  [0, 1, 1, 2, 2, 1],
  [0, 0, 1, 1, 1, 0],
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"];

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function heatColor(v: number) {
  const map = [
    "bg-[#f3f7fc]",
    "bg-[#dbe8ff]",
    "bg-[#93b4fd]",
    "bg-[#4f83fb]",
    "bg-[#1463ff]",
  ];
  return map[v] ?? map[0];
}

function intensityLabel(v: number) {
  return ["None", "Low", "Medium", "High", "Peak"][v] ?? "None";
}

// ─── Component ───────────────────────────────────────────────────────────────

type DeviceFilter = "all" | "desktop" | "mobile" | "tablet";

export default function HeatmapTracker() {
  const [device, setDevice] = useState<DeviceFilter>("all");

  const filtered =
    device === "all"
      ? recentInteractions
      : recentInteractions.filter((i) => i.device === device);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#101828]">
            Behavior heatmap
          </h2>
          <p className="mt-1 text-sm text-[#667085]">
            Click density and engagement patterns across the platform
          </p>
        </div>

        {/* Device filter */}
        <div className="flex items-center gap-1 rounded-2xl border border-[#d9e2ec] bg-white p-1">
          {(["all", "desktop", "mobile", "tablet"] as DeviceFilter[]).map(
            (d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition",
                  device === d
                    ? "bg-[#1463ff] text-white shadow-sm"
                    : "text-[#667085] hover:text-[#101828]"
                )}
              >
                {d}
              </button>
            )
          )}
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,1fr)]">
        {/* Click density by section */}
        <Card className="rounded-[1.9rem] border-[#d9e2ec] bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          <CardHeader className="p-6 pb-2">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-[#f59e0b]" />
              <CardTitle className="text-xl text-[#101828]">
                Click density by section
              </CardTitle>
            </div>
            <CardDescription>
              Relative interaction volume per UI region — last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-4">
            {pageSections.map((sec, i) => (
              <div key={sec.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-[#344054]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#f3f7fc] text-[10px] font-semibold text-[#667085]">
                      {i + 1}
                    </span>
                    {sec.label}
                  </span>
                  <span className="text-xs font-medium text-[#101828]">
                    {sec.clicks.toLocaleString()} clicks
                  </span>
                </div>
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#f3f7fc]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${sec.pct}%`,
                      background:
                        sec.pct > 70
                          ? "#1463ff"
                          : sec.pct > 40
                            ? "#4f83fb"
                            : "#93b4fd",
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent interactions */}
        <Card className="rounded-[1.9rem] border-[#d9e2ec] bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          <CardHeader className="p-6 pb-2">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#1463ff]" />
              <CardTitle className="text-xl text-[#101828]">
                Live interactions
              </CardTitle>
            </div>
            <CardDescription>Real-time user behavior stream</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-6 pt-4">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#667085]">
                No interactions for this device filter.
              </p>
            ) : (
              filtered.map((item, i) => {
                const Icon = deviceIcons[item.device as keyof typeof deviceIcons];
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-[1.25rem] border border-[#d9e2ec] bg-[#f3f7fc] p-3.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Icon size={14} className="text-[#1463ff]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#101828]">
                        {item.action}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#667085]">
                        {item.page}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-[#667085]">
                      {item.ago}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </section>

      {/* Day × hour engagement grid */}
      <Card className="rounded-[1.9rem] border-[#d9e2ec] bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-xl text-[#101828]">
            Engagement heatmap
          </CardTitle>
          <CardDescription>
            Session intensity by day and time-of-day
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          {/* Time slot headers */}
          <div className="mb-2 grid grid-cols-[48px_repeat(6,1fr)] gap-1.5">
            <div />
            {slots.map((s) => (
              <div
                key={s}
                className="text-center text-[10px] font-medium text-[#667085]"
              >
                {s}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="space-y-1.5">
            {engagementGrid.map((row, di) => (
              <div
                key={days[di]}
                className="grid grid-cols-[48px_repeat(6,1fr)] gap-1.5"
              >
                <div className="flex items-center text-xs font-medium text-[#667085]">
                  {days[di]}
                </div>
                {row.map((val, si) => (
                  <div
                    key={si}
                    title={`${days[di]} ${slots[si]}: ${intensityLabel(val)}`}
                    className={cn(
                      "h-8 rounded-xl transition-transform hover:scale-110",
                      heatColor(val)
                    )}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-5 flex items-center gap-2">
            <span className="text-xs text-[#667085]">Less</span>
            {[0, 1, 2, 3, 4].map((v) => (
              <div
                key={v}
                className={cn("h-3.5 w-3.5 rounded-md", heatColor(v))}
              />
            ))}
            <span className="text-xs text-[#667085]">More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
