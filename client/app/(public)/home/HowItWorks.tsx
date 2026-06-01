"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Upload,
  Sparkles,
  FileText,
  Scale,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

type Step = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  {
    title: "Upload Resume",
    description:
      "Recruiters securely upload resumes and job descriptions into the BiasLens audit workflow.",
    icon: <Upload className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Run AI Evaluation",
    description:
      "The ML service analyzes candidate fit, role alignment, skills match, and scoring signals.",
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Check Fairness Signals",
    description:
      "BiasLens surfaces fairness risks, counterfactual differences, and explainability insights.",
    icon: <Scale className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Generate Audit Report",
    description:
      "Teams receive a structured report with scores, reasoning, risks, and improvement suggestions.",
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#0D0C22] shadow-sm">
      <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function HowItWorks() {
  return (
    <section className="bg-[#FFFFFF]" aria-label="How It Works">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            How It Works
          </span>
        </div>

        {/* Headings */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            From Resume Upload to Explainable Audit Report
          </h2>
          <p className="mx-auto mt-4 max-w-[70ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            BiasLens turns resume screening into a clear, structured workflow that combines secure backend
            processing with ML-powered scoring, fairness analysis, explainability, and actionable
            recommendations.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Steps */}
          <div className="lg:col-span-5">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="group rounded-[1.6rem] border border-[#E7E7E9] bg-[#F6F8FB] p-5 transition-shadow duration-300 hover:shadow-[0_18px_60px_rgba(13,12,34,0.06)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF]">
                        <span className="text-[#2563EB]">{step.icon}</span>
                      </div>
                      <span className="absolute -bottom-2 left-2 inline-flex h-5 items-center justify-center rounded-full bg-[#2563EB] px-2 text-[10px] font-bold text-white">
                        Step {index + 1}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{step.description}</p>

                      <div className="mt-4 flex items-center gap-2 text-sm text-[#2563EB] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB]/10">
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="font-semibold">Continue the workflow</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image card */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_30px_90px_rgba(13,12,34,0.06)]"
            >
              <div className="rounded-[1.6rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">BiasLens Workflow Preview</p>
                    <p className="mt-1 text-xs leading-5 text-[#6E6D7A]">Resume audit flow from intake to report.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Secure Upload</Badge>
                    <Badge>Explainable AI</Badge>
                    <Badge>Audit Ready</Badge>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-[#E7E7E9] bg-[#FFFFFF]">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src="/images/TransparentHiringWorkflow.png"
                      alt="BiasLens resume audit workflow"
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-contain"
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
