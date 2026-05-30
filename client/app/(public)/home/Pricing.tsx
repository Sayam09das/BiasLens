"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Check,
  ShieldCheck,
  Sparkles,
  Users,
  CreditCard,
  DollarSign,
} from "lucide-react";

type Billing = "monthly" | "yearly";

type Plan = {
  name: string;
  price: string;
  description: string;
  highlight?: boolean;
  icon: React.ReactNode;
  bullets: string[];
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "Free",
    description: "For getting started with transparent audits.",
    icon: <DollarSign className="h-5 w-5" aria-hidden="true" />,
    bullets: ["10 audits/month", "Resume scoring", "Basic reports"],
  },
  {
    name: "Pro",
    price: "$29/month",
    description: "For teams that need explainability and fairness monitoring.",
    highlight: true,
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
    bullets: [
      "Unlimited audits",
      "Explainability insights",
      "Fairness monitoring",
      "PDF reports",
    ],
  },
  {
    name: "Team",
    price: "$99/month",
    description: "For collaborative hiring workflows across roles.",
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
    bullets: [
      "Team workspace",
      "Audit history",
      "Role comparison",
      "Advanced analytics",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    description: "For SSO, compliance, and large-scale adoption.",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    bullets: ["SSO", "Compliance support", "Dedicated onboarding", "Priority support"],
  },
];

function formatYearly(monthlyPrice: number) {
  // Common SaaS discount: 2 months free (~16.7% off)
  const yearly = Math.round(monthlyPrice * 10);
  return `$${yearly}/year`;
}

export default function Pricing() {
  const [billing, setBilling] = React.useState<Billing>("monthly");

  const computedPlans = React.useMemo(() => {
    return plans.map((p) => {
      if (p.name === "Starter") return p;

      if (p.name === "Pro") {
        const monthly = 29;
        return {
          ...p,
          price: billing === "monthly" ? "$29/month" : formatYearly(monthly),
        };
      }

      if (p.name === "Team") {
        const monthly = 99;
        return {
          ...p,
          price: billing === "monthly" ? "$99/month" : formatYearly(monthly),
        };
      }

      return p;
    });
  }, [billing]);

  return (
    <section className="bg-[#FFFFFF]" aria-label="Pricing">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center justify-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2 text-xs font-semibold text-[#0D0C22] shadow-sm">
            <CreditCard className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Pricing
          </span>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-4xl">
            Simple Pricing For Responsible Hiring
          </h2>
          <p className="mx-auto mt-4 max-w-[64ch] text-pretty text-base leading-7 text-[#6E6D7A] sm:text-lg">
            Choose the plan that fits your hiring workflow.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex justify-center">
          <div
            className="inline-flex items-center gap-3 rounded-full border border-[#E7E7E9] bg-[#F6F8FB] p-1"
            role="group"
            aria-label="Billing interval"
          >
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={
                "rounded-full px-4 py-2 text-sm font-semibold transition " +
                (billing === "monthly"
                  ? "bg-[#FFFFFF] text-[#0D0C22] shadow-[0_10px_30px_rgba(13,12,34,0.06)]"
                  : "text-[#6E6D7A] hover:text-[#0D0C22]")
              }
              aria-pressed={billing === "monthly"}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={
                "rounded-full px-4 py-2 text-sm font-semibold transition " +
                (billing === "yearly"
                  ? "bg-[#FFFFFF] text-[#0D0C22] shadow-[0_10px_30px_rgba(13,12,34,0.06)]"
                  : "text-[#6E6D7A] hover:text-[#0D0C22]")
              }
              aria-pressed={billing === "yearly"}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4">
          {computedPlans.map((plan, idx) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: idx * 0.04 }}
              className={
                "relative rounded-[1.8rem] border p-6 shadow-[0_16px_40px_rgba(13,12,34,0.04)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(13,12,34,0.08)] " +
                (plan.highlight
                  ? "border-[#2563EB]/30 bg-[#FFFFFF]"
                  : "border-[#E7E7E9] bg-[#FFFFFF]")
              }
              aria-label={`${plan.name} plan`}
            >
              {plan.highlight ? (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold text-[#2563EB] shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Most Popular
                  </span>
                </div>
              ) : null}

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] text-[#2563EB]">
                    {plan.icon}
                  </div>
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0D0C22]">
                    {plan.name}
                  </h3>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold tracking-[-0.03em] text-[#0D0C22]">
                    {plan.price}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{plan.description}</p>
              </div>

              <ul className="mt-5 space-y-3">
                {plan.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm leading-6 text-[#6E6D7A]">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#16A34A]">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-[#0D0C22]">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  type="button"
                  className={
                    "inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition " +
                    (plan.highlight
                      ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                      : "border border-[#E7E7E9] bg-[#F6F8FB] text-[#0D0C22] hover:bg-[#FFFFFF]")
                  }
                  aria-label={`Choose ${plan.name}`}
                >
                  {plan.highlight ? "Start with Pro" : `Choose ${plan.name}`}
                </button>
              </div>

              {plan.name !== "Enterprise" ? (
                <div className="mt-5 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] p-3">
                  <p className="text-xs font-semibold text-[#0D0C22]">What you get</p>
                  <p className="mt-1 text-xs leading-5 text-[#6E6D7A]">
                    Transparent scoring plus audit-ready artifacts.
                  </p>
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <p className="max-w-[68ch] text-center text-xs leading-5 text-[#6E6D7A]">
            Billing is shown as a premium example. Final plans and compliance options are confirmed during onboarding.
          </p>
        </div>
      </div>
    </section>
  );
}

