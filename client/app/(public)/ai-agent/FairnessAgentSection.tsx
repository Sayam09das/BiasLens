"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ShieldCheck,
  Scale,
  Shuffle,
  FileText,
  Sparkles,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

type Capability = {
  icon: React.ReactNode;
  title: string;
  description: string;
  tagTone: "primary" | "success" | "warning";
  tag: string;
};

function Badge({ label, tone }: { label: string; tone: Capability["tagTone"] }) {
  const cls =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "warning"
        ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span className={"inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl " + cls}>
      {label}
    </span>
  );
}

function CapabilityCard({ cap, index }: { cap: Capability; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)]"
      aria-label={cap.title}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10">
            {cap.icon}
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{cap.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{cap.description}</p>
          </div>
        </div>

        <div className="mt-5">
          <Badge label={cap.tag} tone={cap.tagTone} />
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#6E6D7A]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
            <ArrowRight className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          </span>
          <span>Responsible AI output</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function FairnessAgentSection() {
  const capabilities: Capability[] = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Bias Signal Review",
      description:
        "Review possible bias patterns, score gaps, fairness risks, and sensitive decision signals across resume audit outcomes.",
      tagTone: "success",
      tag: "Bias Risk Low",
    },
    {
      icon: <Shuffle className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Counterfactual Testing",
      description:
        "Compare controlled resume variations to understand whether small changes affect job-fit scores or recommendations unfairly.",
      tagTone: "primary",
      tag: "Counterfactual Passed",
    },
    {
      icon: <Scale className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Fairness Metric Summary",
      description:
        "Summarize fairness score, parity gap, equalized odds difference, counterfactual consistency, and risk level.",
      tagTone: "success",
      tag: "Fairness Metrics",
    },
    {
      icon: <FileText className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Responsible AI Notes",
      description:
        "Generate audit-ready notes that explain fairness risks, mitigation signals, and responsible AI review outcomes.",
      tagTone: "primary",
      tag: "Responsible AI Active",
    },
  ];

  return (
    <section aria-label="Fairness Agent" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: content */}
          <div className="lg:col-span-6 order-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
                <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                Fairness Agent
              </span>

              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Review Bias Signals With Responsible AI Reasoning
              </h2>

              <p className="mt-4 max-w-[66ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
                The BiasLens Fairness Agent reviews bias signals, runs counterfactual checks, summarizes fairness metrics,
                and generates responsible AI notes for transparent hiring audits.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {capabilities.map((cap, idx) => (
                <CapabilityCard key={cap.title} cap={cap} index={idx} />
              ))}
            </div>
          </div>

          {/* Right: image */}
          <div className="lg:col-span-6 order-2">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
                      src="/images/fairness-agent.png"
                      alt="BiasLens fairness agent dashboard"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain p-4"
                    />

                    {/* Floating badges */}
                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      <Badge tone="success" label="Bias Risk Low" />
                      <Badge tone="primary" label="Counterfactual Passed" />
                      <Badge tone="primary" label="Responsible AI Active" />
                    </div>

                    <div
                      aria-hidden="true"
                      className="absolute right-4 top-16 inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#6E6D7A] backdrop-blur-xl"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />
                      Risk level indicator
                    </div>

                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/75 to-transparent" />
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

