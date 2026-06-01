"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  UserRoundSearch,
  Building2,
  GraduationCap,
  ShieldCheck,
  Rocket,
  Scale,
  FileCheck2,
  SearchCheck,
} from "lucide-react";

type UseCase = {
  title: string;
  icon: React.ReactNode;
  bullets: string[];
};

const useCases: UseCase[] = [
  {
    title: "Recruiters",
    icon: <UserRoundSearch className="h-5 w-5" aria-hidden="true" />,
    bullets: [
      "Faster resume reviews",
      "Explainable candidate scoring",
      "Better shortlist decisions",
    ],
  },
  {
    title: "HR Teams",
    icon: <Scale className="h-5 w-5" aria-hidden="true" />,
    bullets: ["Fairness monitoring", "Hiring transparency", "Audit-ready workflows"],
  },
  {
    title: "Enterprises",
    icon: <Building2 className="h-5 w-5" aria-hidden="true" />,
    bullets: [
      "Responsible AI adoption",
      "Compliance support",
      "Large-scale candidate evaluation",
    ],
  },
  {
    title: "Universities",
    icon: <GraduationCap className="h-5 w-5" aria-hidden="true" />,
    bullets: [
      "Career readiness analysis",
      "Resume improvement feedback",
      "Placement support",
    ],
  },
  {
    title: "Government Hiring",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    bullets: [
      "Transparent evaluation",
      "Fair screening processes",
      "Accountability reporting",
    ],
  },
];

export default function UseCases() {
  return (
    <section className="bg-[#FFFFFF]" aria-label="Use Cases">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <Rocket className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Use Cases
          </span>
        </div>

        {/* Headings */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Built for Every Team Involved in Hiring
          </h2>
          <p className="mx-auto mt-4 max-w-[72ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            BiasLens helps recruiters, HR teams, enterprises, universities, and public-sector
            organizations build more transparent hiring workflows.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc, idx) => (
            <motion.article
              key={uc.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.03 }}
              className="group relative overflow-hidden rounded-[1.8rem] border border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_16px_40px_rgba(13,12,34,0.04)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(13,12,34,0.08)]"
              aria-label={uc.title}
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#2563EB]/70 via-[#2563EB]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] text-[#2563EB]">
                    {uc.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{uc.title}</h3>
                    <ul className="mt-3 space-y-2">
                      {uc.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm leading-6 text-[#6E6D7A]">
                          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]" aria-hidden="true">
                            <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <span className="text-[#0D0C22]">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-sm font-semibold text-[#0D0C22] transition-colors duration-300 hover:bg-[#FFFFFF]"
                  >
                    Explore for {uc.title}
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]" aria-hidden="true">
                      <SearchCheck className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-[#E7E7E9] to-transparent" />
        </div>
      </div>
    </section>
  );
}
