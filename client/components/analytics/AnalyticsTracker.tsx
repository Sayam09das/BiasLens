"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MousePointerClick,
  Eye,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const activityData = [
  { time: "00:00", events: 42 },
  { time: "03:00", events: 18 },
  { time: "06:00", events: 27 },
  { time: "09:00", events: 91 },
  { time: "12:00", events: 138 },
  { time: "15:00", events: 174 },
  { time: "18:00", events: 112 },
  { time: "21:00", events: 63 },
  { time: "Now", events: 88 },
];

const stats = [
  {
    label: "Total events",
    value: "14,832",
    delta: "+8.2%",
    up: true,
    icon: MousePointerClick,
    tone: "text-[#1463ff]",
    bg: "bg-[#dbe8ff]",
  },
  {
    label: "Unique sessions",
    value: "3,241",
    delta: "+5.1%",
    up: true,
    icon: Users,
    tone: "text-[#22c55e]",
    bg: "bg-[#dcfce7]",
  },
  {
    label: "Page views",
    value: "28,490",
    delta: "+11.7%",
    up: true,
    icon: Eye,
    tone: "text-[#f59e0b]",
    bg: "bg-[#fef3c7]",
  },
  {
    label: "Conversion rate",
    value: "4.38%",
    delta: "-0.6%",
    up: false,
    icon: TrendingUp,
    tone: "text-[#ef4444]",
    bg: "bg-[#fee2e2]",
  },
] as const;

const topEvents = [
  { name: "audit.started", count: 2841, share: 19 },
  { name: "report.viewed", count: 2103, share: 14 },
  { name: "resume.uploaded", count: 1874, share: 13 },
  { name: "fairness.alert.opened", count: 1422, share: 10 },
  { name: "explainability.viewed", count: 1198, share: 8 },
  { name: "export.report.clicked", count: 987, share: 7 },
];

export default function AnalyticsTracker() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="rounded-[1.75rem] border-[#d9e2ec] bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.06)]"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-[#667085]">{s.label}</p>
                  <p className="mt-2.5 text-[1.75rem] font-semibold tracking-[-0.04em] text-[#101828]">
                    {s.value}
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
                      s.up ? "text-[#22c55e]" : "text-[#ef4444]"
                    }`}
                  >
                    {s.up ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}
                    {s.delta} vs last week
                  </span>
                </div>
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${s.bg}`}
                >
                  <s.icon className={s.tone} size={19} />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Chart + top events */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        {/* Activity chart */}
        <Card className="min-w-0 rounded-[1.9rem] border-[#d9e2ec] bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl text-[#101828]">
              Event activity
            </CardTitle>
            <CardDescription>
              Tracked interactions across the platform — last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="min-w-0 p-6 pt-4">
            <ResponsiveContainer width="100%" height={220} minWidth={0} minHeight={1}>
              <AreaChart
                data={activityData}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="eventGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1463ff" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#1463ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "1px solid #d9e2ec",
                    fontSize: 12,
                    color: "#101828",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                  }}
                  itemStyle={{ color: "#1463ff" }}
                  cursor={{ stroke: "#d9e2ec", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#1463ff"
                  strokeWidth={2}
                  fill="url(#eventGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#1463ff", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top events */}
        <Card className="rounded-[1.9rem] border-[#d9e2ec] bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl text-[#101828]">Top events</CardTitle>
            <CardDescription>Most fired events today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-6 pt-4">
            {topEvents.map((ev) => (
              <div key={ev.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs text-[#344054]">
                    {ev.name}
                  </span>
                  <span className="text-xs text-[#667085]">
                    {ev.count.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f3f7fc]">
                  <div
                    className="h-full rounded-full bg-[#1463ff] transition-all duration-500"
                    style={{ width: `${ev.share}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
