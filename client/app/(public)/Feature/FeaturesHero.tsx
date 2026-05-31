"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Scale,
  WandSparkles,
  FileCheck2,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";

function StripeBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* light linear-ish sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EEF4FF]/70 via-white/70 to-white" />

      {/* subtle stripes */}
      <div
        className="absolute inset-0 opacity-[0.30] [background-image:linear-gradient(90deg,rgba(37,99,235,0.15)_1px,transparent_1px),linear-gradient(rgba(37,99,235,0.08)_1px,transparent_1px)] [background-size:32px_32px,32px_32px]"
        style={{ maskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)" }}
      />

      {/* glass glow blobs */}
      <div className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#2563EB]/15 blur-3xl" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#2563EB]/10 blur-3xl" />
      <div className="absolute -right-24 top-56 h-72 w-72 rounded-full bg-[#2563EB]/10 blur-3xl" />

      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <div className="text-xl font-semibold tracking-[-0.03em] text-[#0D0C22] sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium leading-5 text-[#6E6D7A] sm:text-sm">
        {label}
      </div>
    </div>
  );
}

function FloatingCard({
  icon,
  title,
  delay,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={
        "absolute rounded-[1.4rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_20px_70px_rgba(13,12,34,0.10)] backdrop-blur-xl " +
        (className ?? "")
      }
    >
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2563EB]/10">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22]">{title}</div>
          <div className="mt-1 text-xs font-medium text-[#6E6D7A]">Premium intelligence</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesHero() {
  return (
    <section
      aria-label="BiasLens Platform Features hero"
      className="relative overflow-hidden border-b border-[#E7E7E9] bg-[#FFFFFF]"
    >
      <StripeBackground />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl"
            >
              <LayoutGrid className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              Platform Features
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-balance font-semibold tracking-[-0.045em] text-[#0D0C22] text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] leading-[1.04]"
            >
              Everything You Need For Explainable and Fair Resume Screening
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-[60ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8"
            >
              BiasLens combines AI-powered resume analysis, transparent scoring, fairness monitoring,
              counterfactual testing, audit-ready reporting, and enterprise-grade security into a single
              hiring intelligence platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(37,99,235,0.28)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/35"
              >
                Start Free Audit
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#0D0C22] backdrop-blur-xl transition hover:border-[#2563EB]/40 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/25"
              >
                View Platform Demo
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4"
            >
              <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-white/60 px-4 py-4 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl">
                <Stat value="50K+" label="Resumes Audited" />
              </div>
              <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-white/60 px-4 py-4 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl">
                <Stat value="92%" label="Scoring Accuracy" />
              </div>
              <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-white/60 px-4 py-4 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl">
                <Stat value="94%" label="Fairness Confidence" />
              </div>
              <div className="rounded-[1.4rem] border border-[#E7E7E9] bg-white/60 px-4 py-4 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl">
                <Stat value="<10s" label="Average Analysis Time" />
              </div>
            </motion.div>
          </div>

          {/* Right */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-x-10 -top-14 h-[420px] rounded-full bg-[#2563EB]/10 blur-3xl" aria-hidden="true" />

              <div className="relative rounded-[2.2rem] border border-[#E7E7E9] bg-white/70 p-4 shadow-[0_40px_140px_rgba(13,12,34,0.12)] backdrop-blur-xl">
                {/* Glass frame */}
                <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-white/50 via-transparent to-white/60" aria-hidden="true" />

                <div className="relative overflow-hidden rounded-[1.8rem] border border-[#E7E7E9] bg-[#F6F8FB]">
                  {/* subtle highlight */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.22)_0%,transparent_40%),radial-gradient(circle_at_85%_35%,rgba(37,99,235,0.12)_0%,transparent_50%)]"
                  />

                  <div className="relative aspect-[16/11] w-full">
                    <Image
                      src="/images/features-hero-dashboard.png"
                      alt="BiasLens feature overview dashboard"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Dashboard preview overlay */}
                  <div className="absolute left-4 right-4 top-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-[#6E6D7A]">Resume Score</div>
                          <div className="text-sm font-semibold text-[#0D0C22]">92%</div>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E7E7E9]">
                          <div className="h-full w-[92%] rounded-full bg-[#2563EB]" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-[#6E6D7A]">Fairness Risk</div>
                          <div className="text-sm font-semibold text-[#0D0C22]">Low</div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-[#6E6D7A]">
                          <span className="inline-flex items-center justify-center rounded-full bg-[#22C55E]/15 px-2 py-0.5 text-[#16A34A]">
                            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            Confidence
                          </span>
                          <span className="whitespace-nowrap">94%</span>
                        </div>
                      </div>

                      <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-[#6E6D7A]">Explainability</div>
                          <div className="text-sm font-semibold text-[#0D0C22]">High</div>
                        </div>
                        <div className="mt-2 text-xs font-medium text-[#6E6D7A]">Transparent scoring signals</div>
                      </div>

                      <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-[#6E6D7A]">Audit Status</div>
                          <div className="text-sm font-semibold text-[#0D0C22]">Completed</div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-[#6E6D7A]">
                          <FileCheck2 className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                          <span>Audit-ready artifacts</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-[#6E6D7A]">Skills Match</div>
                          <div className="text-sm font-semibold text-[#0D0C22]">87%</div>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E7E7E9]">
                          <div className="h-full w-[87%] rounded-full bg-[#2563EB]" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="rounded-[1.2rem] border border-[#E7E7E9] bg-white/70 px-4 py-3 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-[#6E6D7A]">Missing Skills</div>
                          <div className="text-sm font-semibold text-[#0D0C22]">3</div>
                        </div>
                        <div className="mt-2 text-xs font-medium text-[#6E6D7A]">Actionable remediation list</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating cards */}
                  <FloatingCard
                    icon={<WandSparkles className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />}
                    title="Explainable AI"
                    delay={0.12}
                    className="floating-card-1"
                  />
                  <FloatingCard
                    icon={<Scale className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />}
                    title="Fairness Monitoring"
                    delay={0.18}
                    className="floating-card-2"
                  />
                  <FloatingCard
                    icon={<ShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />}
                    title="Audit Ready"
                    delay={0.24}
                    className="floating-card-3"
                  />
                </div>
              </div>

              {/* Override positions via additional wrapper divs (safer than targeting internal structure) */}
              <div aria-hidden="true" className="sr-only" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Position floating cards precisely with absolutely positioned wrappers */}
      <div aria-hidden="true" className="pointer-events-none">
        {/* These wrappers are intentionally empty: the actual FloatingCard components are positioned by CSS variables below. */}
      </div>

      {/* Accessibility live region */}
      <p className="sr-only" aria-live="polite">
        Features hero loaded. Platform Features badge, primary and secondary CTAs, and dashboard preview are ready.
      </p>

      {/* Set exact floating card positions using scoped selectors */}
      <style jsx>{`
        section[aria-label="BiasLens Platform Features hero"] .floating-card-1 {
          right: 1rem;
          top: 7.5rem;
        }
        section[aria-label="BiasLens Platform Features hero"] .floating-card-2 {
          left: 1rem;
          top: 11.5rem;
        }
        section[aria-label="BiasLens Platform Features hero"] .floating-card-3 {
          right: 2rem;
          bottom: 2rem;
        }

        @media (max-width: 1024px) {
          section[aria-label="BiasLens Platform Features hero"] .floating-card-1 {
            right: 0.75rem;
            top: 6.5rem;
          }
          section[aria-label="BiasLens Platform Features hero"] .floating-card-2 {
            left: 0.75rem;
            top: 9.75rem;
          }
          section[aria-label="BiasLens Platform Features hero"] .floating-card-3 {
            right: 1rem;
            bottom: 1.25rem;
          }
        }
      `}</style>

    </section>
  );
}

