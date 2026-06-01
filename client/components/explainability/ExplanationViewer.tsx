"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Sparkles,
  ShieldCheck,
  ShieldX,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type ExplanationSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

type ExplanationViewerProps = {
  explanation?: {
    summary?: string;
    whyThisScore?: string;
    positiveSignals?: string[];
    negativeSignals?: string[];
    missingEvidence?: string[];
    confidence?: string;
    confidenceReasoning?: string;
    recommendedHumanReview?: string;
  } | null;
  className?: string;
};

const BRAND = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  background: "#FFFFFF",
  secondaryBackground: "#F6F8FB",
  text: "#0D0C22",
  mutedText: "#6E6D7A",
  border: "#E7E7E9",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

function confidenceTone(confidenceText: string): "success" | "warning" | "danger" {
  const t = confidenceText.toLowerCase();
  if (t.includes("high")) return "success";
  if (t.includes("medium")) return "warning";
  return "danger";
}

function toneStyles(tone: "success" | "warning" | "danger") {
  if (tone === "success") {
    return {
      bg: "rgba(34,197,94,0.10)",
      bd: "rgba(34,197,94,0.25)",
      fg: BRAND.success,
      icon: <CheckCircle2 size={16} aria-hidden="true" />,
      label: "High confidence",
    };
  }
  if (tone === "warning") {
    return {
      bg: "rgba(245,158,11,0.10)",
      bd: "rgba(245,158,11,0.25)",
      fg: BRAND.warning,
      icon: <Info size={16} aria-hidden="true" />,
      label: "Medium confidence",
    };
  }

  return {
    bg: "rgba(239,68,68,0.10)",
    bd: "rgba(239,68,68,0.25)",
    fg: BRAND.danger,
    icon: <AlertCircle size={16} aria-hidden="true" />,
    label: "Low confidence",
  };
}

function ConfidenceBadge({ confidenceText }: { confidenceText: string }) {
  const tone = confidenceTone(confidenceText);
  const s = toneStyles(tone);

  return (
    <span
      className="inline-flex items-center rounded-[1.25rem] border px-4 py-2 text-xs font-semibold"
      style={{ background: s.bg, borderColor: s.bd, color: s.fg }}
      aria-label={`Confidence badge: ${confidenceText}`}
    >
      <span className="mr-2" aria-hidden="true">{s.icon}</span>
      {confidenceText}
    </span>
  );
}

function useCopyToClipboard() {
  const [state, setState] = React.useState<"idle" | "copied" | "error">("idle");

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      window.setTimeout(() => setState("idle"), 1300);
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 1300);
    }
  };

  return { state, copy };
}

function toPlainText(ex: NonNullable<ExplanationViewerProps["explanation"]>) {
  const bullets = (arr?: string[]) => (arr?.length ? arr.map((x) => `- ${x}`).join("\n") : "- ");

  return [
    "Decision Summary",
    ex.summary ?? "",
    "",
    "Why This Score Was Assigned",
    ex.whyThisScore ?? "",
    "",
    "Positive Signals",
    bullets(ex.positiveSignals),
    "",
    "Negative Signals",
    bullets(ex.negativeSignals),
    "",
    "Missing Evidence",
    bullets(ex.missingEvidence),
    "",
    "Confidence",
    ex.confidence ?? "",
    ex.confidenceReasoning ? `\n${ex.confidenceReasoning}` : "",
    "",
    "Recommended Human Review Notes",
    ex.recommendedHumanReview ?? "",
  ].join("\n");
}

