export type AuditStatus = "completed" | "running" | "failed" | "queued";

export type RiskLevel = "low" | "moderate" | "high";

export type AuditRecord = {
  id: string;
  candidateName: string;
  role: string;
  department: string;
  createdAt: string;
  status: AuditStatus;
  score: number;
  fairnessRisk: number;
  riskLevel: RiskLevel;
  summary: string;
};

export type AuditTimelineEvent = {
  label: string;
  detail: string;
  at?: string;
};

export type AuditInsight = {
  title: string;
  body: string;
};

export type AuditDetailData = {
  auditId: string;
  candidateName: string;
  role: string;
  status: AuditStatus;
  createdAt: string;
  owner: string;
  scores: {
    resumeScore: number;
    jobFit: number;
    skillsMatch: number;
    fairnessRisk: number;
  };
  overview: string[];
  metadata: { label: string; value: string }[];
  explainabilityInsights: AuditInsight[];
  fairnessAnalysis: AuditInsight[];
  improvementSuggestions: string[];
  timeline: AuditTimelineEvent[];
};
