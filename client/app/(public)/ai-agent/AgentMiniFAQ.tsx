"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  ShieldCheck,
  FileCheck2,
  MessageCircleQuestion,
} from "lucide-react";

type FAQItem = {
  icon: React.ReactNode;
  question: string;
  answer: string;
};

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentId = React.useId();

  return (
    <div className="rounded-[1.6rem] border border-[#E7E7E9] bg-[#FFFFFF] shadow-[0_18px_50px_rgba(13,12,34,0.03)]">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className={
            "flex w-full items-start justify-between gap-4 rounded-[1.6rem] px-5 py-4 text-left transition hover:bg-[#F6F8FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/25"
          }
        >
          <span className="flex items-start gap-4">
            <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2563EB]/10">
              {item.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold tracking-[-0.02em] text-[#0D0C22]">
                {item.question}
              </span>
              <span className="sr-only">Toggle answer</span>
            </span>
          </span>

          <span
            aria-hidden="true"
            className={
              "inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] text-[#6E6D7A] transition " +
              (isOpen ? "rotate-45" : "")
            }
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#6E6D7A]" style={{ opacity: 0 }} />
            <span
              className="relative h-3 w-3"
              aria-hidden="true"
              style={{ transform: "translateZ(0)" }}
            >
              <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[#6E6D7A]" />
              <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[#6E6D7A]" />
            </span>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={contentId}
            role="region"
            aria-label={item.question}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{item.answer}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function AgentMiniFAQ() {
  const items: FAQItem[] = [
    {
      icon: <Bot className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      question: "What does the AI agent do?",
      answer:
        "The BiasLens AI Agent analyzes resumes, compares them with job descriptions, explains job-fit scores, reviews fairness signals, suggests improvements, and generates audit-ready reports.",
    },
    {
      icon: <MessageCircleQuestion className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      question: "Does it make final hiring decisions?",
      answer:
        "No. The agent supports recruiters and hiring teams with explainable analysis, but final hiring decisions should always remain with humans.",
    },
    {
      icon: <FileCheck2 className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      question: "Can it explain scores?",
      answer:
        "Yes. It breaks scores into role fit, skill match, hiring signals, missing evidence, and confidence reasoning so teams understand why each result was produced.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />,
      question: "Is it safe for candidate data?",
      answer:
        "Yes. BiasLens supports authentication, protected APIs, secure uploads, validation middleware, admin audit logs, and structured backend workflows to protect candidate data.",
    },
  ];

  const [openIndex, setOpenIndex] = React.useState<number>(0);

  return (
    <section aria-label="FAQ" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            FAQ
          </span>

          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            AI Agent Questions, Answered
          </h2>

          <p className="mt-4 text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
            Quick answers about how the BiasLens AI Agent analyzes resumes, explains scores, supports fairness
            review, and protects candidate data.
          </p>
        </div>

        {/* Desktop: two-column FAQ grid */}
        <div className="mt-12 hidden grid-cols-1 gap-4 lg:grid lg:grid-cols-2">
          {items.map((item, idx) => (
            <div key={item.question} className="h-full">
              <AccordionItem
                item={item}
                isOpen={openIndex === idx}
                onToggle={() => setOpenIndex((prev) => (prev === idx ? -1 : idx))}
              />
            </div>
          ))}
        </div>

        {/* Mobile: single-column accordion */}
        <div className="mt-10 grid grid-cols-1 gap-4 lg:hidden">
          {items.map((item, idx) => (
            <AccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex((prev) => (prev === idx ? -1 : idx))}
            />
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {openIndex >= 0 ? `FAQ expanded: ${items[openIndex]?.question}` : "FAQ collapsed"}
        </p>
      </div>
    </section>
  );
}

