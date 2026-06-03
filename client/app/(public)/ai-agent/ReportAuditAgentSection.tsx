"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FileText,
  FileSignature,
  SearchCheck,
  ShieldCheck,
  BadgeCheck,
  LogIn,
  ScrollText,
  ArrowRight,
  LayoutTemplate,
  Waves,
} from "lucide-react";

type Tone = "primary" | "success" | "warning";

function FloatingBadge({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: Tone }) {
  const cls =
    tone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : tone === "warning"
        ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

function Bullet({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-[#0D0C22]">{title}</div>
        <div className="mt-1 text-sm leading-6 text-[#6E6D7A]">{children}</div>
      </div>
    </div>
  );
}

type Capability = {
  icon: React.ReactNode;
  title: string;
  description: string;
  tagTone: Tone;
  tag: string;
  bottomLabel: string;
};

function CapabilityCard({ cap, index }: { cap: Capability; index: number }) {
  const tagCls =
    cap.tagTone === "success"
      ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
      : cap.tagTone === "warning"
        ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] as const }}
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
          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{cap.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{cap.description}</p>
          </div>
        </div>

        <div className="mt-5">
          <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-xl ${tagCls}`}>
            {cap.tag}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#6E6D7A]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
            <ArrowRight className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          </span>
          <span>{cap.bottomLabel}</span>
        </div>
      </div>
    </motion.article>
  );
}

function DashboardPreview() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 top-10">
      {/* Visual overlay content inside the image card (no text for SR). */}
      <div className="absolute left-6 top-6 w-[240px] rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 p-3 shadow-[0_18px_50px_rgba(13,12,34,0.04)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-[#22C55E]/10">
              <BadgeCheck className="h-4 w-4 text-[#22C55E]" />
            </span>
            <div className="text-[11px] font-semibold text-[#0D0C22]">Export Status</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#16A34A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            Ready
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#6E6D7A]">
              <FileText className="h-4 w-4 text-[#2563EB]" />
              PDF Report
            </div>
            <div className="text-[11px] font-semibold text-[#0D0C22]">Generated</div>
          </div>
          <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#E7E7E9]">
            <div className="h-full w-[78%] rounded-full bg-[#2563EB]/70" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#6E6D7A]">
              <ScrollText className="h-4 w-4 text-[#2563EB]" />
              Audit Timeline
            </div>
            <div className="text-[11px] font-semibold text-[#0D0C22]">Synced</div>
          </div>
          <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#E7E7E9]">
            <div className="h-full w-[62%] rounded-full bg-[#22C55E]/60" />
          </div>
        </div>
      </div>

      <div className="absolute right-6 top-6 w-[260px] rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 p-3 shadow-[0_18px_50px_rgba(13,12,34,0.04)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-[#2563EB]/10">
              <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
            </span>
            <div className="text-[11px] font-semibold text-[#0D0C22]">Agent Summary</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#2563EB]">
            <Waves className="h-3.5 w-3.5" />
            Live
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="rounded-[0.85rem] border border-[#E7E7E9] bg-[#F6F8FB] p-2">
            <div className="text-[11px] font-semibold text-[#0D0C22]">Decision Evidence</div>
            <div className="mt-1 text-[11px] leading-4 font-medium text-[#6E6D7A]">
              Fairness checks passed, logs explained, and compliance notes structured for review.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[0.85rem] border border-[#E7E7E9] bg-white/70 p-2">
              <div className="text-[10.5px] font-semibold text-[#6E6D7A]">Explainability</div>
              <div className="mt-1 text-[11px] font-semibold text-[#0D0C22]">High</div>
            </div>
            <div className="rounded-[0.85rem] border border-[#E7E7E9] bg-white/70 p-2">
              <div className="text-[10.5px] font-semibold text-[#6E6D7A]">Fairness</div>
              <div className="mt-1 text-[11px] font-semibold text-[#0D0C22]">Low Risk</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-6 bottom-6 right-6 rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 p-3 shadow-[0_18px_50px_rgba(13,12,34,0.04)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4 text-[#2563EB]" />
            <div className="text-[11px] font-semibold text-[#0D0C22]">Compliance-ready notes</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#6E6D7A]">
            <LogIn className="h-3.5 w-3.5" />
            Verified workflow
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="rounded-[0.85rem] border border-[#E7E7E9] bg-[#F6F8FB] p-2">
            <div className="text-[10.5px] font-semibold text-[#6E6D7A]">Admin Logs</div>
            <div className="mt-1 text-[11px] font-semibold text-[#0D0C22]">Explained</div>
          </div>
          <div className="rounded-[0.85rem] border border-[#E7E7E9] bg-[#F6F8FB] p-2">
            <div className="text-[10.5px] font-semibold text-[#6E6D7A]">Audit Trail</div>
            <div className="mt-1 text-[11px] font-semibold text-[#0D0C22]">Summarized</div>
          </div>
          <div className="rounded-[0.85rem] border border-[#E7E7E9] bg-[#F6F8FB] p-2">
            <div className="text-[10.5px] font-semibold text-[#6E6D7A]">Evidence</div>
            <div className="mt-1 text-[11px] font-semibold text-[#0D0C22]">Attached</div>
          </div>
        </div>
      </div>

      {/* decorative icon badges */}
      <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]">
        <SearchCheck className="h-56 w-56 text-[#2563EB]" />
      </div>
    </div>
  );
}

export default function ReportAuditAgentSection() {
  const capabilities: Capability[] = [
    {
      icon: <FileText className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "PDF Report Generation",
      description:
        "Create polished audit reports containing resume scores, job-fit analysis, fairness signals, explainability insights, and improvement suggestions.",
      tagTone: "primary",
      tag: "PDF Ready",
      bottomLabel: "Share with stakeholders",
    },
    {
      icon: <FileSignature className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Audit Trail Summary",
      description:
        "Summarize resume uploads, audit runs, scoring events, report exports, workflow updates, and review actions into clear audit records.",
      tagTone: "success",
      tag: "Audit Active",
      bottomLabel: "Trace every decision",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Admin Log Explanation",
      description:
        "Explain admin activity such as login events, protected API access, upload actions, queue jobs, validations, and report generation.",
      tagTone: "primary",
      tag: "Logs Explained",
      bottomLabel: "Make compliance legible",
    },
    {
      icon: <BadgeCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      title: "Compliance-Ready Notes",
      description:
        "Generate structured notes that help teams document transparency, fairness review outcomes, decision evidence, and responsible AI checks.",
      tagTone: "success",
      tag: "Notes Generated",
      bottomLabel: "Ready for review",
    },
  ];

  return (
    <section aria-label="Report & Audit Agent" className="bg-[#FFFFFF]">
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
                      src="/images/report-audit-agent.png"
                      alt="BiasLens report and audit agent dashboard"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain p-4"
                    />

                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      <FloatingBadge
                        tone="primary"
                        label="PDF Ready"
                        icon={<FileText className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />}
                      />
                      <FloatingBadge
                        tone="success"
                        label="Audit Trail Active"
                        icon={<ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />}
                      />
                      <FloatingBadge
                        tone="warning"
                        label="Compliance Notes Generated"
                        icon={<SearchCheck className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />}
                      />
                    </div>

                    <DashboardPreview />

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
                <FileText className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                Report & Audit Agent
              </span>

              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                Generate Reports, Explain Logs, and Summarize Audit Trails Automatically
              </h2>

              <p className="mt-4 max-w-[66ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
                The BiasLens Report & Audit Agent creates PDF reports, summarizes audit trails, explains admin logs, and generates compliance-ready notes for every resume audit workflow.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {capabilities.map((cap, idx) => (
                  <CapabilityCard key={cap.title} cap={cap} index={idx} />
                ))}
              </div>

              <div className="mt-8 rounded-[1.8rem] border border-[#E7E7E9] bg-white/70 p-5 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-[52ch]">
                    <div className="text-xs font-semibold text-[#6E6D7A]">Audit-friendly by design</div>
                    <div className="mt-2 flex flex-col gap-3">
                      <Bullet
                        icon={<ShieldCheck className="h-4 w-4 text-[#22C55E]" aria-hidden="true" />}
                        title="Evidence-first outputs"
                      >
                        Every report ties scores to explainability signals and includes fairness-aware notes so reviewers can verify decision evidence.
                      </Bullet>

                      <Bullet
                        icon={<ScrollText className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />}
                        title="Workflow traceability"
                      >
                        Uploads, scoring events, exports, and review actions are summarized into a single audit record that stays consistent across runs.
                      </Bullet>
                    </div>
                  </div>

                  <div className="sm:pt-1">
                    <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB]/10">
                          <Waves className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-[#0D0C22]">Compliance-ready packaging</div>
                          <div className="mt-0.5 text-xs font-medium text-[#6E6D7A]">Structured notes + explainable records</div>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-[#E7E7E9] bg-white/70 px-4 py-3">
                        <div>
                          <div className="text-[11px] font-semibold text-[#6E6D7A]">Next step</div>
                          <div className="text-sm font-semibold text-[#0D0C22]">Run a report workflow</div>
                        </div>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB] shadow-[0_20px_60px_rgba(37,99,235,0.28)]">
                          <ArrowRight className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
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

