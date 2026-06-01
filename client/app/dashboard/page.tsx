import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    label: "Active audits",
    value: "128",
    detail: "+12.4% vs last week",
    icon: Activity,
    tone: "text-[#2563EB]",
  },
  {
    label: "Avg. resume score",
    value: "91.8%",
    detail: "Across 18 open roles",
    icon: TrendingUp,
    tone: "text-[#22C55E]",
  },
  {
    label: "Fairness risk alerts",
    value: "03",
    detail: "2 require review today",
    icon: ShieldCheck,
    tone: "text-[#F59E0B]",
  },
  {
    label: "Reports generated",
    value: "246",
    detail: "Audit-ready exports",
    icon: BadgeCheck,
    tone: "text-[#0D0C22]",
  },
] as const;

const recentAudits = [
  {
    role: "Senior Frontend Engineer",
    score: "94%",
    risk: "Low",
    status: "Report ready",
  },
  {
    role: "ML Platform Analyst",
    score: "89%",
    risk: "Moderate",
    status: "Pending reviewer",
  },
  {
    role: "Operations Manager",
    score: "92%",
    risk: "Low",
    status: "Explainability synced",
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-[1.75rem] border-[#E7E7E9] bg-white/90 shadow-[0_20px_50px_rgba(13,12,34,0.06)]"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#6E6D7A]">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-[#6E6D7A]">{stat.detail}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6F8FB]">
                  <stat.icon className={stat.tone} size={20} />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <Card className="rounded-[1.9rem] border-[#E7E7E9] bg-white/92 shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
          <CardHeader className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl text-[#0D0C22]">
                Audit pipeline overview
              </CardTitle>
              <CardDescription className="text-[#6E6D7A]">
                Live hiring intelligence across resume scoring, fairness monitoring, and reporting.
              </CardDescription>
            </div>
            <Button className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8]">
              New audit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            {recentAudits.map((audit) => (
              <div
                key={audit.role}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">{audit.role}</p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">{audit.status}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-white px-3 py-1.5 font-medium text-[#0D0C22]">
                    Score {audit.score}
                  </span>
                  <span className="rounded-full bg-[#EFF6FF] px-3 py-1.5 font-medium text-[#2563EB]">
                    Risk {audit.risk}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-[#2563EB]"
                  >
                    Open
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[1.9rem] border-[#DBEAFE] bg-[linear-gradient(180deg,#EFF6FF_0%,#FFFFFF_100%)] shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
                <Sparkles size={16} />
                BiasLens recommendations
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                Review 2 fairness alerts before publishing today&apos;s reports
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#45628F]">
                The platform detected moderate drift in screening outcomes for one high-volume role.
              </p>
              <Button
                variant="outline"
                className="mt-5 rounded-full border-[#BFDBFE] bg-white text-[#2563EB] hover:bg-[#EFF6FF]"
              >
                Open trust center
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[1.9rem] border-[#E7E7E9] bg-white/92 shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
            <CardHeader className="p-6">
              <CardTitle className="text-xl text-[#0D0C22]">Today&apos;s queue</CardTitle>
              <CardDescription className="text-[#6E6D7A]">
                Priority work for your team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="flex items-start gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <Clock3 className="mt-0.5 text-[#2563EB]" size={18} />
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">9 resumes awaiting explainability review</p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">Estimated completion time: 18 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <ShieldCheck className="mt-0.5 text-[#22C55E]" size={18} />
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">Compliance log synced</p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">Audit evidence exported for 4 published roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
