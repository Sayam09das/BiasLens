"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ShieldCheck,
  Scale,
  FileText,
  ClipboardCheck,
  Radar,
  BadgeCheck,
} from "lucide-react";

type ComplianceCard = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const cards: ComplianceCard[] = [
  {
    title: "Fairness Monitoring",
    description:
      "Track bias indicators, score gaps, and risk levels across resume screening workflows.",
    icon: <Scale className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Counterfactual Analysis",
    description:
      "Compare how small changes in resume signals may affect job-fit scores and recommendations.",
    icon: <Radar className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Audit Trail",
    description:
      "Maintain structured logs for uploads, scoring, reports, admin actions, and workflow events.",
    icon: <ClipboardCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Compliance Ready Reports",
    description:
      "Generate transparent reports with fairness notes, explanations, and decision evidence.",
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
  },
];

function FloatingBadge({
  tone,
  label,
  icon,
}: {
  tone: "blue" | "green" | "warning";
  label: string;
  icon: React.ReactNode;
}) {
  const cls =
    tone === "green"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "warning"
        ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold " +
        cls
      }
    >
      {icon}
      {label}
    </span>
  );
}

export default function FairnessComplianceSection() {
  return (
    <section className="bg-[#F6F8FB]" aria-label="Fairness & Compliance">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Fairness & Compliance
          </span>
        </div>

        {/* Headings */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Detect Bias Signals Before They Become Hiring Risk
          </h2>
          <p className="mx-auto mt-4 max-w-[72ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            BiasLens helps hiring teams monitor fairness signals, compare outcomes, review
            counterfactual results, and maintain audit-ready compliance records.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Content (left) */}
          <div className="lg:col-span-7 order-1">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              {cards.map((c, idx) => (
                <motion.article
                  key={c.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: idx * 0.03 }}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_16px_40px_rgba(13,12,34,0.04)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(13,12,34,0.08)]"
                  aria-label={c.title}
                >
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] text-[#2563EB]">
                        {c.icon}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">
                          {c.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-6 rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    Responsible AI workflow, audit-ready by design
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">
                    Capture evidence for scoring, fairness checks, and report generation—so teams
                    can explain decisions with confidence.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                    <BadgeCheck className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
                    Transparent evidence
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
                    Compliance logs
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image (right) */}
          <div className="lg:col-span-5 order-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_30px_90px_rgba(13,12,34,0.06)]"
            >
              <div className="rounded-[1.6rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">Fairness & Compliance Dashboard</p>
                    <p className="mt-1 text-xs leading-5 text-[#6E6D7A]">Monitor risk, compare outcomes, maintain audit records.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <FloatingBadge
                      tone="green"
                      label="Bias Risk: Low"
                      icon={<span className="inline-block h-2.5 w-2.5 rounded-full bg-[#22C55E]" aria-hidden="true" />}
                    />
                    <FloatingBadge
                      tone="blue"
                      label="Audit Trail: Active"
                      icon={<span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />}
                    />
                    <FloatingBadge
                      tone="warning"
                      label="Compliance Ready"
                      icon={<span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F59E0B]" aria-hidden="true" />}
                    />
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-[#E7E7E9] bg-[#FFFFFF]">
                  <div className="relative aspect-[16/11] w-full">
                    <Image
                      src="/images/FairnessCompliance.png"
                      alt="BiasLens fairness and compliance dashboard"
                      fill
                      sizes="(max-width: 1024px) 100vw, 46vw"
                      className="object-contain p-3"
                      priority
                    />
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
