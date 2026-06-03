"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    Sparkles,
    Compass,
    BarChart3,
    BadgeAlert,
    ShieldCheck,
    TrendingUp,
} from "lucide-react";

type Capability = {
    title: string;
    description: string;
    icon: React.ReactNode;
};

function BadgePill({
    icon,
    label,
    tone,
}: {
    icon: React.ReactNode;
    label: string;
    tone: "primary" | "success" | "warning" | "danger" | "muted";
}) {
    const toneClasses =
        tone === "success"
            ? "border-[#22C55E]/35 bg-[#22C55E]/10 text-[#16A34A]"
            : tone === "warning"
                ? "border-[#F59E0B]/35 bg-[#F59E0B]/10 text-[#B45309]"
                : tone === "danger"
                    ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#DC2626]"
                    : tone === "muted"
                        ? "border-[#E7E7E9] bg-[#FFFFFF] text-[#6E6D7A]"
                        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#2563EB]";

    return (
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${toneClasses}`}>
            {icon}
            <span>{label}</span>
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
                    {capability.icon}
                </div>
                <div>
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{capability.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{capability.description}</p>
                </div>
            </div>
        </motion.article>
    );
}

export default function ExplainabilityDeepDive() {
    const capabilities: Capability[] = [
        {
            title: "Decision Breakdown",
            description:
                "Break down each resume score into role fit, skill match, experience relevance, education alignment, and achievement strength.",
            icon: <Compass className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
        },
        {
            title: "Signal Attribution",
            description:
                "Show positive and negative scoring signals so teams understand which resume details influenced the recommendation.",
            icon: <BarChart3 className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
        },
        {
            title: "Missing Evidence",
            description:
                "Detect missing proof points such as portfolio links, measurable impact, certifications, leadership examples, or domain experience.",
            icon: <BadgeAlert className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
        },
        {
            title: "Confidence Scoring",
            description:
                "Display confidence indicators that help teams know how reliable, complete, and explainable each audit result is.",
            icon: <ShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
        },
    ];

    return (
        <section aria-label="Explainability Deep Dive" className="bg-[#FFFFFF]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                    {/* Mobile: image first */}
                    <div className="lg:order-1 lg:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] as const }}
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
                                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]" aria-hidden="true" />
                                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#F59E0B]" aria-hidden="true" />
                                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#EF4444]" aria-hidden="true" />
                                        <span className="ml-3 text-xs font-medium text-[#6E6D7A]">Explainability Deep Dive</span>
                                    </div>

                                    <div className="relative aspect-[16/11] w-full">
                                        <Image
                                            src="/images/ExplainabilityDeepDive.png"
                                            alt="BiasLens explainability deep dive dashboard"
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
                                            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                                            className="absolute left-4 top-4"
                                        >
                                            <BadgePill
                                                tone="primary"
                                                icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                                                label="Confidence 91%"
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-40px" }}
                                            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
                                            className="absolute right-4 top-20"
                                        >
                                            <BadgePill
                                                tone="muted"
                                                icon={<TrendingUp className="h-4 w-4" aria-hidden="true" />}
                                                label="Top Signal: Experience"
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-40px" }}
                                            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                                            className="absolute left-6 bottom-6"
                                        >
                                            <BadgePill
                                                tone="success"
                                                icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                                                label="Explainability High"
                                            />
                                        </motion.div>

                                        {/* minimal negative accent */}
                                        <div
                                            aria-hidden="true"
                                            className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/75 via-transparent to-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right content */}
                    <div className="lg:order-2 lg:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
                            className=""
                        >
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
                                <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                                Explainability Deep Dive
                            </span>

                            <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
                                Understand the Signals Behind Every Resume Score
                            </h2>

                            <p className="mt-4 max-w-[64ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
                                BiasLens turns model outputs into clear decision explanations so hiring teams can see what helped,
                                what hurt, what evidence is missing, and how confident the system is.
                            </p>

                            <div className="mt-8 grid grid-cols-1 gap-4">
                                {capabilities.map((c, i) => (
                                    <CapabilityCard key={c.title} capability={c} index={i} />
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white/70 px-5 py-3 text-sm font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2563EB]/10">
                                        <ShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                                    </span>
                                    Audit-ready explanations
                                </div>

                                <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-5 py-3 text-sm font-semibold text-[#0D0C22] shadow-sm">
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F59E0B]/10">
                                        <span className="inline-flex h-2 w-2 rounded-full bg-[#F59E0B]" aria-hidden="true" />
                                    </span>
                                    Missing evidence detection
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
