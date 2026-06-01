"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, RefreshCcw, Share2 } from "lucide-react";

import {
  AuditDetails,
  AuditSummary,
  AuditTimeline,
  AuditStatus,
  getAuditDetails,
} from "@/components/audit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function ScoreCard({
  title,
  value,
  hint,
  risk = false,
}: {
  title: string;
  value: number;
  hint: string;
  risk?: boolean;
}) {
  const tone =
    risk && value >= 70
      ? "text-[#B91C1C]"
      : risk && value >= 40
        ? "text-[#B45309]"
        : !risk && value >= 80
          ? "text-[#15803D]"
          : "text-[#2563EB]";

  return (
    <Card className="rounded-4xl border-[#E7E7E9] bg-white/78 p-5 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
        {title}
      </p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className={`text-4xl font-semibold tracking-[-0.05em] ${tone}`}>
          {value}
        </p>
        <p className="text-xs text-[#6E6D7A]">{hint}</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
        <div
          className="h-full rounded-full bg-[#2563EB]"
          style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        />
      </div>
    </Card>
  );
}

export default function AuditDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isSharing, setIsSharing] = useState(false);
  const [isRerunning, setIsRerunning] = useState(false);

  const audit = getAuditDetails((params?.id ?? "").toString());

  const share = async () => {
    try {
      setIsSharing(true);
      await navigator.clipboard.writeText(window.location.href);
    } finally {
      setIsSharing(false);
    }
  };

  const rerun = async () => {
    try {
      setIsRerunning(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.refresh();
    } finally {
      setIsRerunning(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-0">
      <div className="flex flex-col gap-4 pb-6 pt-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
            Audit Report
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
            {audit.role}
          </h1>
          <p className="mt-2 text-sm text-[#6E6D7A]">
            Detailed AI hiring review with score explanation and fairness context.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AuditStatus status={audit.status} />
          <Button variant="outline" className="rounded-[1.25rem]">
            <Download size={18} />
            <span className="ml-2">Export PDF</span>
          </Button>
          <Button
            variant="ghost"
            className="rounded-[1.25rem] text-[#2563EB]"
            onClick={rerun}
            disabled={isRerunning}
          >
            <RefreshCcw size={18} />
            <span className="ml-2">
              {isRerunning ? "Re-running..." : "Re-run Audit"}
            </span>
          </Button>
          <Button
            variant="ghost"
            className="rounded-[1.25rem] text-[#2563EB]"
            onClick={share}
            disabled={isSharing}
          >
            <Share2 size={18} />
            <span className="ml-2">{isSharing ? "Sharing..." : "Share"}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <AuditSummary audit={audit} />

        <div className="space-y-5">
          <ScoreCard
            title="Resume Score"
            value={audit.scores.resumeScore}
            hint="Evidence strength"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <ScoreCard
              title="Job Fit"
              value={audit.scores.jobFit}
              hint="Role alignment"
            />
            <ScoreCard
              title="Skills Match"
              value={audit.scores.skillsMatch}
              hint="Competency fit"
            />
          </div>
          <ScoreCard
            title="Fairness Risk"
            value={audit.scores.fairnessRisk}
            hint="Lower is better"
            risk
          />
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <AuditDetails audit={audit} />
        <AuditTimeline events={audit.timeline} />
      </div>
    </div>
  );
}
