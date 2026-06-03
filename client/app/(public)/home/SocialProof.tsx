"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    FiShield,
    FiSliders,
    FiCheckCircle,
    FiLock,
    FiHome,
    FiZap,
} from "react-icons/fi";

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
});

/* ── data ── */
const stats = [
    { value: "92%", label: "Resume Analysis Accuracy" },
    { value: "10s", label: "Average Audit Time" },
    { value: "100%", label: "Explainable Decisions" },
    { value: "24/7", label: "Automated Auditing" },
];

const badges = [
    {
        label: "Explainable AI",
        sub: "Full decision transparency",
        icon: <FiSliders size={18} className="text-[#2563EB]" />,
    },
    {
        label: "Fairness Monitoring",
        sub: "Continuous bias detection",
        icon: <FiShield size={18} className="text-[#2563EB]" />,
    },
    {
        label: "Responsible AI",
        sub: "Ethical hiring framework",
        icon: <FiZap size={18} className="text-[#2563EB]" />,
    },
    {
        label: "Audit Ready",
        sub: "Compliance-grade reports",
        icon: <FiCheckCircle size={18} className="text-[#2563EB]" />,
    },
    {
        label: "Privacy Focused",
        sub: "GDPR & data protection built-in",
        icon: <FiLock size={18} className="text-[#2563EB]" />,
    },
    {
        label: "Enterprise Security",
        sub: "Built for enterprise workflows",
        icon: <FiHome size={18} className="text-[#2563EB]" />,
    },
];

const logos = [
    { name: "NovaHR", src: "/icons/novahr.svg" },
    { name: "TalentIQ", src: "/icons/talentiq.svg" },
    { name: "RecruitFlow", src: "/icons/recruitflow.svg" },
    { name: "HireStack", src: "/icons/hirestack.svg" },
    { name: "PeopleOS", src: "/icons/peopleos.svg" },
    { name: "ATSCloud", src: "/icons/atscloud.svg" },
];

export default function SocialProof() {
    return (
        <section
            className="border-b border-[#E7E7E9] bg-[#FFFFFF]"
            aria-label="BiasLens Social proof"
        >
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                {/* ── Heading ── */}
                <motion.div className="mx-auto max-w-3xl text-center" {...fadeUp(0)}>
                    <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                        Trusted AI for Transparent Hiring Decisions
                    </h2>

                    <p className="mx-auto mt-4 max-w-[60ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
                        BiasLens helps organizations understand resume screening outcomes
                        through explainable AI, fairness analysis, and actionable insights.
                    </p>
                </motion.div>

                {/* ── Stats Grid ── */}
                <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            {...fadeUp(0.08 + i * 0.08)}
                            whileHover={{
                                y: -4,
                                transition: {
                                    type: "spring",
                                    stiffness: 320,
                                    damping: 22,
                                },
                            }}
                            className="group relative cursor-default overflow-hidden rounded-[1.6rem] border border-[#E7E7E9] bg-white p-6 shadow-[0_20px_60px_rgba(13,12,34,0.06)]"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2563EB]/80 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                                {s.value}
                            </div>

                            <div className="mt-2 text-sm font-semibold leading-6 text-[#0D0C22]">
                                {s.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Trust Badges ── */}
                <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {badges.map((b, i) => (
                        <motion.div
                            key={b.label}
                            {...fadeUp(0.1 + i * 0.07)}
                            whileHover={{
                                y: -3,
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                },
                            }}
                            className="flex cursor-default items-center gap-3 rounded-[1.4rem] border border-[#E7E7E9] bg-white/70 px-4 py-4 shadow-sm hover:bg-white"
                        >
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB]/10">
                                {b.icon}
                            </span>

                            <div className="min-w-0">
                                <div className="text-sm font-semibold tracking-[-0.02em] text-[#0D0C22]">
                                    {b.label}
                                </div>

                                <div className="mt-0.5 text-xs font-medium text-[#6E6D7A]">
                                    {b.sub}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Company logos ── */}
                <motion.div className="mt-14" {...fadeUp(0.2)}>
                    <div className="flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
                            <span
                                aria-hidden="true"
                                className="h-2 w-2 rounded-full bg-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,0.15)]"
                            />
                            Trusted by Modern Hiring Teams
                        </span>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {logos.map((logo, i) => (
                            <motion.div
                                key={logo.name}
                                {...fadeIn(0.25 + i * 0.05)}
                                whileHover={{
                                    y: -3,
                                    scale: 1.04,
                                    transition: {
                                        type: "spring",
                                        stiffness: 320,
                                        damping: 20,
                                    },
                                }}
                                className="flex h-16 cursor-default items-center justify-center rounded-2xl border border-[#E7E7E9] bg-white px-4 shadow-sm transition-all duration-300 hover:shadow-lg"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={logo.src}
                                    alt={logo.name}
                                    width={130}
                                    height={40}
                                    loading="lazy"
                                    className="h-8 w-auto object-contain opacity-90 transition-all duration-300 hover:scale-105 hover:opacity-100"
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Separator ── */}
                <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-[#E7E7E9] to-transparent" />
            </div>
        </section>
    );
}
