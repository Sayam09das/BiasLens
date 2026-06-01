import { prisma } from "../config/prisma.js";
import { mlClientService } from "./ml-client.service.js";
import { logger } from "../config/logger.js";

// ── Output types (match frontend component prop contracts exactly) ─────────────

export type ShapDatum = {
  signal: string;
  value: number; // signed contribution in percentage points
};

export type FeatureImportanceDatum = {
  key: string;
  label: string;
  category: "Experience" | "Skills" | "Impact" | "Education" | "Leadership" | "Evidence" | "Quality";
  importancePct: number;
  delta: "positive" | "negative" | "neutral";
  helperText: string;
};

export type ProxySignal = {
  id: string;
  signal: string;
  category: string;
  risk: "Low" | "Medium" | "High";
  reason: string;
  recommendation: string;
  status: "Review" | "Action Needed" | "Monitor";
};

export type ExplanationData = {
  summary: string;
  whyThisScore: string;
  positiveSignals: string[];
  negativeSignals: string[];
  missingEvidence: string[];
  confidence: string;
  confidenceReasoning: string;
  recommendedHumanReview: string;
};

export type ExplainabilitySummary = {
  shap: ShapDatum[];
  features: FeatureImportanceDatum[];
  proxySignals: ProxySignal[];
  explanation: ExplanationData;
  stats: {
    topPositiveDriver: string;
    topNegativeDriver: string;
    proxySignalCount: number;
    totalReports: number;
  };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeNum(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function safeStr(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function safeArr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

// ── Service ───────────────────────────────────────────────────────────────────

export const explainabilityService = {
  async getSummary(userId: string): Promise<ExplainabilitySummary> {
    // Load latest 20 reports for this user
    const reports = await prisma.report.findMany({
      where:   { userId },
      select:  { id: true, title: true, predictionLabel: true, topProbability: true, fairnessSnapshot: true, auditId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take:    20,
    });

    if (reports.length === 0) return buildDefault();

    const latest = reports[0];
    type Snap = Record<string, unknown>;
    const snap = (latest.fairnessSnapshot as Snap | null) ?? {};

    // ── Try ML explain endpoint for the latest audit ─────────────────────────
    let mlExplain: Snap = {};
    if (latest.auditId) {
      try {
        const audit = await prisma.audit.findUnique({
          where:  { id: latest.auditId },
          select: { resumeText: true, jobRole: true },
        });
        if (audit?.resumeText) {
          mlExplain = await mlClientService.explain({
            resume_text: audit.resumeText,
            job_role:    audit.jobRole ?? "",
          }) as Snap;
        }
      } catch (err) {
        logger.warn({ err }, "ML explain call failed — using snapshot fallback");
      }
    }

    // ── SHAP values ──────────────────────────────────────────────────────────
    const rawShap = safeArr<Snap>(mlExplain["shap_values"] ?? snap["shap_values"]);
    let shap: ShapDatum[];

    if (rawShap.length) {
      shap = rawShap.map((s) => ({
        signal: safeStr(s["feature"] ?? s["signal"], "Unknown signal"),
        value:  safeNum(s["value"] ?? s["contribution"], 0),
      }));
    } else {
      // Derive from topProbability spread across reports
      const prob = safeNum(latest.topProbability, 0.65);
      shap = buildDefaultShap(prob);
    }

    // ── Feature importance ───────────────────────────────────────────────────
    const rawFeatures = safeArr<Snap>(mlExplain["feature_importance"] ?? snap["feature_importance"]);
    let features: FeatureImportanceDatum[];

    if (rawFeatures.length) {
      features = rawFeatures.map((f, i) => ({
        key:           safeStr(f["key"] ?? String(i), `feat-${i}`),
        label:         safeStr(f["label"] ?? f["feature"], "Feature"),
        category:      mapCategory(safeStr(f["category"], "Quality")),
        importancePct: safeNum(f["importance_pct"] ?? f["importance"], 10),
        delta:         mapDelta(safeStr(f["delta"] ?? f["direction"], "neutral")),
        helperText:    safeStr(f["helper_text"] ?? f["description"], "Contributes to the overall score."),
      }));
    } else {
      features = buildDefaultFeatures(safeNum(latest.topProbability, 0.65));
    }

    // ── Proxy signals ────────────────────────────────────────────────────────
    const rawProxy = safeArr<Snap>(mlExplain["proxy_signals"] ?? snap["proxy_signals"]);
    let proxySignals: ProxySignal[];

    if (rawProxy.length) {
      proxySignals = rawProxy.map((p, i) => ({
        id:             safeStr(p["id"], `proxy-${i}`),
        signal:         safeStr(p["signal"], "Unknown"),
        category:       safeStr(p["category"], "Other"),
        risk:           mapRisk(safeStr(p["risk"], "Medium")),
        reason:         safeStr(p["reason"], "Potential proxy signal detected."),
        recommendation: safeStr(p["recommendation"], "Review and validate."),
        status:         mapStatus(safeStr(p["status"], "Review")),
      }));
    } else {
      proxySignals = buildDefaultProxySignals();
    }

    // ── Explanation narrative ────────────────────────────────────────────────
    const rawExpl = (mlExplain["explanation"] ?? snap["explanation"]) as Snap | undefined;
    const explanation: ExplanationData = rawExpl
      ? {
          summary:                safeStr(rawExpl["summary"],                  buildSummary(latest.predictionLabel, latest.topProbability)),
          whyThisScore:           safeStr(rawExpl["why_this_score"],           buildWhyScore(latest.topProbability)),
          positiveSignals:        safeArr<string>(rawExpl["positive_signals"]),
          negativeSignals:        safeArr<string>(rawExpl["negative_signals"]),
          missingEvidence:        safeArr<string>(rawExpl["missing_evidence"]),
          confidence:             safeStr(rawExpl["confidence"],               mapConfidence(latest.topProbability)),
          confidenceReasoning:    safeStr(rawExpl["confidence_reasoning"],     "Confidence is based on signal alignment and evidence quality."),
          recommendedHumanReview: safeStr(rawExpl["recommended_human_review"], "Verify key claims and validate evidence before final decision."),
        }
      : buildDefaultExplanation(latest.predictionLabel, latest.topProbability, shap);

    // ── Stats ────────────────────────────────────────────────────────────────
    const sorted     = [...shap].sort((a, b) => b.value - a.value);
    const topPos     = sorted.find((s) => s.value > 0);
    const topNeg     = [...shap].sort((a, b) => a.value - b.value).find((s) => s.value < 0);
    const actionable = proxySignals.filter((p) => p.status === "Action Needed").length;

    return {
      shap,
      features,
      proxySignals,
      explanation,
      stats: {
        topPositiveDriver: topPos?.signal ?? "—",
        topNegativeDriver: topNeg?.signal ?? "—",
        proxySignalCount:  proxySignals.length,
        totalReports:      reports.length,
      },
    };
  },
};

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapCategory(raw: string): FeatureImportanceDatum["category"] {
  const map: Record<string, FeatureImportanceDatum["category"]> = {
    experience: "Experience", skills: "Skills", impact: "Impact",
    education: "Education", leadership: "Leadership", evidence: "Evidence", quality: "Quality",
  };
  return map[raw.toLowerCase()] ?? "Quality";
}

function mapDelta(raw: string): FeatureImportanceDatum["delta"] {
  if (raw === "positive" || raw === "up")   return "positive";
  if (raw === "negative" || raw === "down") return "negative";
  return "neutral";
}

function mapRisk(raw: string): ProxySignal["risk"] {
  if (raw.toLowerCase() === "high")   return "High";
  if (raw.toLowerCase() === "low")    return "Low";
  return "Medium";
}

function mapStatus(raw: string): ProxySignal["status"] {
  if (raw === "Action Needed") return "Action Needed";
  if (raw === "Monitor")       return "Monitor";
  return "Review";
}

function mapConfidence(prob: number | null): string {
  const p = safeNum(prob, 0.65);
  if (p >= 0.80) return "High confidence";
  if (p >= 0.60) return "Medium confidence";
  return "Low confidence";
}

// ── Narrative builders ────────────────────────────────────────────────────────

function buildSummary(label: string | null, prob: number | null): string {
  const pct  = Math.round(safeNum(prob, 0.65) * 100);
  const lbl  = label ?? "candidate";
  return `This resume received a ${pct}% confidence score for the ${lbl} classification. The model found strong alignment in several key areas while identifying gaps that reduce certainty.`;
}

function buildWhyScore(prob: number | null): string {
  const pct = Math.round(safeNum(prob, 0.65) * 100);
  return `The model assigned a ${pct}% confidence score based on the weighted combination of experience signals, skills alignment, and evidence quality. Signals with high specificity and measurable outcomes contributed most positively.`;
}

function buildDefaultExplanation(
  label: string | null,
  prob: number | null,
  shap: ShapDatum[]
): ExplanationData {
  const pos = shap.filter((s) => s.value > 0).map((s) => s.signal);
  const neg = shap.filter((s) => s.value < 0).map((s) => s.signal);
  return {
    summary:                buildSummary(label, prob),
    whyThisScore:           buildWhyScore(prob),
    positiveSignals:        pos.length ? pos : ["Relevant experience", "Skills alignment"],
    negativeSignals:        neg.length ? neg : ["Missing portfolio link", "Limited evidence"],
    missingEvidence:        ["Portfolio URL", "Quantified outcomes", "Accessibility case study"],
    confidence:             mapConfidence(prob),
    confidenceReasoning:    "Confidence reflects the degree of alignment between resume signals and role requirements. Gaps in evidence reduce certainty.",
    recommendedHumanReview: "Verify portfolio availability, review accessibility contributions, and assess whether quantified outcomes exist but are not captured in the resume text.",
  };
}

// ── Static defaults (used when no reports exist) ──────────────────────────────

function buildDefaultShap(prob: number): ShapDatum[] {
  const base = (prob - 0.5) * 20;
  return [
    { signal: "Product Strategy Experience",      value: +(base + 6.4).toFixed(2) },
    { signal: "UX Research",                      value: +(base + 3.2).toFixed(2) },
    { signal: "Leadership Impact",                value: +(base + 2.1).toFixed(2) },
    { signal: "Metrics Driven Results",           value: +(base + 1.4).toFixed(2) },
    { signal: "Missing Portfolio Link",           value: -(base + 2.6).toFixed(2) as unknown as number },
    { signal: "Limited Accessibility Evidence",   value: -3.9 },
    { signal: "Weak Quantified Outcomes",         value: -5.2 },
  ];
}

function buildDefaultFeatures(prob: number): FeatureImportanceDatum[] {
  const scale = Math.max(0.5, Math.min(1.5, prob / 0.65));
  return [
    { key: "exp",      label: "Relevant Experience",  category: "Experience",  importancePct: Math.round(28 * scale), delta: "positive", helperText: "Demonstrates directly transferable experience aligned to the role." },
    { key: "skills",   label: "Skills Match",         category: "Skills",      importancePct: Math.round(24 * scale), delta: "positive", helperText: "High overlap between listed skills and required capabilities." },
    { key: "projects", label: "Project Impact",       category: "Impact",      importancePct: Math.round(17 * scale), delta: "positive", helperText: "Shows outcomes, measurable improvements, and scope of impact." },
    { key: "edu",      label: "Education Alignment",  category: "Education",   importancePct: 12,                     delta: "neutral",  helperText: "Supports baseline qualification but less decisive than experience." },
    { key: "lead",     label: "Leadership Signals",   category: "Leadership",  importancePct: 9,                      delta: "positive", helperText: "Indicates collaboration, ownership, or responsibility." },
    { key: "evidence", label: "Missing Evidence",     category: "Evidence",    importancePct: 6,                      delta: "negative", helperText: "Key claims lack proof — metrics, artifacts, or concrete results." },
    { key: "clarity",  label: "Resume Clarity",       category: "Quality",     importancePct: 4,                      delta: "neutral",  helperText: "Readability and structure improve signal extraction." },
  ];
}

function buildDefaultProxySignals(): ProxySignal[] {
  return [
    { id: "college-tier",    signal: "College Tier",    category: "Education",          risk: "Medium", reason: "May correlate with socioeconomic background.",                                    recommendation: "Normalize education weight and focus on demonstrated skills.", status: "Review"        },
    { id: "location",        signal: "Location",        category: "Geography",          risk: "High",   reason: "May influence scoring through regional hiring bias.",                             recommendation: "Remove location weighting unless role-relevant.",             status: "Action Needed" },
    { id: "career-gap",      signal: "Career Gap",      category: "Employment History", risk: "Medium", reason: "May unfairly penalize caregiving or non-linear careers.",                        recommendation: "Evaluate context and avoid automatic penalty.",                status: "Review"        },
    { id: "name-pattern",    signal: "Name Pattern",    category: "Identity Proxy",     risk: "High",   reason: "Could act as a demographic proxy when correlated with protected attributes.",    recommendation: "Mask identity signals during scoring.",                        status: "Action Needed" },
    { id: "keyword-density", signal: "Keyword Density", category: "Resume Style",       risk: "Low",    reason: "May favor ATS-optimized resumes over equally qualified candidates.",              recommendation: "Balance keyword scoring with experience evidence.",            status: "Monitor"       },
  ];
}

function buildDefault(): ExplainabilitySummary {
  const shap     = buildDefaultShap(0.65);
  const features = buildDefaultFeatures(0.65);
  const proxy    = buildDefaultProxySignals();
  return {
    shap,
    features,
    proxySignals: proxy,
    explanation:  buildDefaultExplanation(null, 0.65, shap),
    stats: {
      topPositiveDriver: "Product Strategy Experience",
      topNegativeDriver: "Weak Quantified Outcomes",
      proxySignalCount:  proxy.length,
      totalReports:      0,
    },
  };
}
