"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  FileQuestion,
  SearchCheck,
  AlertTriangle,
  Scale,
  ArrowRight,
  Zap,
} from "lucide-react";

type Capability = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function Badge({
  icon,
  label,
  tone,
}: {
  icon?: React.ReactNode;
  label: string;
  tone: "primary" | "success" | "muted";
}) {
  const cls =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "primary"
        ? "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]"
        : "border-[#E7E7E9] bg-white/70 text-[#0D0C22]";

  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl " +
        cls
      }
    >
      {icon ? icon : null}
      {label}
    </span>
  );
}

function CapabilityCard({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)]"
      aria-label={capability.title}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10">
            {capability.icon}
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{capability.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{capability.description}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
            <ArrowRight className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold text-[#6E6D7A]">Decision clarity</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function AIDecisionAssistant() {
  const capabilities: Capability[] = [
    {
      icon: <FileQuestion className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Score Explanation",
      description:
        "Break down resume scores into job fit, skill match, experience relevance, education alignment, and achievement strength.",
    },
    {
      icon: <SearchCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Hiring Signal Analysis",
      description:
        "Identify positive and negative hiring signals that influenced the recommendation, ranking, or audit result.",
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Missing Evidence Detection",
      description:
        "Detect missing proof points such as measurable outcomes, portfolio links, certifications, domain experience, or leadership examples.",
    },
    {
      icon: <Scale className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Confidence Reasoning",
      description:
        "Show confidence indicators that explain how reliable, complete, and actionable the audit result is.",
    },
  ];

  return (
    <section aria-label="AI Decision Assistant" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: image first on mobile */}
          <div className="lg:col-span-6 order-1 lg:order-2">
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
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.18)_0%,transparent_45%),radial-gradient(circle_at_80%_35%,rgba(37,99,235,0.10)_0%,transparent_55%)]"
                  />

                  <div className="relative aspect-[16/11] w-full">
                    <Image
                      src="/images/decision-assistant.png"
                      alt="BiasLens AI decision assistant dashboard"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain p-4"
                    />

                    {/* Floating badges */}
                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      <Badge tone="primary" label="Score Explained" icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />} />
                    </div>

                    <div className="absolute right-4 top-16">
                      <Badge tone="success" label="Confidence 91%" icon={<ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />} />
                    </div>

                    <div className="absolute left-6 bottom-8">
                      <Badge tone="muted" label="Evidence Found" icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />} />
                    </div>

                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/75 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <FloatingCard
                icon={<Wand className="h-5 w-5" />}
              />
            </motion.div>
          </div>

          {/* Right: content */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
                <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                AI Decision Assistant
              </span>

              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Explain Every Score With Clear Hiring Reasoning
              </h2>

              <p className="mt-4 max-w-[66ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
                BiasLens helps hiring teams understand why a resume received a score by analyzing hiring signals, missing
                evidence, score contributors, and confidence levels.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {capabilities.map((cap, idx) => (
                <CapabilityCard key={cap.title} capability={cap} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Wand({ className }: { className?: string }) {
  return <Sparkles className={className} aria-hidden="true" />;
}

function FloatingCard({ icon }: { icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
      className="absolute"
    >
      <div className="hidden" aria-hidden="true">{icon}</div>
    </motion.div>
  );
}

