"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BarChart3, FileText, Radar, SearchCheck, Sparkles } from "lucide-react";

type Insight = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const insights: Insight[] = [
  {
    title: "Decision Breakdown",
    description:
      "Show which skills, experience, and resume signals influenced the score.",
    icon: <SearchCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "SHAP-Style Insights",
    description:
      "Visualize positive and negative contribution signals behind model predictions.",
    icon: <BarChart3 className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Missing Evidence Detection",
    description:
      "Identify weak or missing proof points in the resume.",
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Confidence Signals",
    description:
      "Show how reliable and explainable each audit result is.",
    icon: <Radar className="h-5 w-5" aria-hidden="true" />,
  },
];

function Badge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22] shadow-sm">
      {icon}
      {label}
    </span>
  );
}

export default function ExplainabilitySection() {
  return (
    <section className="bg-[#FFFFFF]" aria-label="Explainability">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Explainability
          </span>
        </div>

        {/* Headings */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Know Why Every Resume Gets Its Score
          </h2>
          <p className="mx-auto mt-4 max-w-[72ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            BiasLens explains the signals behind each recommendation, helping teams understand role fit, skill alignment, missing evidence, and decision confidence before acting.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Image (mobile first) */}
          <div className="lg:col-span-5 order-1 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_30px_90px_rgba(13,12,34,0.06)]"
            >
              <div className="rounded-[1.6rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-[#FFFFFF] overflow-hidden">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src="/images/Explainability.png"
                      alt="BiasLens explainability insights dashboard"
                      fill
                      sizes="(max-width: 1024px) 100vw, 46vw"
                      className="object-contain p-3"
                      priority
                    />
                  </div>
                </div>

                {/* Floating badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    icon={<span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />}
                    label="Top Signal: Experience"
                  />
                  <Badge
                    icon={<span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" aria-hidden="true" />}
                    label="Confidence: 91%"
                  />
                  <Badge
                    icon={<span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]/80" aria-hidden="true" />}
                    label="Explainability: High"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 order-2 lg:order-2">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
              {insights.map((insight, idx) => (
                <motion.article
                  key={insight.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.03 }}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_16px_40px_rgba(13,12,34,0.04)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(13,12,34,0.08)]"
                  aria-label={insight.title}
                >
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
                        <span className="text-[#2563EB]">{insight.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{insight.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-6 rounded-[2rem] border border-[#E7E7E9] bg-[#F6F8FB] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold text-[#0D0C22]">Audit-ready explanations</p>
                  <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">
                    Every signal is traceable to the underlying resume evidence, so teams can review decisions, monitor outcomes, and improve candidate experiences.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                    <span className="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    Interpretable signals
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22]">
                    <span className="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                    Actionable next steps
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

