"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  BadgeCheck,
  FileText,
  ShieldCheck,
  SearchCheck,
  ArrowRight,
  Timer,
  KeyRound,
  Bot,
} from "lucide-react";

type Tone = "primary" | "success" | "warning";

function FloatingBadge({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: Tone }) {
  const cls =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "warning"
        ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

function StepCard({
  index,
  title,
  description,
  icon,
  active,
}: {
  index: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-[1.6rem] border ${active ? "border-[#2563EB]/30" : "border-[#E7E7E9]"} bg-[#FFFFFF] p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)]`}
      aria-label={title}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/25 to-transparent" />

      <div className="relative flex gap-4">
        <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{title}</h3>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] text-xs font-semibold text-[#6E6D7A]">
              {index + 1}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{description}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function AgentWorkflowSection() {
  const steps = [
    {
      title: "Upload Resume",
      description:
        "Upload a resume and job description into the secure BiasLens audit workflow.",
      icon: <Upload className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      accent: "primary" as Tone,
    },
    {
      title: "Agent Analyzes Role Fit",
      description:
        "The AI Agent evaluates skills, experience, role alignment, missing evidence, and job-fit score.",
      icon: <SearchCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      accent: "primary" as Tone,
    },
    {
      title: "Agent Explains Decision",
      description:
        "The agent explains score contributors, hiring signals, missing proof points, and confidence reasoning.",
      icon: <Sparkles className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      accent: "success" as Tone,
    },
    {
      title: "Agent Checks Fairness",
      description:
        "The agent reviews bias signals, counterfactual results, fairness metrics, and responsible AI notes.",
      icon: <ShieldCheck className="h-5 w-5 text-[#22C55E]" aria-hidden="true" />,
      accent: "success" as Tone,
    },
    {
      title: "Agent Generates Report",
      description:
        "The agent creates an audit-ready report with scores, explanations, fairness notes, recommendations, and decision records.",
      icon: <FileText className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      accent: "primary" as Tone,
    },
  ];

  return (
    <section aria-label="Agent Workflow" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Top header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
            <Bot className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Agent Workflow
          </div>

          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            From Resume Upload to Audit-Ready Report in One Intelligent Flow
          </h2>

          <p className="mt-4 text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
            The BiasLens AI Agent guides every audit from secure upload to role-fit analysis, decision explanation, fairness review, and final report generation.
          </p>
        </div>

        {/* Middle: workflow timeline */}
        <div className="relative mt-12">
          <div className="absolute left-1/2 top-3 hidden h-[calc(100%-24px)] w-[2px] -translate-x-1/2 rounded-full bg-[#E7E7E9] lg:block" aria-hidden="true" />

          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:gap-4">
            {steps.map((s, idx) => (
              <div key={s.title} className="relative lg:col-span-1">
                <div
                  aria-hidden="true"
                  className="absolute -right-3 top-8 hidden h-2 w-8 rounded-full bg-[#E7E7E9] lg:block"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-3 top-[34px] hidden h-2 w-8 rounded-full bg-[#E7E7E9]/80 lg:block"
                />

                <div className="lg:flex lg:flex-col">
                  <div className="lg:hidden">
                    <StepCard index={idx} title={s.title} description={s.description} icon={s.icon} active={idx === 0} />
                  </div>

                  <div className="hidden lg:block">
                    <StepCard index={idx} title={s.title} description={s.description} icon={s.icon} active={idx === 1} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: vertical timeline line */}
          <div aria-hidden="true" className="mt-8 lg:hidden">
            <div className="mx-auto h-2 w-[72%] rounded-full bg-[#E7E7E9]" />
          </div>
        </div>

        {/* Bottom/right image preview */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <div className="rounded-[2.2rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_40px_140px_rgba(13,12,34,0.12)] backdrop-blur-xl">
              <div aria-hidden="true" className="pointer-events-none absolute" />

              <div className="rounded-[1.9rem] border border-[#E7E7E9] bg-[#F6F8FB] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
                      <Timer className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                      Agent progress
                    </div>
                    <div className="mt-4 text-sm font-semibold text-[#0D0C22]">Secure, explainable, and audit-ready</div>
                    <div className="mt-2 text-sm leading-6 text-[#6E6D7A]">
                      Each workflow step updates logs and evidence, so the final report includes traceable decision context.
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <FloatingBadge
                      tone="primary"
                      label="Resume Uploaded"
                      icon={<Upload className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />}
                    />
                    <FloatingBadge
                      tone="success"
                      label="Fairness Checked"
                      icon={<ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />}
                    />
                    <FloatingBadge
                      tone="primary"
                      label="Report Ready"
                      icon={<BadgeCheck className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#0D0C22]">
                      <KeyRound className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                      Protected workflow
                    </div>
                    <div className="mt-2 text-sm leading-6 text-[#6E6D7A]">Uploads and audit actions are validated and logged for compliance.</div>
                  </div>
                  <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#0D0C22]">
                      <ArrowRight className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                      Explainable output
                    </div>
                    <div className="mt-2 text-sm leading-6 text-[#6E6D7A]">Scores include evidence signals, confidence reasoning, and audit notes.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div aria-hidden="true" className="absolute -inset-x-10 -top-10 h-[360px] rounded-full bg-[#2563EB]/10 blur-3xl" />

              <div className="relative rounded-[2.2rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_40px_140px_rgba(13,12,34,0.12)] backdrop-blur-xl">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/50 via-transparent to-white/60" />

                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#E7E7E9] bg-[#F6F8FB]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.18)_0%,transparent_45%),radial-gradient(circle_at_85%_35%,rgba(37,99,235,0.10)_0%,transparent_55%)]"
                  />

                  <div className="relative aspect-[16/11] w-full">
                    <Image
                      src="/images/agent-workflow.png"
                      alt="BiasLens AI agent workflow"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-contain p-4"
                    />

                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      <FloatingBadge
                        tone="primary"
                        label="Resume Uploaded"
                        icon={<Upload className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />}
                      />
                      <FloatingBadge
                        tone="success"
                        label="Fairness Checked"
                        icon={<ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />}
                      />
                      <FloatingBadge
                        tone="primary"
                        label="Report Ready"
                        icon={<FileText className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />}
                      />
                    </div>

                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/75 to-transparent" />

                    {/* Decorative progress timeline */}
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-10 mx-auto flex w-[92%] items-center justify-between">
                      {steps.map((_, idx) => (
                        <span
                          key={idx}
                          className={
                            idx === steps.length - 1
                              ? "inline-flex h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_0_4px_rgba(34,197,94,0.18)]"
                              : "inline-flex h-2 w-2 rounded-full bg-[#E7E7E9]"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

