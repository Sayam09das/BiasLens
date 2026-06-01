"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Scale, Shuffle, BarChart3, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

type Capability = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function SectionBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
      {icon}
      {label}
    </span>
  );
}

function CapabilityCard({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex gap-4">
        <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10">
          <span className="text-[#2563EB]">{icon}</span>
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
  tone: "success" | "primary" | "warning";
}) {
  const toneClasses =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "warning"
        ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${toneClasses} backdrop-blur-sm`}>
      {icon}
      {label}
    </span>
  );
}

export default function FairnessMonitoringSection() {
  const capabilities: Capability[] = [
    {
      icon: <AlertTriangle className="h-5 w-5" aria-hidden="true" />,
      title: "Bias Risk Detection",
      description:
        "Identify possible bias patterns, score gaps, and risk indicators across resume screening outcomes.",
    },
    {
      icon: <Shuffle className="h-5 w-5" aria-hidden="true" />,
      title: "Counterfactual Comparison",
      description:
        "Compare how controlled resume changes may affect job-fit scores, recommendations, and fairness signals.",
    },
    {
      icon: <BarChart3 className="h-5 w-5" aria-hidden="true" />,
      title: "Fairness Metrics",
      description:
        "Track metrics such as parity gap, equalized odds difference, fairness score, and risk level.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
      title: "Responsible AI Signals",
      description:
        "Surface audit-ready indicators that help teams review transparency, accountability, and decision quality.",
    },
  ];

  return (
    <section aria-label="Fairness Monitoring" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Content */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <SectionBadge
                icon={<Scale className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />}
                label="Fairness Monitoring"
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl"
            >
              Monitor Bias Risk Before It Impacts Hiring Decisions
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-[64ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8"
            >
              BiasLens helps teams detect fairness risks, compare counterfactual outcomes, track fairness metrics, and
              surface responsible AI signals across resume audit workflows.
            </motion.p>

            <div className="mt-8 grid grid-cols-1 gap-4">
              {capabilities.map((c, idx) => (
                <CapabilityCard
                  key={c.title}
                  icon={c.icon}
                  title={c.title}
                  description={c.description}
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* Image preview */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div aria-hidden="true" className="absolute -inset-x-10 -top-14 h-[420px] rounded-full bg-[#2563EB]/10 blur-3xl" />

              <div className="relative rounded-[2.2rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_40px_140px_rgba(13,12,34,0.12)] backdrop-blur-xl">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/50 via-transparent to-white/60"
                />

                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#E7E7E9] bg-[#F6F8FB]">
                  <div className="flex items-center gap-2 border-b border-[#E7E7E9] bg-white/70 px-4 py-3">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#F59E0B]" aria-hidden="true" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    <span className="ml-3 text-xs font-medium text-[#6E6D7A]">Fairness Monitoring</span>
                  </div>

                  <div className="relative aspect-[16/12] w-full">
                    <Image
                      src="/images/fairness-monitoring.png"
                      alt="BiasLens fairness monitoring dashboard"
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
                      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-4 top-4"
                    >
                      <MetricPill
                        tone="success"
                        icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                        label="Bias Risk Low"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-4 top-16"
                    >
                      <MetricPill
                        tone="primary"
                        icon={<BarChart3 className="h-4 w-4" aria-hidden="true" />}
                        label="Fairness Score 94%"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-6 bottom-6"
                    >
                      <MetricPill
                        tone="warning"
                        icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                        label="Counterfactual Passed"
                      />
                    </motion.div>

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
