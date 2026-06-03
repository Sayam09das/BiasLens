"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  FileSearch,
  SearchCheck,
  Target,
  ClipboardList,
  BadgeCheck,
  ShieldCheck,
  Shuffle,
} from "lucide-react";

type Capability = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function SectionBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
      <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
      {label}
    </span>
  );
}

function CapabilityCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative flex gap-4">
        <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{description}</p>
        </div>
      </div>
    </motion.article>
  );
}

function MetricPill({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "primary" | "success" | "muted";
}) {
  const toneClasses =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "muted"
        ? "border-[#E7E7E9] bg-[#FFFFFF] text-[#6E6D7A]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${toneClasses}`}
    >
      {icon}
      {label}
    </span>
  );
}

export default function ResumeIntelligenceSection() {
  const capabilities: Capability[] = [
    {
      icon: <FileSearch className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Resume Parsing",
      description:
        "Extract structured information from resumes including experience, education, projects, certifications, skills, and achievements.",
    },
    {
      icon: <SearchCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Skill Extraction",
      description:
        "Identify technical skills, soft skills, tools, frameworks, domain knowledge, and role-relevant keywords.",
    },
    {
      icon: <Target className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Role Matching",
      description:
        "Compare candidate profiles against job descriptions to measure alignment, gaps, and strongest fit areas.",
    },
    {
      icon: <ClipboardList className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Score Breakdown",
      description:
        "Show how resume score, job fit, skill match, and missing evidence contribute to the final recommendation.",
    },
  ];

  return (
    <section aria-label="Resume Intelligence" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
              className="flex items-center gap-3"
            >
              <SectionBadge label="Resume Intelligence" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] as const }}
              className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl"
            >
              Transform Raw Resumes Into Structured Hiring Signals
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] as const }}
              className="mt-4 max-w-[66ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8"
            >
              BiasLens parses resumes, extracts skills, matches candidates to roles, and breaks down scores into
              clear, explainable hiring intelligence.
            </motion.p>

            <div className="mt-8 grid grid-cols-1 gap-4">
              {capabilities.map((c) => (
                <CapabilityCard key={c.title} icon={c.icon} title={c.title} description={c.description} />
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative"
            >
              <div aria-hidden="true" className="absolute -inset-x-10 -top-14 h-[420px] rounded-full bg-[#2563EB]/10 blur-3xl" />

              <div className="relative rounded-[2.2rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_40px_140px_rgba(13,12,34,0.12)] backdrop-blur-xl">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/50 via-transparent to-white/60"
                />

                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#E7E7E9] bg-[#F6F8FB]">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 border-b border-[#E7E7E9] bg-white/70 px-4 py-3">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#F59E0B]" aria-hidden="true" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    <span className="ml-3 text-xs font-medium text-[#6E6D7A]">BiasLens AI Intelligence</span>
                  </div>

                  <div className="relative aspect-[16/12] w-full">
                    <Image
                      src="/images/ResumeIntelligence.png"
                      alt="BiasLens resume intelligence dashboard"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain p-4"
                    />

                    {/* Floating badges */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                      className="absolute left-4 top-4"
                    >
                      <MetricPill
                        icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />}
                        label="Skills Match 87%"
                        tone="primary"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
                      className="absolute right-4 top-20"
                    >
                      <MetricPill
                        icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                        label="Resume Score 92%"
                        tone="success"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                      className="absolute left-6 bottom-6"
                    >
                      <MetricPill
                        icon={<Shuffle className="h-4 w-4" aria-hidden="true" />}
                        label="Missing Skills 3"
                        tone="muted"
                      />
                    </motion.div>

                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/75 to-transparent" />
                  </div>

                  <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#2563EB]/10 blur-2xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
