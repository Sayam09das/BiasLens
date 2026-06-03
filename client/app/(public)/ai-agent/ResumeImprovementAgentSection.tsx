"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  WandSparkles,
  Target,
  FileSignature,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Check,
  ThumbsUp,
} from "lucide-react";

type ImprovementItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

function Badge({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: "primary" | "success" | "warning" }) {
  const cls =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "warning"
        ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl ${cls}`}>
      {icon}
      {label}
    </span>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
        {icon}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function ImprovementCard({ item, index }: { item: ImprovementItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)]"
      aria-label={item.title}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-4">
        <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10">
          {item.icon}
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{item.description}</p>
        </div>
      </div>

      <div className="relative mt-5 flex items-center gap-2 text-xs font-semibold text-[#6E6D7A]">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-[#2563EB]/10">
          <ArrowRight className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
        </span>
        <span>Actionable improvement</span>
      </div>
    </motion.article>
  );
}

export default function ResumeImprovementAgentSection() {
  const improvements: ImprovementItem[] = [
    {
      icon: <WandSparkles className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Rewrite Suggestions",
      description:
        "Generate resume rewrites that strengthen role alignment, clarify impact, and improve readability for hiring reviewers.",
    },
    {
      icon: <Target className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Skill Alignment Tips",
      description:
        "Recommend missing skills, map evidence to requirements, and suggest where to add concrete experience and keywords.",
    },
    {
      icon: <FileSignature className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Achievement Quantification",
      description:
        "Help candidates convert vague claims into measurable outcomes using evidence patterns and quantified language.",
    },
    {
      icon: <ThumbsUp className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Candidate Feedback",
      description:
        "Provide coaching notes that explain what to change, why it matters, and how it will improve job-fit and fairness outcomes.",
    },
  ];

  return (
    <section aria-label="Resume Improvement Agent" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Mobile: image first */}
          <div className="lg:col-span-6 order-1">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative"
            >
              <div aria-hidden="true" className="absolute -inset-x-10 -top-14 h-[420px] rounded-full bg-[#2563EB]/10 blur-3xl" />

              <div className="relative rounded-[2.2rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_40px_140px_rgba(13,12,34,0.12)] backdrop-blur-xl">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/50 via-transparent to-white/60" />

                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#E7E7E9] bg-[#F6F8FB]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.18)_0%,transparent_45%),radial-gradient(circle_at_85%_35%,rgba(37,99,235,0.10)_0%,transparent_55%)]"
                  />

                  <div className="relative aspect-[16/11] w-full">
                    <Image
                      src="/images/resume-improvement-agent.png"
                      alt="BiasLens resume improvement agent interface"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain p-4"
                    />

                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      <Badge
                        tone="primary"
                        label="Rewrite Draft"
                        icon={<Sparkles className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />}
                      />
                      <Badge
                        tone="success"
                        label="Evidence Updated"
                        icon={<ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />}
                      />
                      <Badge
                        tone="warning"
                        label="Skill Gaps Flagged"
                        icon={<AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />}
                      />
                    </div>

                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/75 to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:col-span-6 order-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                Resume Improvement Agent
              </span>

              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Upgrade Your Resume With Explainable, Targeted Feedback
              </h2>

              <p className="mt-4 max-w-[66ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
                BiasLens turns analysis into concrete next steps—rewrite suggestions, skill alignment guidance,
                quantifiable achievements, and candidate-ready coaching notes.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {improvements.map((it, idx) => (
                  <ImprovementCard key={it.title} item={it} index={idx} />
                ))}
              </div>

              <div className="mt-8 rounded-[1.8rem] border border-[#E7E7E9] bg-white/70 p-5 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl">
                <Bullet icon={<Check className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />}>
                  <div className="text-sm font-semibold text-[#0D0C22]">Candidate changes stay audit-friendly</div>
                  <div className="mt-1 text-sm leading-6 text-[#6E6D7A]">
                    Every suggestion ties back to evidence, role-fit logic, and fairness-aware signals so teams can
                    track what changed and why.
                  </div>
                </Bullet>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs font-medium text-[#6E6D7A]">
                    Built for improvement cycles that work with existing ATS workflows.
                  </div>
                  <a
                    href="/agent"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(37,99,235,0.28)] transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/35"
                  >
                    Try Improvement Agent
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

