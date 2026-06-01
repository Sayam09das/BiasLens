"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Sparkles, FileText, ShieldCheck, Scale } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
  icon: React.ReactNode;
};

function FAQIconWrap({ icon }: { icon: React.ReactNode }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
      <span className="text-[#2563EB]">{icon}</span>
    </span>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  id,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div className="group rounded-[1.6rem] border border-[#E7E7E9] bg-white/70 p-5 shadow-[0_16px_40px_rgba(13,12,34,0.04)] backdrop-blur-xl transition hover:border-[#2563EB]/25">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          <FAQIconWrap icon={item.icon} />
          <div>
            <div className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">{item.question}</div>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] text-[#0D0C22] transition group-hover:border-[#2563EB]/30"
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-xl leading-none"
          >
            +
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={id}
            role="region"
            aria-label={item.question}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 overflow-hidden"
          >
            <p className="text-sm leading-7 text-[#6E6D7A]">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FeaturesMiniFAQ() {
  const items: FAQItem[] = [
    {
      question: "Is scoring explainable?",
      answer:
        "Yes. BiasLens breaks down resume scores into role fit, skill match, signal attribution, missing evidence, and confidence indicators so hiring teams can understand why each result was produced.",
      icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
    },
    {
      question: "Can reports be exported?",
      answer:
        "Yes. BiasLens supports audit-ready report exports with resume scores, job-fit analysis, explainability insights, fairness notes, improvement suggestions, and decision records.",
      icon: <FileText className="h-5 w-5" aria-hidden="true" />,
    },
    {
      question: "Does it detect bias?",
      answer:
        "BiasLens surfaces fairness signals, bias risk indicators, counterfactual comparisons, and fairness metrics to help teams review potential risks before decisions impact candidates.",
      icon: <Scale className="h-5 w-5" aria-hidden="true" />,
    },
    {
      question: "Is data secure?",
      answer:
        "Yes. BiasLens uses authentication, protected APIs, secure uploads, validation middleware, admin audit logs, and structured backend workflows to protect resume audit data.",
      icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    },
  ];

  // Desktop: independent open states; Mobile: allow only one open at a time.
  const [openIndexDesktop, setOpenIndexDesktop] = React.useState<number | null>(0);
  const [openIndexMobile, setOpenIndexMobile] = React.useState<number | null>(0);

  return (
    <section aria-label="FAQ" className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <HelpCircle className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            FAQ
          </div>

          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Feature Questions, Answered
          </h2>
          <p className="mx-auto mt-4 max-w-[62ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg sm:leading-8">
            Quick answers about BiasLens scoring, reports, fairness monitoring, and security workflows.
          </p>
        </div>

        {/* Desktop 2-col grid */}
        <div className="mt-10 hidden gap-4 md:grid md:grid-cols-2">
          {items.map((item, idx) => {
            const id = `faq-desktop-${idx}`;
            const isOpen = openIndexDesktop === idx;
            return (
              <AccordionItem
                key={item.question}
                item={item}
                isOpen={isOpen}
                onToggle={() => setOpenIndexDesktop(isOpen ? null : idx)}
                id={id}
              />
            );
          })}
        </div>

        {/* Mobile single accordion list */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:hidden">
          {items.map((item, idx) => {
            const id = `faq-mobile-${idx}`;
            const isOpen = openIndexMobile === idx;
            return (
              <AccordionItem
                key={item.question}
                item={item}
                isOpen={isOpen}
                onToggle={() => setOpenIndexMobile(isOpen ? null : idx)}
                id={id}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
