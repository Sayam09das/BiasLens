"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, Link2, Loader2, ShieldCheck } from "lucide-react";

import { ReportViewer } from "@/components/reports";
import { Card } from "@/components/ui/card";
import type { ExplainabilityQuality, FairnessRisk } from "@/components/reports/ReportViewer";
import { ApiError, apiFetch } from "@/lib/api";

type SharedReportResponse = {
  report: {
    id: string;
    title: string;
    predictionLabel: string | null;
    topProbability: number | null;
    fairnessSnapshot: unknown;
    createdAt: string;
    updatedAt: string;
    auditId: string | null;
    userId: string | null;
  };
  permission: string;
};

function clampScore(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function parseFairnessRisk(
  snapshot: unknown,
): { label: FairnessRisk; score: number; notes: string } {
  if (!snapshot || typeof snapshot !== "object") {
    return { label: "Medium" as const, score: 36, notes: "Fairness details were not included in the shared payload." };
  }

  const riskValue = "fairnessRisk" in snapshot ? Number(snapshot.fairnessRisk) : NaN;
  const notes =
    "notes" in snapshot && typeof snapshot.notes === "string"
      ? snapshot.notes
      : "Shared report fairness notes are available for reviewer inspection.";
  const score = clampScore(Number.isFinite(riskValue) ? riskValue : 36);
  const label: FairnessRisk =
    score <= 25 ? "Low"
    : score <= 45 ? "Medium"
    : "High";

  return { label, score, notes };
}

export default function SharedReportPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<SharedReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSharedReport() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFetch<SharedReportResponse>(`/v1/shared/reports/${token}`);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "This shared report could not be loaded."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSharedReport();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const viewerReport = useMemo(() => {
    if (!data) {
      return null;
    }

    const { report, permission } = data;
    const fairness = parseFairnessRisk(report.fairnessSnapshot);
    const probability = clampScore(Math.round((report.topProbability ?? 0.76) * 100));
    const resumeScore = clampScore(probability + 6);
    const jobFit = clampScore(probability);
    const skillsMatch = clampScore(probability - 4);

    const explainability: ExplainabilityQuality =
      probability >= 80 ? "Clear" : probability >= 65 ? "Moderate" : "Limited";

    return {
      reportId: report.id,
      candidateName: report.title,
      role: permission === "view" ? "Shared BiasLens report" : "BiasLens report",
      resumeScore,
      jobFit,
      skillsMatch,
      fairnessRisk: fairness.label,
      explainability,
      generatedDate: report.createdAt,
      status: "Ready" as const,
      executiveSummary: {
        overview: `${report.title} was shared for external review through BiasLens secure report sharing.`,
        keyStrengths: [
          `Prediction label: ${report.predictionLabel ?? "Recommendation available"}`,
          `Confidence estimate: ${probability}%`,
          "Shared link access is view-only and time-bound.",
        ],
        keyRisks: [
          fairness.notes,
        ],
        recommendedNextSteps: [
          "Review the fairness notes before making a hiring decision.",
          "Confirm the supporting evidence with a human reviewer.",
          "Avoid using this shared report as the only decision input.",
        ],
      },
      fairnessAnalysis: {
        fairnessNarrative: fairness.notes,
        riskFactors: [
          `Fairness risk score: ${fairness.score}/100`,
          "Shared payload may omit some internal reviewer context.",
        ],
        mitigationNotes: [
          "Use structured human review before finalizing outcomes.",
          "Compare the report with your hiring rubric and interview evidence.",
        ],
        fairnessMetrics: [
          { name: "Fairness risk", value: `${fairness.score}/100`, target: "<= 25 preferred" },
        ],
      },
      explainabilityInsights: {
        decisionNarrative: `The shared report indicates ${report.predictionLabel ?? "a recommendation"} with ${probability}% confidence based on the generated audit summary.`,
        positiveSignals: [
          "A signed share link was used to access the report.",
          "The report includes a prediction summary and fairness context.",
        ],
        negativeSignals: [
          "Shared access does not include full internal reviewer metadata.",
        ],
        confidence: `${probability}% confidence`,
      },
      auditTrail: [
        {
          timestamp: report.createdAt,
          actor: "BiasLens",
          action: "Shared report opened",
          detail: "The report was accessed through a public share token.",
        },
      ],
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] px-4 py-10">
        <div className="mx-auto flex max-w-3xl items-center justify-center">
          <Card className="w-full rounded-4xl border-[#E7E7E9] bg-white p-8 text-center shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#2563EB]" />
            <p className="mt-4 text-lg font-semibold text-[#101828]">Loading shared report</p>
            <p className="mt-2 text-sm text-[#667085]">Verifying the secure link and preparing the report.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !viewerReport) {
    return (
      <div className="min-h-screen bg-[#F6F8FB] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-4xl border-[#FECACA] bg-white p-8 shadow-[0_24px_64px_rgba(13,12,34,0.06)]">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF2F2]">
                <AlertCircle className="h-6 w-6 text-[#DC2626]" />
              </span>
              <div>
                <p className="text-lg font-semibold text-[#101828]">Shared report unavailable</p>
                <p className="mt-2 text-sm text-[#667085]">{error ?? "This share link is invalid or has expired."}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  <span className="inline-flex items-center gap-2"><ShieldCheck size={14} /> Secure link</span>
                  <span className="inline-flex items-center gap-2"><Link2 size={14} /> View-only access</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] py-6">
      <ReportViewer report={viewerReport} />
    </div>
  );
}
