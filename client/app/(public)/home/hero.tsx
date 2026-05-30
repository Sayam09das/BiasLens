"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Building2 } from "lucide-react";




export default function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-[#E7E7E9] bg-[#FFFFFF]"
      aria-label="BiasLens hero section"
    >
      {/* ── Background blobs ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 -top-32 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[#2563EB]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-[420px] w-[420px] rounded-full bg-[#2563EB]/6 blur-3xl" />
        <div className="absolute -bottom-28 -right-24 h-[420px] w-[420px] rounded-full bg-[#2563EB]/6 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#EEF4FF]/60 via-white/80 to-white" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ── Top center badge ── */}
        <motion.div
          className="flex justify-center pt-16 sm:pt-20 lg:pt-24"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/80 px-4 py-2 shadow-[0_4px_24px_rgba(37,99,235,0.10)] backdrop-blur-xl">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] text-white">
              {/* sparkle icon */}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M6.5 1L7.8 5.2H12L8.6 7.8L9.9 12L6.5 9.4L3.1 12L4.4 7.8L1 5.2H5.2L6.5 1Z" fill="white"/>
              </svg>
            </span>
            <span className="text-sm font-semibold text-[#0D0C22]">
              Responsible AI for Hiring
            </span>
          </div>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          className="mt-6 text-center font-semibold tracking-[-0.04em] text-[#0D0C22] text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.06] text-balance"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Understand Every Hiring
          <br className="hidden sm:block" />
          Decision with BiasLens
        </motion.h1>

        {/* ── Subheadline ── */}
        <motion.p
          className="mx-auto mt-5 max-w-[52ch] text-center text-base sm:text-lg leading-7 text-[#6E6D7A]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Instantly refine your hiring decisions and stand out from bias with
          our AI-powered resume analysis and fairness auditing platform.
        </motion.p>

        {/* ── CTA Buttons ── */}
        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(37,99,235,0.32)] hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30 transition"
            >
              Start Free Audit
              <span aria-hidden="true" className="text-white/75">→</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-full border border-[#D1D5DB] bg-white/80 px-7 py-3.5 text-sm font-semibold text-[#0D0C22] shadow-[0_2px_12px_rgba(13,12,34,0.07)] backdrop-blur-xl hover:border-[#2563EB]/40 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/20 transition"
            >
              Premium Plan
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Dashboard image mockup ── */}
        <motion.div
          className="relative mt-14 sm:mt-16"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow behind card */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-8 mx-auto h-48 w-3/4 rounded-full bg-[#2563EB]/12 blur-3xl"
          />

          {/* Card wrapper */}
          <motion.div
            className="relative overflow-hidden rounded-[1.8rem] border border-[#E7E7E9] bg-white/70 shadow-[0_40px_100px_rgba(13,12,34,0.13)] backdrop-blur-xl"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Heroimg.png"
              alt="BiasLens dashboard preview showing resume scoring, fairness risk, and explainability"
              className="block w-full object-cover object-top"
              loading="eager"
            />

            {/* Bottom fade */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/80 to-transparent"
            />
          </motion.div>

          {/* Floating badge — Smart Resume Optimization */}
          <motion.div
            className="absolute -right-2 top-8 hidden sm:flex items-center gap-2 rounded-2xl border border-[#E7E7E9] bg-white px-4 py-3 shadow-[0_8px_32px_rgba(13,12,34,0.10)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-sm font-semibold text-[#0D0C22] whitespace-nowrap">Smart Resume Optimization</span>
          </motion.div>

          {/* Floating badge — Keyword Optimization */}
          <motion.div
            className="absolute -right-2 bottom-12 hidden sm:flex items-center gap-2 rounded-2xl border border-[#E7E7E9] bg-white px-4 py-3 shadow-[0_8px_32px_rgba(13,12,34,0.10)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-sm font-semibold text-[#0D0C22] whitespace-nowrap">Keyword Optimization</span>
          </motion.div>

          {/* Floating badge — Professional Summary */}
          <motion.div
            className="absolute -left-2 bottom-16 hidden sm:flex items-center gap-2 rounded-2xl border border-[#E7E7E9] bg-white px-4 py-3 shadow-[0_8px_32px_rgba(13,12,34,0.10)]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-sm font-semibold text-[#0D0C22] whitespace-nowrap">Professional Summary</span>
          </motion.div>
        </motion.div>

        {/* ── Trust strip ── */}
        <motion.div
          className="mt-10 mb-14 sm:mb-16 grid grid-cols-1 gap-3 sm:grid-cols-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
        >
          {[
            { label: "No Credit Card Required", icon: ShieldCheck },
            { label: "Explainable AI", icon: Sparkles },
            { label: "Enterprise Ready", icon: Building2 },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border border-[#E7E7E9] bg-white/70 px-4 py-3 shadow-[0_2px_16px_rgba(13,12,34,0.05)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 + i * 0.07, duration: 0.4, ease: "easeOut" }}
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10">
                <item.icon className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              </span>

              <span className="text-sm font-semibold text-[#0D0C22]">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>

      <p className="sr-only" aria-live="polite">
        Hero section loaded. Use the Start Free Audit button to begin.
      </p>
    </section>
  );
}