function AccordionSection({
  section,
  defaultOpen,
}: {
  section: ExplanationSection;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  const contentId = `${section.id}-content`;

  return (
    <div className="rounded-[1.75rem] border border-[#E7E7E9] bg-[#FFFFFF]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0D0C22]">{section.title}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]" aria-hidden="true">
          {open ? <ChevronUp size={18} className="text-[#2563EB]" /> : <ChevronDown size={18} className="text-[#2563EB]" />}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={contentId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4"
          >
            {section.body}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function ExplanationViewer({ explanation, className }: ExplanationViewerProps) {
  const fallback = React.useMemo(
    () => ({
      summary:
        "This resume received a strong score because the candidate demonstrates relevant product design experience, UX research background, and leadership impact.",
      whyThisScore:
        "The model weighed clear role alignment, strong evidence of outcomes, and consistent signal quality. It also detected a few areas that limit confidence, such as missing portfolio links and limited accessibility proof.",
      positiveSignals: [
        "Strong product strategy experience",
        "UX research experience",
        "Leadership indicators",
        "Metrics-driven achievements",
      ],
      negativeSignals: [
        "Missing portfolio link",
        "Limited accessibility evidence",
        "Weak quantified outcomes",
      ],
      missingEvidence: ["Portfolio URL", "Accessibility case study", "A/B testing metrics"],
      confidence: "High confidence",
      confidenceReasoning:
        "Confidence is high because multiple independent experience signals align with the role and the evidence is specific. The remaining uncertainty comes from gaps in accessibility and measurable impact documentation.",
      recommendedHumanReview:
        "Verify portfolio availability, review accessibility contributions, and assess whether quantified outcomes exist but are not captured in the resume text.",
    }),
    [],
  );

  const ex = (explanation ?? fallback) as NonNullable<ExplanationViewerProps["explanation"]>;
  const copy = useCopyToClipboard();
  const plain = React.useMemo(() => toPlainText(ex), [ex]);

  const confidenceText = ex.confidence ?? "Medium confidence";

  const sections: ExplanationSection[] = React.useMemo(() => {
    const pos = ex.positiveSignals ?? [];
    const neg = ex.negativeSignals ?? [];
    const miss = ex.missingEvidence ?? [];

    return [
      {
        id: "summary",
        title: "Decision Summary",
        body: <p className="text-sm leading-6 text-[#6E6D7A]">{ex.summary}</p>,
      },
      {
        id: "why",
        title: "Why This Score Was Assigned",
        body: <p className="text-sm leading-6 text-[#6E6D7A]">{ex.whyThisScore}</p>,
      },
      {
        id: "positive",
        title: "Positive Signals",
        body: (
          <ul className="space-y-2">
            {pos.length ? (
              pos.map((s, i) => (
                <li key={`${s}-${i}`} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "rgba(34,197,94,0.10)", border: `1px solid rgba(34,197,94,0.25)` }} aria-hidden="true">
                    <CheckCircle2 size={14} className="text-[#22C55E]" />
                  </span>
                  <span className="text-sm text-[#6E6D7A]">{s}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-[#6E6D7A]">No positive signals provided.</li>
            )}
          </ul>
        ),
      },
      {
        id: "negative",
        title: "Negative Signals",
        body: (
          <ul className="space-y-2">
            {neg.length ? (
              neg.map((s, i) => (
                <li key={`${s}-${i}`} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "rgba(239,68,68,0.10)", border: `1px solid rgba(239,68,68,0.25)` }} aria-hidden="true">
                    <AlertCircle size={14} className="text-[#EF4444]" />
                  </span>
                  <span className="text-sm text-[#6E6D7A]">{s}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-[#6E6D7A]">No negative signals provided.</li>
            )}
          </ul>
        ),
      },
      {
        id: "missing",
        title: "Missing Evidence",
        body: (
          <ul className="space-y-2">
            {miss.length ? (
              miss.map((s, i) => (
                <li key={`${s}-${i}`} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "rgba(245,158,11,0.10)", border: `1px solid rgba(245,158,11,0.25)` }} aria-hidden="true">
                    <Info size={14} className="text-[#F59E0B]" />
                  </span>
                  <span className="text-sm text-[#6E6D7A]">{s}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-[#6E6D7A]">No missing evidence provided.</li>
            )}
          </ul>
        ),
      },
      {
        id: "confidence",
        title: "Confidence Reasoning",
        body: (
          <div className="space-y-3">
            <p className="text-sm leading-6 text-[#6E6D7A]">{ex.confidenceReasoning}</p>
            <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-3">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]" aria-hidden="true">
                  {confidenceTone(confidenceText) === "success" ? (
                    <ShieldCheck size={18} className="text-[#22C55E]" />
                  ) : confidenceTone(confidenceText) === "warning" ? (
                    <Info size={18} className="text-[#F59E0B]" />
                  ) : (
                    <ShieldX size={18} className="text-[#EF4444]" />
                  )}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Confidence</p>
                  <p className="mt-1 text-sm font-semibold text-[#0D0C22]">{confidenceText}</p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "review",
        title: "Recommended Human Review Notes",
        body: <p className="text-sm leading-6 text-[#6E6D7A]">{ex.recommendedHumanReview}</p>,
      },
    ];
  }, [ex, confidenceText]);

  return (
    <div className={className}>
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Explainability</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">AI audit decision rationale</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
              Human-readable explanation designed for review teams: expandable sections, clear positive/negative signals, and copyable summaries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ConfidenceBadge confidenceText={confidenceText} />
            <button
              type="button"
              onClick={() => copy.copy(plain)}
              className="inline-flex items-center rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-sm font-semibold text-[#6E6D7A] hover:bg-[#FFFFFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              aria-label="Copy explanation to clipboard"
            >
              <Copy size={16} className="mr-2 text-[#2563EB]" aria-hidden="true" />
              {copy.state === "copied" ? "Copied" : copy.state === "error" ? "Copy failed" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {sections.map((s, i) => (
            <AccordionSection key={s.id} section={s} defaultOpen={i === 0} />
          ))}
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]" aria-hidden="true">
              <Sparkles size={18} className="text-[#2563EB]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">Human review notice</p>
              <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">
                Explanations reflect model reasoning on the resume text. For safety, validate job relevance and context before making decisions.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
