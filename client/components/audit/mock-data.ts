import { AuditDetailData, AuditRecord, AuditStatus, RiskLevel } from "./types";

const now = new Date("2026-06-01T09:30:00.000Z").getTime();

function daysAgo(days: number) {
  return new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
}

function toRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

export const auditHistoryRecords: AuditRecord[] = [
  {
    id: "AUD-2841",
    candidateName: "Alex Morgan",
    role: "Senior Frontend Engineer",
    department: "Product Engineering",
    createdAt: daysAgo(1),
    status: "completed",
    score: 92,
    fairnessRisk: 24,
    riskLevel: "low",
    summary: "Strong rubric alignment with low formatting-related bias exposure.",
  },
  {
    id: "AUD-2837",
    candidateName: "Priya Kapoor",
    role: "ML Platform Analyst",
    department: "AI Operations",
    createdAt: daysAgo(2),
    status: "running",
    score: 78,
    fairnessRisk: 41,
    riskLevel: "moderate",
    summary: "Counterfactual checks still in progress for borderline competency signals.",
  },
  {
    id: "AUD-2829",
    candidateName: "Jordan Lee",
    role: "People Analytics Manager",
    department: "People Systems",
    createdAt: daysAgo(4),
    status: "queued",
    score: 0,
    fairnessRisk: 0,
    riskLevel: "low",
    summary: "Queued behind high-priority batch audits for this week’s hiring cycle.",
  },
  {
    id: "AUD-2816",
    candidateName: "Taylor Brooks",
    role: "Operations Manager",
    department: "Business Operations",
    createdAt: daysAgo(6),
    status: "completed",
    score: 88,
    fairnessRisk: 33,
    riskLevel: "low",
    summary: "Clear evidence chain with minor wording sensitivity in skills extraction.",
  },
  {
    id: "AUD-2804",
    candidateName: "Samira Chen",
    role: "Compliance Program Lead",
    department: "Risk & Governance",
    createdAt: daysAgo(7),
    status: "failed",
    score: 0,
    fairnessRisk: 82,
    riskLevel: "high",
    summary: "Document parser failed after encountering a protected resume export.",
  },
];

export const auditSummaryMetrics = [
  {
    label: "Total audits",
    value: `${auditHistoryRecords.length}`,
    detail: "Across active and archived reviews",
  },
  {
    label: "Completed today",
    value: "12",
    detail: "7 published to reporting",
  },
  {
    label: "Elevated fairness risk",
    value: "03",
    detail: "Needs reviewer sign-off",
  },
] as const;

function scoreForStatus(status: AuditStatus, fallback: number) {
  return status === "queued" || status === "failed" ? 0 : fallback;
}

export function getAuditDetails(auditId: string): AuditDetailData {
  const base =
    auditHistoryRecords.find((record) => record.id === auditId) ??
    auditHistoryRecords[0];

  return {
    auditId: base.id,
    candidateName: base.candidateName,
    role: base.role,
    status: base.status,
    createdAt: base.createdAt,
    owner: "Sayam Das",
    scores: {
      resumeScore: scoreForStatus(base.status, base.score),
      jobFit: scoreForStatus(base.status, Math.max(base.score - 7, 0)),
      skillsMatch: scoreForStatus(base.status, Math.max(base.score - 11, 0)),
      fairnessRisk:
        base.status === "queued" ? 0 : base.fairnessRisk,
    },
    overview: [
      "BiasLens found clear evidence of impact, collaboration, and role-relevant experience.",
      "The strongest signals came from quantified outcomes and consistent terminology across experience sections.",
      "Residual risk is concentrated around wording sensitivity and missing context for a few claims.",
    ],
    metadata: [
      { label: "Department", value: base.department },
      { label: "Hiring role", value: base.role },
      { label: "Reviewer", value: "Hiring Intelligence Team" },
      { label: "Bias monitor", value: toRiskLevel(base.fairnessRisk) },
    ],
    explainabilityInsights: [
      {
        title: "Why this score is competitive",
        body: "The resume maps cleanly to rubric criteria, especially measurable outcomes, domain vocabulary, and scope of ownership.",
      },
      {
        title: "What reduced confidence",
        body: "A few competencies were implied rather than directly evidenced, so the model discounted them during scoring.",
      },
    ],
    fairnessAnalysis: [
      {
        title: "Primary fairness signal",
        body: "Most risk comes from phrasing and formatting sensitivity rather than protected-attribute proxies.",
      },
      {
        title: "Recommended mitigation",
        body: "Use structured reviewer calibration and counterfactual spot checks before final decisioning on borderline candidates.",
      },
    ],
    improvementSuggestions: [
      "Add one quantified outcome for each major responsibility to increase evidence strength.",
      "Standardize section labels and date formatting for more stable ATS extraction.",
      "Mirror rubric language only where the resume can support it with direct evidence.",
      "Attach role-specific reviewer notes for any manual overrides or escalations.",
    ],
    timeline: [
      {
        label: "Resume received",
        detail: "File uploaded and basic validation completed.",
        at: "09:10",
      },
      {
        label: "Signals extracted",
        detail: "Experience, skills, and evidence anchors were parsed for scoring.",
        at: "09:12",
      },
      {
        label: "Fairness checked",
        detail: "Counterfactual and wording sensitivity analysis completed.",
        at: "09:15",
      },
      {
        label: "Report finalized",
        detail: "Summary, recommendations, and export payload generated.",
        at: "09:18",
      },
    ],
  };
}
