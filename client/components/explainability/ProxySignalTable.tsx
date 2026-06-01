"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Info,
  Search,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

type ProxyRiskLevel = "Low" | "Medium" | "High";

type ProxyStatus = "Review" | "Action Needed" | "Monitor";

type ProxySignal = {
  id: string;
  signal: string;
  category: string;
  risk: ProxyRiskLevel;
  reason: string;
  recommendation: string;
  status: ProxyStatus;
};

type ProxySignalTableProps = {
  signals?: ProxySignal[] | null;
  className?: string;
};

const BRAND = {
  primary: "#2563EB",
  secondaryBackground: "#F6F8FB",
  mutedText: "#6E6D7A",
  border: "#E7E7E9",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

function riskTone(risk: ProxyRiskLevel): { bg: string; bd: string; fg: string; icon: React.ReactNode } {
  if (risk === "Low") {
    return {
      bg: "rgba(34,197,94,0.10)",
      bd: "rgba(34,197,94,0.25)",
      fg: BRAND.success,
      icon: <CheckCircle2 size={14} aria-hidden="true" />,
    };
  }
  if (risk === "Medium") {
    return {
      bg: "rgba(245,158,11,0.10)",
      bd: "rgba(245,158,11,0.25)",
      fg: BRAND.warning,
      icon: <Info size={14} aria-hidden="true" />,
    };
  }
  return {
    bg: "rgba(239,68,68,0.10)",
    bd: "rgba(239,68,68,0.25)",
    fg: BRAND.danger,
    icon: <AlertCircle size={14} aria-hidden="true" />,
  };
}

function statusTone(status: ProxyStatus): { bg: string; bd: string; fg: string } {
  if (status === "Monitor") {
    return { bg: "rgba(37,99,235,0.08)", bd: "rgba(37,99,235,0.20)", fg: BRAND.primary };
  }
  if (status === "Review") {
    return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.25)", fg: BRAND.warning };
  }
  return { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.25)", fg: BRAND.danger };
}

function RiskBadge({ risk }: { risk: ProxyRiskLevel }) {
  const t = riskTone(risk);
  return (
    <span
      className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-semibold"
      style={{ background: t.bg, borderColor: t.bd, color: t.fg }}
      aria-label={`Risk level ${risk}`}
    >
      <span className="mr-2" aria-hidden="true">{t.icon}</span>
      {risk}
    </span>
  );
}

function StatusBadge({ status }: { status: ProxyStatus }) {
  const s = statusTone(status);
  return (
    <span
      className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-semibold"
      style={{ background: s.bg, borderColor: s.bd, color: s.fg }}
      aria-label={`Status ${status}`}
    >
      {status}
    </span>
  );
}

