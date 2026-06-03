import type { ExplainabilityQuality, FairnessRisk, ReportStatus, ReportType } from "@/components/reports/ReportCard";
import type { BackendReport } from "@/hooks/useReports";

export type ReportListItem = {
  reportId: string;
  auditId: string;
  candidateName: string;
  role: string;
  resumeScore: number;
  jobFit: number;
  fairnessRisk: FairnessRisk;
  explainability: ExplainabilityQuality;
  status: ReportStatus;
  createdAt: string;
  reportType: ReportType;
};

function clampScore(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function mapFairnessRisk(score: number): FairnessRisk {
  if (score <= 25) return "Low";
  if (score <= 45) return "Medium";
  return "High";
}

function mapExplainability(probability: number): ExplainabilityQuality {
  if (probability >= 82) return "Clear";
  if (probability >= 65) return "Moderate";
  return "Limited";
}

function mapReportType(label: string | null): ReportType {
  const text = (label ?? "").toLowerCase();
  if (text.includes("fair")) return "Fairness";
  if (text.includes("explain")) return "Explainability";
  return "Resume Audit";
}

function parseFairnessScore(snapshot: unknown) {
  if (!snapshot || typeof snapshot !== "object") {
    return 36;
  }

  const risk = "fairnessRisk" in snapshot ? Number(snapshot.fairnessRisk) : NaN;
  return clampScore(Number.isFinite(risk) ? risk : 36);
}

function mapStatus(report: BackendReport): ReportStatus {
  const auditStatus = report.audit?.status;

  if (auditStatus === "FAILED") return "Failed";
  if (auditStatus === "COMPLETED" || !auditStatus) return "Ready";
  return "Processing";
}

function getRole(report: BackendReport) {
  return report.audit?.jobRole?.trim() || report.predictionLabel?.trim() || "BiasLens report";
}

function getConfidenceScore(report: BackendReport) {
  return clampScore(Math.round((report.topProbability ?? 0.72) * 100));
}

function getFairnessScore(report: BackendReport) {
  return parseFairnessScore(report.fairnessSnapshot);
}

function getFairnessNarrative(fairnessScore: number) {
  if (fairnessScore <= 25) {
    return "Fairness screening shows low elevated-risk signals across the generated audit evidence.";
  }

  if (fairnessScore <= 45) {
    return "Fairness review shows moderate sensitivity and should be paired with a recruiter check before decisioning.";
  }

  return "Fairness review surfaced elevated sensitivity signals that should be investigated before using the result downstream.";
}

function getExplainabilityNarrative(explainability: ExplainabilityQuality) {
  if (explainability === "Clear") {
    return "The recommendation is supported by strong evidence density and consistent role-alignment signals.";
  }

  if (explainability === "Moderate") {
    return "The recommendation is usable, but a few important claims still need human verification or stronger evidence.";
  }

  return "The recommendation has limited evidence support and should not be treated as decision-ready without deeper review.";
}

function getTopSignals(report: BackendReport, role: string, confidence: number) {
  const label = report.predictionLabel ?? "Needs review";
  return [
    `Model recommendation: ${label}.`,
    `${confidence}% confidence for the current ${role} evaluation.`,
    "Audit-linked report generated from the completed resume review pipeline.",
  ];
}

export function mapBackendReportToCard(report: BackendReport): ReportListItem {
  const confidence = getConfidenceScore(report);
  const fairnessScore = getFairnessScore(report);

  return {
    reportId: report.id,
    auditId: report.auditId ?? report.audit?.id ?? report.id,
    candidateName: report.title,
    role: getRole(report),
    resumeScore: clampScore(confidence + 4),
    jobFit: confidence,
    fairnessRisk: mapFairnessRisk(fairnessScore),
    explainability: mapExplainability(confidence),
    status: mapStatus(report),
    createdAt: report.createdAt,
    reportType: mapReportType(report.predictionLabel),
  };
}

export function mapBackendReportToPreview(report: BackendReport) {
  const card = mapBackendReportToCard(report);
  const fairnessScore = getFairnessScore(report);

  return {
    ...card,
    generatedDate: report.createdAt,
    executiveSummary: {
      overview: `${card.candidateName} is ready for reviewer inspection with explainability and fairness context attached to this report.`,
      keyStrengths: getTopSignals(report, card.role, card.jobFit),
      keyRisks: [
        getFairnessNarrative(fairnessScore),
        "One or more claims should still be verified against source resume evidence.",
      ],
    },
    improvementSuggestions: {
      resumeEdits: [
        "Add stronger quantified outcomes to the most relevant experience bullets.",
        "Include direct evidence for the most important role-alignment claims.",
      ],
      humanReviewChecklist: [
        "Confirm the strongest skill claims against the uploaded resume.",
        "Check whether any missing evidence changed the recommendation confidence.",
      ],
    },
    auditTrail: [
      {
        timestamp: report.audit?.createdAt ?? report.createdAt,
        actor: "BiasLens",
        action: "Audit received",
      },
      {
        timestamp: report.createdAt,
        actor: "BiasLens",
        action: "Report generated",
      },
    ],
  };
}

export function mapBackendReportToViewer(report: BackendReport) {
  const card = mapBackendReportToCard(report);
  const fairnessScore = getFairnessScore(report);
  const explainabilityNarrative = getExplainabilityNarrative(card.explainability);
  const recommendation = report.predictionLabel ?? "Needs Review";

  return {
    reportId: card.reportId,
    candidateName: card.candidateName,
    role: card.role,
    resumeScore: card.resumeScore,
    jobFit: card.jobFit,
    skillsMatch: clampScore(card.jobFit - 3),
    fairnessRisk: card.fairnessRisk,
    explainability: card.explainability,
    generatedDate: card.createdAt,
    status: card.status,
    executiveSummary: {
      overview: `${card.candidateName} was evaluated for ${card.role}. The current recommendation is ${recommendation.toLowerCase()}, with audit-linked evidence and fairness context available for human review.`,
      keyStrengths: getTopSignals(report, card.role, card.jobFit),
      keyRisks: [
        getFairnessNarrative(fairnessScore),
        "Human validation is still recommended before final candidate decisions.",
      ],
      recommendedNextSteps: [
        "Review the audit-linked evidence before exporting or sharing externally.",
        "Validate missing evidence through recruiter screening or structured interview prompts.",
        "Use the fairness notes to guide any escalation or secondary review.",
      ],
    },
    resumeIntelligence: {
      scoringRationale: `${card.resumeScore}% resume score and ${card.jobFit}% fit were derived from the current report confidence, recommendation label, and fairness snapshot returned by the backend.`,
      extractedEvidence: [
        { label: "Recommendation", value: recommendation },
        { label: "Audit status", value: report.audit?.status ?? "COMPLETED" },
        { label: "Linked audit", value: card.auditId },
        { label: "Generated", value: new Date(card.createdAt).toLocaleString() },
      ],
    },
    jobFitAnalysis: {
      fitNarrative: `${card.candidateName} shows ${card.jobFit >= 80 ? "strong" : card.jobFit >= 65 ? "moderate" : "limited"} alignment for ${card.role} based on the current report confidence.`,
      missingFitSignals: [
        "Quantified results for the most relevant experience sections.",
        "Additional role-specific artifacts or portfolio links.",
        "Human verification of the strongest qualification claims.",
      ],
      relevantSkills: [
        card.role,
        "Resume screening",
        "Explainability review",
        "Fairness-aware decision support",
      ],
    },
    explainabilityInsights: {
      decisionNarrative: explainabilityNarrative,
      positiveSignals: [
        `${card.jobFit}% job fit confidence from the generated report.`,
        "Audit-linked report record is available for export and sharing.",
        `Recommendation label: ${recommendation}.`,
      ],
      negativeSignals: [
        "Detailed ML feature contributions are not stored on this report record yet.",
        "Resume evidence still needs human validation before final decision use.",
      ],
      confidence: `${card.jobFit}% confidence`,
    },
    fairnessAnalysis: {
      fairnessNarrative: getFairnessNarrative(fairnessScore),
      riskFactors: [
        `Fairness snapshot score: ${fairnessScore}/100.`,
        "Fairness review is currently based on the stored report snapshot.",
      ],
      mitigationNotes: [
        "Escalate medium and high fairness risk reports for secondary review.",
        "Pair automated output with structured human review steps.",
      ],
      fairnessMetrics: [
        { name: "Fairness snapshot", value: `${fairnessScore}`, target: "<= 45" },
        { name: "Job fit confidence", value: `${card.jobFit}%`, target: ">= 70%" },
      ],
    },
    counterfactualResults: {
      summary: "This report currently stores recommendation confidence and fairness snapshot data rather than full counterfactual outputs.",
      counterfactualChanges: [
        "Add stronger evidence and quantified impact to improve recommendation reliability.",
        "Re-run the audit when resume content changes materially.",
      ],
      expectedOutcomeShift: "Higher-evidence resumes generally improve confidence and reduce manual-review uncertainty.",
    },
    improvementSuggestions: {
      skillsToStrengthen: [
        "Evidence quality",
        "Quantified outcomes",
        "Role-specific supporting detail",
      ],
      resumeEdits: [
        "Make the most relevant role achievements measurable.",
        "Add supporting links or artifacts when available.",
      ],
      evidenceToAdd: [
        "Portfolio, GitHub, or project references tied to the target role.",
        "Proof points for the most important candidate claims.",
      ],
      humanReviewChecklist: [
        "Confirm the candidate’s strongest claims against the uploaded resume.",
        "Review fairness risk before sharing or exporting the report.",
      ],
    },
    auditTrail: [
      {
        timestamp: report.audit?.createdAt ?? report.createdAt,
        actor: "BiasLens",
        action: "Audit created",
        detail: "Resume and job role entered the audit pipeline.",
      },
      {
        timestamp: report.createdAt,
        actor: "BiasLens",
        action: "Report generated",
        detail: "Export-ready report created from the completed audit.",
      },
    ],
    complianceNotes: {
      summary: "This report is decision support, not a standalone hiring decision.",
      notes: [
        "Reviewers should validate the underlying resume evidence before taking action.",
        "Fairness risk should be considered alongside the role recommendation.",
      ],
      dataHandling: [
        "Share only with authorized reviewers.",
        "Use exported reports within your retention and audit policy.",
      ],
    },
  };
}
