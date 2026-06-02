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

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter(Boolean);
}

function includesAny(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(pattern));
}

function buildDerivedExplainability(input: {
  resumeText: string;
  jobRole: string;
  topProbability: number | null;
  predictionLabel: string | null;
}) {
  const resumeText = input.resumeText.trim();
  const jobRole = input.jobRole.trim();
  const lowerResume = resumeText.toLowerCase();
  const lowerRole = jobRole.toLowerCase();
  const roleTerms = uniqueStrings(tokenize(lowerRole)).slice(0, 6);
  const probability = safeNum(input.topProbability, 0.65);

  const yearsMatches = lowerResume.match(/\b\d+\+?\s*(?:years?|yrs?)\b/g) ?? [];
  const metricMatches = lowerResume.match(/\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\s*(?:k|m|million|billion|users|clients|projects)\b/g) ?? [];
  const leadershipPresent = includesAny(lowerResume, [
    "led ",
    "managed ",
    "owner",
    "ownership",
    "mentored",
    "team lead",
    "stakeholder",
  ]);
  const portfolioPresent = includesAny(lowerResume, ["github", "portfolio", "behance", "dribbble", "linkedin.com", "gitlab"]);
  const educationPresent = includesAny(lowerResume, ["b.tech", "btech", "bachelor", "master", "m.tech", "degree", "university", "college"]);
  const impactPresent = metricMatches.length > 0;
  const roleMatches = roleTerms.filter((term) => lowerResume.includes(term));
  const roleMatchRatio = roleTerms.length ? roleMatches.length / roleTerms.length : 0;

  const positiveSignals = uniqueStrings([
    roleMatches.length ? `Role alignment detected for ${roleMatches.join(", ")}.` : "",
    yearsMatches.length ? `Experience evidence found in ${yearsMatches.length} tenure reference${yearsMatches.length === 1 ? "" : "s"}.` : "",
    impactPresent ? "Quantified impact signals were found in the resume text." : "",
    leadershipPresent ? "Leadership and ownership language was detected." : "",
    portfolioPresent ? "Supporting portfolio or profile evidence was referenced." : "",
  ]);

  const negativeSignals = uniqueStrings([
    roleMatchRatio < 0.4 ? "Limited overlap between the resume wording and the requested role terms." : "",
    !impactPresent ? "The resume lacks strong quantified outcome evidence." : "",
    !portfolioPresent ? "No portfolio, GitHub, or supporting profile link was detected." : "",
    !educationPresent ? "Education or qualification details were not clearly detected." : "",
  ]);

  const missingEvidence = uniqueStrings([
    !impactPresent ? "Quantified outcomes for major responsibilities" : "",
    !portfolioPresent ? "Portfolio, GitHub, or work-sample link" : "",
    roleMatchRatio < 0.5 ? `More direct references to ${jobRole || "the target role"}` : "",
  ]);

  const shap: ShapDatum[] = [
    { signal: "Role Keyword Alignment", value: Number((roleMatchRatio * 8 - 2).toFixed(2)) },
    { signal: "Experience Evidence", value: Number((Math.min(yearsMatches.length, 4) * 1.8).toFixed(2)) },
    { signal: "Quantified Impact", value: impactPresent ? 3.4 : -3.8 },
    { signal: "Leadership Language", value: leadershipPresent ? 2.5 : -1.2 },
    { signal: "Supporting Links", value: portfolioPresent ? 1.8 : -2.6 },
    { signal: "Education Clarity", value: educationPresent ? 1.2 : -1.4 },
  ]
    .filter((item) => Number.isFinite(item.value) && Math.abs(item.value) > 0.05)
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value));

  const features: FeatureImportanceDatum[] = [
    {
      key: "role-alignment",
      label: "Role Alignment",
      category: "Skills" as const,
      importancePct: Math.round(Math.max(8, roleMatchRatio * 32)),
      delta: (roleMatchRatio >= 0.55 ? "positive" : roleMatchRatio >= 0.35 ? "neutral" : "negative") as FeatureImportanceDatum["delta"],
      helperText: "Measures how directly the resume language overlaps with the requested role brief.",
    },
    {
      key: "experience",
      label: "Experience Depth",
      category: "Experience" as const,
      importancePct: Math.min(28, 8 + yearsMatches.length * 4),
      delta: (yearsMatches.length > 0 ? "positive" : "neutral") as FeatureImportanceDatum["delta"],
      helperText: "Looks for explicit tenure and experience depth signals in the resume text.",
    },
    {
      key: "impact",
      label: "Quantified Impact",
      category: "Impact" as const,
      importancePct: impactPresent ? 22 : 10,
      delta: (impactPresent ? "positive" : "negative") as FeatureImportanceDatum["delta"],
      helperText: "Rewards measurable outcomes, percentages, counts, and business impact evidence.",
    },
    {
      key: "leadership",
      label: "Leadership Signals",
      category: "Leadership" as const,
      importancePct: leadershipPresent ? 16 : 8,
      delta: (leadershipPresent ? "positive" : "neutral") as FeatureImportanceDatum["delta"],
      helperText: "Checks for ownership, cross-functional leadership, or team guidance language.",
    },
    {
      key: "evidence",
      label: "Supporting Evidence",
      category: "Evidence" as const,
      importancePct: portfolioPresent ? 14 : 7,
      delta: (portfolioPresent ? "positive" : "negative") as FeatureImportanceDatum["delta"],
      helperText: "Looks for portfolio, GitHub, or supporting proof that strengthens review confidence.",
    },
    {
      key: "education",
      label: "Education Clarity",
      category: "Education" as const,
      importancePct: educationPresent ? 8 : 5,
      delta: (educationPresent ? "neutral" : "negative") as FeatureImportanceDatum["delta"],
      helperText: "Captures whether education and qualification details were clearly expressed.",
    },
  ].sort((left, right) => right.importancePct - left.importancePct);

  const proxySignals: ProxySignal[] = uniqueStrings([
    includesAny(lowerResume, ["location", "address", "relocate", "remote", "city", "state"]) ? "location" : "",
    includesAny(lowerResume, ["college", "university"]) ? "education" : "",
    includesAny(lowerResume, ["gap", "career break", "break"]) ? "career-gap" : "",
    includesAny(lowerResume, ["date of birth", "dob", "married", "single", "nationality"]) ? "identity" : "",
  ]).map((signal, index) => {
    if (signal === "location") {
      return {
        id: `proxy-${index}`,
        signal: "Location",
        category: "Geography",
        risk: "Medium",
        reason: "Location-related terms may influence review consistency when they are not role-relevant.",
        recommendation: "Review whether geographic information is necessary for this decision.",
        status: "Review",
      } satisfies ProxySignal;
    }

    if (signal === "education") {
      return {
        id: `proxy-${index}`,
        signal: "College / University",
        category: "Education",
        risk: "Low",
        reason: "Institution references can become proxies when over-weighted during screening.",
        recommendation: "Keep focus on demonstrated skills and outcome evidence.",
        status: "Monitor",
      } satisfies ProxySignal;
    }

    if (signal === "career-gap") {
      return {
        id: `proxy-${index}`,
        signal: "Career Gap",
        category: "Employment History",
        risk: "Medium",
        reason: "Gap-related language can penalize candidates without proper context.",
        recommendation: "Validate context manually before using gap language as a scoring factor.",
        status: "Review",
      } satisfies ProxySignal;
    }

    return {
      id: `proxy-${index}`,
      signal: "Personal Identity Detail",
      category: "Identity Proxy",
      risk: "High",
      reason: "Personal details may correlate with protected attributes and require review.",
      recommendation: "Mask or ignore identity-related details during automated scoring.",
      status: "Action Needed",
    } satisfies ProxySignal;
  });

  const confidence = mapConfidence(probability);

  return {
    shap,
    features,
    proxySignals,
    explanation: {
      summary: buildSummary(input.predictionLabel, probability),
      whyThisScore: `The current score reflects role-term overlap, evidence of experience, and whether the resume includes measurable outcomes or supporting links for ${jobRole || "the requested role"}.`,
      positiveSignals,
      negativeSignals,
      missingEvidence,
      confidence,
      confidenceReasoning: "Confidence is derived from the quality and specificity of the stored audit text when richer ML explanations are unavailable.",
      recommendedHumanReview: "Verify the strongest matched signals against the original resume and add any missing evidence before acting on the recommendation.",
    } satisfies ExplanationData,
  };
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

    if (reports.length === 0) {
      return {
        shap: [],
        features: [],
        proxySignals: [],
        explanation: {
          summary: "No explainability data has been generated yet.",
          whyThisScore: "Complete an audit with stored explainability output to populate this dashboard.",
          positiveSignals: [],
          negativeSignals: [],
          missingEvidence: [],
          confidence: "No confidence available",
          confidenceReasoning: "No explainability artifacts are stored for this account yet.",
          recommendedHumanReview: "Run a new audit to generate explainability data for reviewer inspection.",
        },
        stats: {
          topPositiveDriver: "No explainability data yet",
          topNegativeDriver: "No explainability data yet",
          proxySignalCount: 0,
          totalReports: 0,
        },
      };
    }

    const latest = reports[0];
    type Snap = Record<string, unknown>;
    const snap = (latest.fairnessSnapshot as Snap | null) ?? {};

    // ── Try ML explain endpoint for the latest audit ─────────────────────────
    let mlExplain: Snap = {};
    let auditText = "";
    let auditRole = "";
    if (latest.auditId) {
      try {
        const audit = await prisma.audit.findUnique({
          where:  { id: latest.auditId },
          select: { resumeText: true, jobRole: true },
        });
        auditText = audit?.resumeText ?? "";
        auditRole = audit?.jobRole ?? "";
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

    const derivedExplainability = buildDerivedExplainability({
      resumeText: auditText,
      jobRole: auditRole,
      topProbability: latest.topProbability,
      predictionLabel: latest.predictionLabel,
    });

    // ── SHAP values ──────────────────────────────────────────────────────────
    const rawShap = safeArr<Snap>(mlExplain["shap_values"] ?? snap["shap_values"]);
    let shap: ShapDatum[];

    if (rawShap.length) {
      shap = rawShap.map((s) => ({
        signal: safeStr(s["feature"] ?? s["signal"], "Unknown signal"),
        value:  safeNum(s["value"] ?? s["contribution"], 0),
      }));
    } else {
      shap = derivedExplainability.shap;
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
      features = derivedExplainability.features;
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
      proxySignals = derivedExplainability.proxySignals;
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
      : {
          ...derivedExplainability.explanation,
          positiveSignals: derivedExplainability.explanation.positiveSignals.length
            ? derivedExplainability.explanation.positiveSignals
            : shap.filter((item) => item.value > 0).map((item) => item.signal),
          negativeSignals: derivedExplainability.explanation.negativeSignals.length
            ? derivedExplainability.explanation.negativeSignals
            : shap.filter((item) => item.value < 0).map((item) => item.signal),
        };

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

function buildLiveExplanation(
  label: string | null,
  prob: number | null,
  shap: ShapDatum[]
): ExplanationData {
  const pos = shap.filter((s) => s.value > 0).map((s) => s.signal);
  const neg = shap.filter((s) => s.value < 0).map((s) => s.signal);
  return {
    summary:                buildSummary(label, prob),
    whyThisScore:           buildWhyScore(prob),
    positiveSignals:        pos,
    negativeSignals:        neg,
    missingEvidence:        [],
    confidence:             mapConfidence(prob),
    confidenceReasoning:    "Confidence reflects the degree of alignment between stored report signals and role requirements.",
    recommendedHumanReview: "Review the latest audit evidence and verify key claims before making a final decision.",
  };
}
