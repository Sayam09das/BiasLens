"use client";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { FairnessRisk, ReportStatus, ReportType } from "./ReportCard";

type FilterValue<T extends string> = "All" | T;

export type ReportFiltersState = {
  query: string;
  status: FilterValue<ReportStatus>;
  fairnessRisk: FilterValue<FairnessRisk>;
  reportType: FilterValue<ReportType>;
};

type ReportFiltersProps = {
  value: ReportFiltersState;
  resultCount: number;
  onChange: (next: ReportFiltersState) => void;
  onReset: () => void;
};

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (next: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-white px-4 py-3 text-sm text-[#0D0C22] outline-none focus:border-[#2563EB]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ReportFilters({
  value,
  resultCount,
  onChange,
  onReset,
}: ReportFiltersProps) {
  return (
    <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/88 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.04)]">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,0.6fr))_auto]">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">
            Search
          </span>
          <div className="flex items-center gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3">
            <Search size={18} className="text-[#6E6D7A]" />
            <input
              value={value.query}
              onChange={(event) =>
                onChange({
                  ...value,
                  query: event.target.value,
                })
              }
              placeholder="Search by candidate, role, or report ID"
              className="w-full bg-transparent text-sm text-[#0D0C22] outline-none placeholder:text-[#8A8994]"
            />
          </div>
        </label>

        <SelectField
          label="Status"
          value={value.status}
          options={["All", "Ready", "Processing", "Failed"]}
          onChange={(next) => onChange({ ...value, status: next as ReportFiltersState["status"] })}
        />

        <SelectField
          label="Fairness"
          value={value.fairnessRisk}
          options={["All", "Low", "Medium", "High"]}
          onChange={(next) =>
            onChange({ ...value, fairnessRisk: next as ReportFiltersState["fairnessRisk"] })
          }
        />

        <SelectField
          label="Type"
          value={value.reportType}
          options={["All", "Resume Audit", "Fairness", "Explainability"]}
          onChange={(next) =>
            onChange({ ...value, reportType: next as ReportFiltersState["reportType"] })
          }
        />

        <div className="flex flex-col justify-end gap-3">
          <Button variant="outline" className="rounded-[1.25rem]" onClick={onReset}>
            <RotateCcw size={16} />
            <span className="ml-2">Reset</span>
          </Button>
        </div>
      </div>

      <p className="mt-4 text-sm text-[#6E6D7A]">
        Showing {resultCount} report{resultCount === 1 ? "" : "s"} with the current filters.
      </p>
    </Card>
  );
}
