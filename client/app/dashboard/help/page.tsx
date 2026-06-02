"use client";

import Link from "next/link";
import { BookOpen, LifeBuoy, Mail, MessageSquare, ShieldQuestion } from "lucide-react";

import { Card } from "@/components/ui/card";

const helpCards = [
  {
    title: "Product Guides",
    description: "Walk through audit uploads, fairness dashboards, explainability views, and reports.",
    href: "/dashboard/settings?tab=account",
    icon: BookOpen,
    cta: "Open settings",
  },
  {
    title: "Security Help",
    description: "Review session protection, password updates, and access recommendations for your workspace.",
    href: "/dashboard/settings/security",
    icon: ShieldQuestion,
    cta: "Open security",
  },
  {
    title: "Contact Support",
    description: "Reach the BiasLens support team when an audit, export, or account flow needs help.",
    href: "mailto:support@biaslens.ai",
    icon: Mail,
    cta: "Email support",
  },
];

export default function DashboardHelpPage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border-[#E7E7E9] bg-white p-6 shadow-[0_24px_64px_rgba(13,12,34,0.04)]">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#dbe8ff] text-[#1463ff]">
            <LifeBuoy size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Help Center</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">Support for your audit workflow</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
              Find the fastest path for account setup, audit reviews, exports, and team security tasks.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {helpCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="rounded-[2rem] border-[#E7E7E9] bg-white p-6 shadow-[0_20px_56px_rgba(13,12,34,0.03)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6F8FB] text-[#2563EB]">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[#0D0C22]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">{item.description}</p>
              <Link
                href={item.href}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1463ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f57ea]"
              >
                <MessageSquare size={14} />
                {item.cta}
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
