"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Plug,
  Database,
  Link2,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Workflow,
} from "lucide-react";

type IntegrationLogo = {
  name: string;
  sub: string;
};

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
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] p-5 shadow-[0_18px_50px_rgba(13,12,34,0.04)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
        <span className="sr-only">Integration capability</span>
      </div>
    </motion.article>
  );
}

function MetricPill({
  tone,
  icon,
  label,
}: {
  tone: "primary" | "success";
  icon: React.ReactNode;
  label: string;
}) {
  const classes =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${classes} backdrop-blur-sm`}>
      {icon}
      {label}
    </span>
  );
}

function LogoCard({ name, sub }: IntegrationLogo) {
  return (
    <div className="flex flex-col gap-1 rounded-[1.4rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_12px_30px_rgba(13,12,34,0.04)] backdrop-blur-xl transition hover:border-[#2563EB]/40">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2563EB]/10">
          <span className="text-[#2563EB]" aria-hidden="true">
            <Plug className="h-5 w-5" />
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#6E6D7A]">Connected</span>
      </div>
      <div className="text-sm font-semibold tracking-[-0.01em] text-[#0D0C22]">{name}</div>
      <div className="text-xs font-medium text-[#6E6D7A]">{sub}</div>
    </div>
  );
}

export default function IntegrationsPreviewSection() {
  const capabilities: Capability[] = [
    {
      icon: <Link2 className="h-5 w-5" aria-hidden="true" />,
      title: "ATS Systems",
      description:
        "Connect BiasLens with applicant tracking workflows to audit resume screening outcomes and improve decision visibility.",
    },
    {
      icon: <Workflow className="h-5 w-5" aria-hidden="true" />,
      title: "HR Tools",
      description:
        "Support HR teams with explainable scoring, fairness monitoring, role comparison, and candidate improvement insights.",
    },
    {
      icon: <Database className="h-5 w-5" aria-hidden="true" />,
      title: "API-First Workflows",
      description:
        "Use protected APIs to trigger audits, upload resumes, retrieve reports, and integrate resume intelligence into internal systems.",
    },
    {
      icon: <FileText className="h-5 w-5" aria-hidden="true" />,
      title: "Exportable Reports",
      description:
        "Generate PDF reports and structured audit records that can be shared with recruiters, admins, and compliance teams.",
    },
  ];

  const logos: IntegrationLogo[] = [
    { name: "Greenhouse", sub: "ATS integration" },
    { name: "Lever", sub: "Hiring workflow" },
    { name: "Workday", sub: "People analytics" },
    { name: "LinkedIn", sub: "Candidate sources" },
    { name: "BambooHR", sub: "HR management" },
    { name: "Custom API", sub: "Webhook-ready" },
  ];

  return (
    <section aria-label="Integrations Preview" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left content */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
              className="flex items-center gap-3"
            >
              <SectionBadge
                icon={<Plug className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />}
                label="Integrations Preview"
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.04, ease: [0.22, 1, 0.36, 1] as const }}
              className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl"
            >
              Connect BiasLens With Your Hiring Workflow
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
              className="mt-4 max-w-[66ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8"
            >
              BiasLens is designed for API-first hiring systems, ATS platforms, HR tools, and exportable audit reports so teams can plug explainable resume intelligence into existing workflows.
            </motion.p>

            <div className="mt-8 grid grid-cols-1 gap-4">
              {capabilities.map((c, idx) => (
                <CapabilityCard key={c.title} capability={c} index={idx} />
              ))}
            </div>

            <div className="mt-8">
              <div className="text-sm font-semibold text-[#0D0C22]">Popular integrations</div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {logos.map((l) => (
                  <LogoCard key={l.name} {...l} />
                ))}
              </div>
            </div>
          </div>

          {/* Right image */}
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
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/50 via-transparent to-white/60" />

                <div className="relative overflow-hidden rounded-[1.9rem] border border-[#E7E7E9] bg-[#F6F8FB]">
                  <div className="flex items-center gap-2 border-b border-[#E7E7E9] bg-white/70 px-4 py-3">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#E7E7E9]" aria-hidden="true" />
                    <span className="ml-3 text-xs font-medium text-[#6E6D7A]">Integrations Hub</span>
                  </div>

                  <div className="relative aspect-[16/12] w-full">
                    <Image
                      src="/images/integrations-preview.png"
                      alt="BiasLens integrations workflow dashboard"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain p-4"
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                      className="absolute left-4 top-4"
                    >
                      <MetricPill tone="success" icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />} label="API Ready" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
                      className="absolute right-4 top-16"
                    >
                      <MetricPill tone="primary" icon={<Plug className="h-4 w-4" aria-hidden="true" />} label="ATS Compatible" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                      className="absolute left-6 bottom-6"
                    >
                      <MetricPill tone="success" icon={<FileText className="h-4 w-4" aria-hidden="true" />} label="Reports Exported" />
                    </motion.div>

                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/75 via-transparent to-transparent" />
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

