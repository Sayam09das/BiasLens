"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Bell,
  CreditCard,
  KeyRound,
  ShieldCheck,
  TriangleAlert,
  User,
  Users,
  Globe,
} from "lucide-react";

type NavItem = {
  label: string;
  tab: string;
  icon: React.ReactNode;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Profile",       tab: "profile",       icon: <User size={18} aria-hidden="true" />,          href: "/dashboard/settings?tab=profile"       },
  { label: "Account",       tab: "account",       icon: <Globe size={18} aria-hidden="true" />,          href: "/dashboard/settings?tab=account"       },
  { label: "Security",      tab: "security",      icon: <ShieldCheck size={18} aria-hidden="true" />,    href: "/dashboard/settings/security"          },
  { label: "Notifications", tab: "notifications", icon: <Bell size={18} aria-hidden="true" />,           href: "/dashboard/settings?tab=notifications"  },
  { label: "API Keys",      tab: "api-keys",      icon: <KeyRound size={18} aria-hidden="true" />,       href: "/dashboard/settings?tab=api-keys"      },
  { label: "Billing",       tab: "billing",       icon: <CreditCard size={18} aria-hidden="true" />,     href: "/dashboard/settings?tab=billing"       },
  { label: "Team",          tab: "team",          icon: <Users size={18} aria-hidden="true" />,          href: "/dashboard/settings?tab=team"          },
  { label: "Danger Zone",   tab: "danger",        icon: <TriangleAlert size={18} aria-hidden="true" />,  href: "/dashboard/settings?tab=danger"        },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "profile";

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <header className="rounded-4xl border border-[#E7E7E9] bg-white px-4 py-6 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Settings</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-3xl">Settings</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
          Manage your profile, account preferences, security, sessions, and workspace configuration.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <nav
            aria-label="Settings navigation"
            className="rounded-4xl border border-[#E7E7E9] bg-white p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)]"
          >
            <p className="text-sm font-semibold text-[#0D0C22]">Navigation</p>

            <ul className="mt-4 space-y-1" role="list">
              {navItems.map((item) => {
                const isActive = item.tab === tab || (item.tab === "security" && tab === "security");
                return (
                  <li key={item.tab}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        "group flex items-center gap-3 rounded-[1.25rem] px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] " +
                        (isActive
                          ? "bg-[#dbe8ff] text-[#1463ff]"
                          : "text-[#6E6D7A] hover:bg-[#F6F8FB] hover:text-[#0D0C22]")
                      }
                    >
                      <span
                        className={
                          "grid h-9 w-9 shrink-0 place-items-center rounded-2xl border transition " +
                          (isActive
                            ? "border-[#1463ff]/30 bg-[#1463ff] text-white"
                            : "border-[#E7E7E9] bg-white text-[#2563EB] group-hover:border-[#2563EB]")
                        }
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-[#1463ff]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 lg:col-span-8">{children}</main>
      </div>
    </div>
  );
}
