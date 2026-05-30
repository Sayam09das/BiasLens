"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ShieldCheck,
  SearchCheck,
  FileText,
  Users,
  Lock,
} from "lucide-react";

type QA = {
  q: string;
  a: string;
  icon: React.ReactNode;
};

const faqs: QA[] = [
  {
    q: "What does BiasLens do?",
    a: "BiasLens audits resumes using AI-powered scoring, explainability, and fairness analysis.",
    icon: <SearchCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    q: "Does BiasLens replace recruiters?",
    a: "No. It helps recruiters understand and validate hiring decisions.",
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
  },
  {
    q: "How does fairness analysis work?",
    a: "BiasLens surfaces fairness signals, counterfactual comparisons, and bias indicators.",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
  },
  {
    q: "Can I export reports?",
    a: "Yes. Audit reports can be generated and shared.",
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
  },
  {
    q: "Is candidate data secure?",
    a: "Yes. Secure uploads, authentication, validation, and audit logging are built into the platform.",
    icon: <Lock className="h-5 w-5" aria-hidden="true" />,
  },
  {
    q: "Can teams collaborate?",
    a: "Yes. Team and Enterprise plans support collaborative workflows.",
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: QA;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF]">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center gap-4 rounded-[1.6rem] px-5 py-5 text-left transition hover:bg-[#F6F8FB]"
          aria-expanded={isOpen}
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] text-[#2563EB]">
            {item.icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{item.q}</span>
          </span>
          <motion.span
            aria-hidden="true"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E7E9] bg-[#FFFFFF]"
          >
            <ChevronDown className="h-4 w-4 text-[#0D0C22]" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="px-5 pb-5">
              <p className="text-sm leading-6 text-[#6E6D7A]">{item.a}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number>(0);

  return (
    <section className="bg-[#F6F8FB]" aria-label="Frequently Asked Questions">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path
                  d="M10.5 9.75a2 2 0 1 1 3 1.75c-.86.5-1.5 1.14-1.5 2.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Frequently Asked Questions
          </span>
        </div>

        {/* Headings */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Everything You Need To Know
          </h2>
          <p className="mx-auto mt-4 max-w-[70ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            Clear answers for recruiters and teams evaluating responsible, audit-ready resume screening.
          </p>
        </div>

        {/* Accordion */}
        <div className="mx-auto mt-12 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:items-start">
          {faqs.map((item, idx) => (
            <div key={item.q} className="sm:odd:col-span-1 lg:col-span-1">
              <AccordionItem
                item={item}
                isOpen={openIndex === idx}
                onToggle={() => setOpenIndex((prev) => (prev === idx ? -1 : idx))}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