function MobileRow({ row }: { row: ProxySignal }) {
  return (
    <div
      className="space-y-3 rounded-[1.75rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4"
      role="article"
      aria-label={`Proxy signal ${row.signal}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0D0C22]">{row.signal}</p>
          <p className="mt-1 text-sm font-semibold text-[#6E6D7A]">{row.category}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <RiskBadge risk={row.risk} />
          <StatusBadge status={row.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <FieldKV label="Detection reason" value={row.reason} />
        <FieldKV label="Recommendation" value={row.recommendation} />
      </div>
    </div>
  );
}

function FieldKV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">{value}</p>
    </div>
  );
}

export default function ProxySignalTable({ signals, className }: ProxySignalTableProps) {
  const fallback: ProxySignal[] = React.useMemo(
    () => [
      {
        id: "college-tier",
        signal: "College Tier",
        category: "Education",
        risk: "Medium",
        reason: "May correlate with socioeconomic background and indirect access to opportunities.",
        recommendation: "Normalize education weight and focus on demonstrated skills.",
        status: "Review",
      },
      {
        id: "location",
        signal: "Location",
        category: "Geography",
        risk: "High",
        reason: "May influence scoring through regional hiring bias or uneven access to networks.",
        recommendation: "Remove location weighting unless role-relevant.",
        status: "Action Needed",
      },
      {
        id: "career-gap",
        signal: "Career Gap",
        category: "Employment History",
        risk: "Medium",
        reason: "May unfairly penalize caregiving, health-related gaps, or non-linear careers.",
        recommendation: "Evaluate context and avoid automatic penalty.",
        status: "Review",
      },
      {
        id: "name-pattern",
        signal: "Name Pattern",
        category: "Identity Proxy",
        risk: "High",
        reason: "Could act as a demographic proxy when correlated with protected attributes.",
        recommendation: "Mask identity signals during scoring.",
        status: "Action Needed",
      },
      {
        id: "keyword-density",
        signal: "Keyword Density",
        category: "Resume Style",
        risk: "Low",
        reason: "May favor ATS-optimized resumes over equally qualified candidates.",
        recommendation: "Balance keyword scoring with experience evidence.",
        status: "Monitor",
      },
    ],
    [],
  );

  const base = React.useMemo(() => {
    const arr = signals ?? fallback;
    if (!Array.isArray(arr) || !arr.length) return fallback;
    return arr;
  }, [signals, fallback]);

  const [query, setQuery] = React.useState("");
  const [riskFilter, setRiskFilter] = React.useState<"All" | ProxyRiskLevel>("All");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return base.filter((r) => {
      const matchesRisk = riskFilter === "All" ? true : r.risk === riskFilter;
      const matchesQuery = !q
        ? true
        : [r.signal, r.category, r.reason, r.recommendation, r.status, r.risk]
            .join(" ")
            .toLowerCase()
            .includes(q);
      return matchesRisk && matchesQuery;
    });
  }, [base, query, riskFilter]);

  const riskCounts = React.useMemo(() => {
    const counts: Record<"Low" | "Medium" | "High", number> = { Low: 0, Medium: 0, High: 0 };
    for (const r of base) counts[r.risk] += 1;
    return counts;
  }, [base]);

  return (
    <div className={className}>
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Proxy signal detection</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">Possible bias proxies</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
              Review potential proxy signals that could influence resume screening fairness. Use filters to focus on higher-risk items.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm font-semibold text-[#6E6D7A]">
              <ShieldCheck size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
              {base.length} signals
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-7">
            <label className="sr-only" htmlFor="proxySearch">Search proxy signals</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6D7A]" aria-hidden="true" />
              <input
                id="proxySearch"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search signal, category, reason, or recommendation"
                className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-10 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                aria-label="Search proxy signals"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-2 py-1 text-xs font-semibold text-[#6E6D7A] hover:bg-[#F6F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          <div className="md:col-span-5">
            <label className="sr-only" htmlFor="proxyRiskFilter">Filter by risk level</label>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm font-semibold text-[#6E6D7A]">
                <Filter size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
                Risk
              </span>
              <select
                id="proxyRiskFilter"
                value={riskFilter}
                onChange={(e) => {
                  const value = e.target.value;
                  setRiskFilter(
                    value === "Low" || value === "Medium" || value === "High"
                      ? value
                      : "All",
                  );
                }}
                className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                aria-label="Filter by risk level"
              >
                <option value="All">All ({base.length})</option>
                <option value="Low">Low ({riskCounts.Low})</option>
                <option value="Medium">Medium ({riskCounts.Medium})</option>
                <option value="High">High ({riskCounts.High})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="mt-6 hidden lg:block">
          <div className="overflow-x-auto rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF]">
            <table className="min-w-full border-collapse" aria-label="Proxy signal detection table">
              <thead>
                <tr className="bg-[#F6F8FB]">
                  {[
                    "Signal",
                    "Category",
                    "Risk Level",
                    "Detection Reason",
                    "Recommendation",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-[#E7E7E9]">
                    <td className="px-4 py-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0D0C22]">{r.signal}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-[#6E6D7A]">{r.category}</p>
                    </td>
                    <td className="px-4 py-4">
                      <RiskBadge risk={r.risk} />
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm leading-6 text-[#6E6D7A]">{r.reason}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm leading-6 text-[#6E6D7A]">{r.recommendation}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#6E6D7A]">
                      No proxy signals match your filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile stacked cards */}
        <div className="mt-6 lg:hidden space-y-3">
          <AnimatePresence>
            {filtered.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <MobileRow row={r} />
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 ? (
            <div className="rounded-[1.75rem] border border-[#E7E7E9] bg-[#FFFFFF] p-6 text-center text-sm text-[#6E6D7A]">
              No proxy signals match your filters.
            </div>
          ) : null}
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]" aria-hidden="true">
              <ShieldX size={18} className="text-[#2563EB]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">Mitigation guidance</p>
              <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">
                Treat high-risk proxies as review priorities. Validate whether each signal is job-relevant, then reduce reliance or normalize it across groups.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
