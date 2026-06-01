import type {
  ExplainabilityQuality,
  FairnessRisk,
  ReportStatus,
  ReportType,
} from "./ReportCard";

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

const reportRows: ReportListItem[] = [
  {
    reportId: "RPT-1042",
    auditId: "AUD-7721",
    candidateName: "Aisha Thompson",
    role: "Product Manager",
    resumeScore: 84,
    jobFit: 78,
    fairnessRisk: "Low",
    explainability: "Clear",
    status: "Ready",
    createdAt: "2026-05-30T10:20:00.000Z",
    reportType: "Resume Audit",
  },
  {
    reportId: "RPT-1043",
    auditId: "AUD-7722",
    candidateName: "Daniel Kim",
    role: "Software Engineer",
    resumeScore: 73,
    jobFit: 81,
    fairnessRisk: "Medium",
    explainability: "Moderate",
    status: "Ready",
    createdAt: "2026-05-29T15:00:00.000Z",
    reportType: "Explainability",
  },
  {
    reportId: "RPT-1044",
    auditId: "AUD-7723",
    candidateName: "Priya Nair",
    role: "Data Analyst",
    resumeScore: 66,
    jobFit: 69,
    fairnessRisk: "Low",
    explainability: "Moderate",
    status: "Processing",
    createdAt: "2026-05-28T12:45:00.000Z",
    reportType: "Fairness",
  },
  {
    reportId: "RPT-1045",
    auditId: "AUD-7724",
    candidateName: "Miguel Alvarez",
    role: "UX Researcher",
    resumeScore: 58,
    jobFit: 63,
    fairnessRisk: "High",
    explainability: "Limited",
    status: "Failed",
    createdAt: "2026-05-27T08:15:00.000Z",
    reportType: "Resume Audit",
  },
  {
    reportId: "RPT-1046",
    auditId: "AUD-7725",
    candidateName: "Jordan Blake",
    role: "People Analytics Lead",
    resumeScore: 89,
    jobFit: 86,
    fairnessRisk: "Low",
    explainability: "Clear",
    status: "Ready",
    createdAt: "2026-05-26T16:40:00.000Z",
    reportType: "Fairness",
  },
];

export function getReportList() {
  return reportRows;
}

export function getReportById(reportId: string) {
  return reportRows.find((row) => row.reportId === reportId) ?? reportRows[0];
}
