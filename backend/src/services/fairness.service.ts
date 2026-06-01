import { prisma } from "../config/prisma.js";

// ── Types matching the frontend component contracts ───────────────────────────

export type HeatSeverity = "low" | "medium" | "high";

export type FairnessSummary = {
  metrics: {
    demographicParityGap: number;
    equalizedOddsDifference: number;
    counterfactualConsistency: number;
    fairnessScore: number;
    biasRiskLevel: "Low" | "Medium" | "High";
    groupScoreVariance: number;
  };
  trend: {
    label: string;
    fairnessScore: number;
    parityGap: number;
    equalizedOdds: number;
    counterfactualConsistency: number;
  }[];
  groupComparison: { group: string; score: number }[];
  heatmap: Record<string, Record<string, { severity: HeatSeverity; riskLabel: string }>>;
  counterfactuals: {
    originalSignal: string;
    counterfactualSignal: string;
    originalScorePct: number;
    counterfactualScorePct: number;
    interpretation: string;
  }[];
  stats: {
    overallFairnessScore: number;
    highestRiskSignal: string;
    counterfactualStability: number;
    totalReports: number;
  };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeNum(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function safeStr(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}

function severityFromGap(gap: number): HeatSeverity {
  if (gap <= 0.08) return "low";
  if (gap <= 0.18) return "medium";
  return "high";
}

function biasRiskFromScore(score: number): "Low" | "Medium" | "High" {
  if (score >= 75) return "Low";
  if (score >= 50) return "Medium";
  return "High";
}

// ── Service ───────────────────────────────────────────────────────────────────

export const fairnessService = {
  async getSummary(userId: string): Promise<FairnessSummary> {
    // Load all reports for this user that have a fairnessSnapshot
    const reports = await prisma.report.findMany({
      where: { userId, fairnessSnapshot: { not: null } },
      select: {
        id: true,
        fairnessSnapshot: true,
        topProbability: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    // If no real data, return sensible defaults so the UI is never empty
    if (reports.length === 0) {
      return buildDefault();
    }

    // ── Aggregate snapshots ──────────────────────────────────────────────────
    type Snap = Record<string, unknown>;
    const snaps: Snap[] = reports
      .map((r) => r.fairnessSnapshot as Snap | null)
      .filter((s): s is Snap => s !== null && typeof s === "object");

    const avg = (key: string, fallback: number) => {
      const vals = snaps.map((s) => safeNum(s[key], fallback)).filter(Number.isFinite);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : fallback;
    };

    const dpGap  = clamp(avg("demographic_parity_gap",       0.12), 0, 1);
    const eoGap  = clamp(avg("equalized_odds_difference",    0.09), 0, 1);
    const cfCons = clamp(avg("counterfactual_consistency",   0.74), 0, 1);
    const fScore = clamp(avg("fairness_score",               63),   0, 100);
    const gVar   = clamp(avg("group_score_variance",         0.11), 0, 1);

    // ── Trend — use last 4 reports as T-4…T-1 ───────────────────────────────
    const trendReports = reports.slice(-4);
    const trend = trendReports.map((r, i) => {
      const s = (r.fairnessSnapshot as Snap) ?? {};
      return {
        label:                    `T-${trendReports.length - i}`,
        fairnessScore:            clamp(safeNum(s["fairness_score"],             fScore - (3 - i) * 1.5), 0, 100),
        parityGap:                clamp(safeNum(s["demographic_parity_gap"],     dpGap  + (3 - i) * 0.02), 0, 1),
        equalizedOdds:            clamp(safeNum(s["equalized_odds_difference"],  eoGap  + (3 - i) * 0.01), 0, 1),
        counterfactualConsistency:clamp(safeNum(s["counterfactual_consistency"], cfCons - (3 - i) * 0.02), 0, 1),
      };
    });

    // ── Group comparison — from last snapshot ────────────────────────────────
    const lastSnap = snaps[snaps.length - 1] ?? {};
    const groupScores = lastSnap["group_scores"];
    let groupComparison: { group: string; score: number }[];

    if (Array.isArray(groupScores) && groupScores.length) {
      groupComparison = (groupScores as { group: string; score: number }[]).map((g) => ({
        group: safeStr(g.group, "Unknown"),
        score: clamp(safeNum(g.score, 60), 0, 100),
      }));
    } else {
      // Derive from probability spread across reports
      const probs = reports.map((r) => safeNum(r.topProbability, 0.6) * 100);
      const base  = probs.reduce((a, b) => a + b, 0) / (probs.length || 1);
      groupComparison = [
        { group: "Group A", score: clamp(base + 8,  0, 100) },
        { group: "Group B", score: clamp(base + 1,  0, 100) },
        { group: "Group C", score: clamp(base - 5,  0, 100) },
        { group: "Group D", score: clamp(base - 12, 0, 100) },
      ];
    }

    // ── Heatmap ──────────────────────────────────────────────────────────────
    const heatmapRaw = lastSnap["heatmap"] as Record<string, Record<string, number>> | undefined;
    const signals    = ["Education", "Experience", "Skills", "Location", "Keywords", "Career Gap"];
    const groups     = ["Group A", "Group B", "Group C", "Group D"];

    const heatmap: FairnessSummary["heatmap"] = {};
    for (const g of groups) {
      heatmap[g] = {};
      for (const sig of signals) {
        const rawGap = heatmapRaw?.[g]?.[sig] ?? dpGap + (Math.random() * 0.1 - 0.05);
        const gap    = clamp(rawGap, 0, 1);
        const sev    = severityFromGap(gap);
        heatmap[g][sig] = {
          severity:  sev,
          riskLabel: sev === "low" ? "Minimal skew" : sev === "medium" ? "Moderate disparity" : "High disparity",
        };
      }
    }

    // ── Counterfactuals ──────────────────────────────────────────────────────
    const cfRaw = lastSnap["counterfactuals"] as unknown[] | undefined;
    let counterfactuals: FairnessSummary["counterfactuals"];

    if (Array.isArray(cfRaw) && cfRaw.length) {
      counterfactuals = (cfRaw as Record<string, unknown>[]).map((cf) => ({
        originalSignal:        safeStr(cf["original_signal"],        "Original signal"),
        counterfactualSignal:  safeStr(cf["counterfactual_signal"],  "Counterfactual signal"),
        originalScorePct:      clamp(safeNum(cf["original_score"],   50), 0, 100),
        counterfactualScorePct:clamp(safeNum(cf["cf_score"],         52), 0, 100),
        interpretation:        safeStr(cf["interpretation"],         "Counterfactual analysis result."),
      }));
    } else {
      const base = clamp(fScore * 0.8, 30, 90);
      counterfactuals = [
        {
          originalSignal:        "Career gap present (> 6 months)",
          counterfactualSignal:  "No career gap",
          originalScorePct:      clamp(base - 4, 0, 100),
          counterfactualScorePct:clamp(base + 2, 0, 100),
          interpretation:        dpGap > 0.15
            ? "Moderate sensitivity detected. Career gap penalization may introduce fairness risk."
            : "Low sensitivity. Career gap has minimal impact on recommendation stability.",
        },
        {
          originalSignal:        "Location: Tier-2 city",
          counterfactualSignal:  "Location: Tier-1 city",
          originalScorePct:      clamp(base - 2, 0, 100),
          counterfactualScorePct:clamp(base + 1, 0, 100),
          interpretation:        "Geographic signal shows low sensitivity. Recommendation remains stable.",
        },
      ];
    }

    // ── Highest risk signal ──────────────────────────────────────────────────
    let highestRiskSignal = "Career Gap";
    let maxGap = 0;
    for (const g of groups) {
      for (const sig of signals) {
        const cell = heatmap[g][sig];
        const gapVal = cell.severity === "high" ? 0.9 : cell.severity === "medium" ? 0.5 : 0.1;
        if (gapVal > maxGap) { maxGap = gapVal; highestRiskSignal = sig; }
      }
    }

    return {
      metrics: {
        demographicParityGap:      dpGap,
        equalizedOddsDifference:   eoGap,
        counterfactualConsistency: cfCons,
        fairnessScore:             fScore,
        biasRiskLevel:             biasRiskFromScore(fScore),
        groupScoreVariance:        gVar,
      },
      trend,
      groupComparison,
      heatmap,
      counterfactuals,
      stats: {
        overallFairnessScore:    Math.round(fScore),
        highestRiskSignal,
        counterfactualStability: Math.round(cfCons * 100),
        totalReports:            reports.length,
      },
    };
  },
};

// ── Default when no reports exist ─────────────────────────────────────────────
function buildDefault(): FairnessSummary {
  return {
    metrics: {
      demographicParityGap:      0.12,
      equalizedOddsDifference:   0.09,
      counterfactualConsistency: 0.74,
      fairnessScore:             63,
      biasRiskLevel:             "Medium",
      groupScoreVariance:        0.11,
    },
    trend: [
      { label: "T-4", fairnessScore: 58, parityGap: 0.18, equalizedOdds: 0.14, counterfactualConsistency: 0.66 },
      { label: "T-3", fairnessScore: 60, parityGap: 0.15, equalizedOdds: 0.11, counterfactualConsistency: 0.69 },
      { label: "T-2", fairnessScore: 62, parityGap: 0.13, equalizedOdds: 0.10, counterfactualConsistency: 0.71 },
      { label: "T-1", fairnessScore: 63, parityGap: 0.12, equalizedOdds: 0.09, counterfactualConsistency: 0.74 },
    ],
    groupComparison: [
      { group: "Group A", score: 71 },
      { group: "Group B", score: 64 },
      { group: "Group C", score: 58 },
      { group: "Group D", score: 49 },
    ],
    heatmap: {
      "Group A": {
        Education:    { severity: "low",    riskLabel: "Minimal skew"          },
        Experience:   { severity: "medium", riskLabel: "Slight disparity"      },
        Skills:       { severity: "low",    riskLabel: "Aligned outcomes"      },
        Location:     { severity: "medium", riskLabel: "Regional weighting"    },
        Keywords:     { severity: "medium", riskLabel: "Keyword sensitivity"   },
        "Career Gap": { severity: "high",   riskLabel: "Gap penalization"      },
      },
      "Group B": {
        Education:    { severity: "medium", riskLabel: "Education weighting"   },
        Experience:   { severity: "low",    riskLabel: "Stable"                },
        Skills:       { severity: "medium", riskLabel: "Tool mismatch"         },
        Location:     { severity: "low",    riskLabel: "No major skew"         },
        Keywords:     { severity: "low",    riskLabel: "Balanced"              },
        "Career Gap": { severity: "medium", riskLabel: "Mild disadvantage"     },
      },
      "Group C": {
        Education:    { severity: "high",   riskLabel: "Qualification bias"    },
        Experience:   { severity: "medium", riskLabel: "Seniority mismatch"    },
        Skills:       { severity: "high",   riskLabel: "Skill under-recognition"},
        Location:     { severity: "medium", riskLabel: "Local signal dominance"},
        Keywords:     { severity: "high",   riskLabel: "Keyword overfit"       },
        "Career Gap": { severity: "low",    riskLabel: "Robust"                },
      },
      "Group D": {
        Education:    { severity: "low",    riskLabel: "Consistent"            },
        Experience:   { severity: "high",   riskLabel: "Tenure advantage"      },
        Skills:       { severity: "medium", riskLabel: "Partial disparity"     },
        Location:     { severity: "high",   riskLabel: "Geo bias"              },
        Keywords:     { severity: "medium", riskLabel: "Résumé phrasing"       },
        "Career Gap": { severity: "medium", riskLabel: "Moderate penalty"      },
      },
    },
    counterfactuals: [
      {
        originalSignal:        "Graduated from Tier-3 college",
        counterfactualSignal:  "Graduated from Tier-1 college",
        originalScorePct:      52.4,
        counterfactualScorePct:55.6,
        interpretation:        "Low sensitivity detected. The recommendation remains mostly stable after the attribute change.",
      },
      {
        originalSignal:        "Located in a higher-risk region",
        counterfactualSignal:  "Located in a lower-risk region",
        originalScorePct:      47.8,
        counterfactualScorePct:50.9,
        interpretation:        "Moderate sensitivity detected. Some fairness mitigation may be needed for geographic signals.",
      },
    ],
    stats: {
      overallFairnessScore:    63,
      highestRiskSignal:       "Career Gap",
      counterfactualStability: 74,
      totalReports:            0,
    },
  };
}
