"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FileSpreadsheet,
  History,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  Database,
  ArrowUpRight,
} from "lucide-react";

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
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-white p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent"
      />

      <div className="relative flex gap-4">
        <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10">
          <span className="text-[#2563EB]">{capability.icon}</span>
        </div>

        <div>
          <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{capability.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{capability.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#0D0C22]">
        <span className="inline-flex items-center justify-center rounded-full bg-[#2563EB]/10 p-2">
          <ArrowUpRight className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
        </span>
        <span className="sr-only">Capability details</span>
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
  const classes =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "muted"
        ? "border-[#E7E7E9] bg-[#FFFFFF] text-[#6E6D7A]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${classes} backdrop-blur-sm`}>
      {icon}
      {label}
    </span>
  );
}

export default function AuditReportingSection() {
  const capabilities: Capability[] = [
    {
      icon: <FileText className="h-5 w-5" aria-hidden="true" />,
      title: "PDF Reports",
      description:
        "Export polished reports containing resume scores, job-fit analysis, explainability insights, fairness notes, and improvement suggestions.",
    },
    {
      icon: <History className="h-5 w-5" aria-hidden="true" />,
      title: "Audit History",
      description:
        "Track previous resume audits, report generations, workflow events, timestamps, and review outcomes in one place.",
    },
    {
      icon: <Database className="h-5 w-5" aria-hidden="true" />,
      title: "Admin Logs",
      description:
        "Record uploads, scoring actions, report exports, user events, protected API access, and administrative activity.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
      title: "Compliance-Ready Records",
      description:
        "Maintain transparent decision records that help teams support responsible AI reviews and internal compliance processes.",
    },
  ];

  return (
    <section aria-label="Audit & Reporting" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left content */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <SectionBadge icon={<FileSpreadsheet className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />} label="Audit & Reporting" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl"
            >
              Generate Audit-Ready Reports for Every Resume Decision
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-[64ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8"
            >
              BiasLens creates structured reporting workflows with PDF exports, audit history, admin logs, and compliance-ready records so hiring teams can review, explain, and document every decision.
            </motion.p>

            <div className="mt-8 grid grid-cols-1 gap-4">
              {capabilities.map((c, idx) => (
                <CapabilityCard key={c.title} capability={c} index={idx} />
              ))}
            </div>
          </div>

          {/* Right image */}
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
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/50 via-transparent to-white/60" />

                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#E7E7E9] bg-[#F6F8FB]">
                  <div className="flex items-center gap-2 border-b border-[#E7E7E9] bg-white/70 px-4 py-3">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#E7E7E9]" aria-hidden="true" />
                    <span className="ml-3 text-xs font-medium text-[#6E6D7A]">Audit & Reporting</span>
                  </div>

                  <div className="relative aspect-[16/12] w-full">
                    <Image
                      src="/images/audit-reporting.png"
                      alt="BiasLens audit and reporting dashboard"
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
                        tone="primary"
                        icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                        label="PDF Ready"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-4 top-20"
                    >
                      <MetricPill
                        tone="success"
                        icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                        label="Audit Trail Active"
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
                        tone="muted"
                        icon={<Clock className="h-4 w-4" aria-hidden="true" />}
                        label="128 Events Logged"
                      />
                    </motion.div>

                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/75 via-transparent to-transparent" />
                  </div>
                </div>

                <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#2563EB]/10 blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

