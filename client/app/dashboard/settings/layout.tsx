import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Bell, KeyRound, CreditCard, Users, TriangleAlert, User } from "lucide-react";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const BRAND = {
  primary: "#2563EB",
  background: "#FFFFFF",
  secondaryBackground: "#F6F8FB",
  text: "#0D0C22",
  mutedText: "#6E6D7A",
  border: "#E7E7E9",
};

const navItems: NavItem[] = [
  { label: "Profile", href: "/dashboard/settings", icon: <User size={18} aria-hidden="true" /> },
  { label: "Account", href: "/dashboard/settings", icon: <ShieldCheck size={18} aria-hidden="true" /> },
  { label: "Security", href: "/dashboard/settings?tab=security", icon: <ShieldCheck size={18} aria-hidden="true" /> },
  { label: "Notifications", href: "/dashboard/settings?tab=notifications", icon: <Bell size={18} aria-hidden="true" /> },
  { label: "API Keys", href: "/dashboard/settings?tab=api-keys", icon: <KeyRound size={18} aria-hidden="true" /> },
  { label: "Billing", href: "/dashboard/settings?tab=billing", icon: <CreditCard size={18} aria-hidden="true" /> },
  { label: "Team", href: "/dashboard/settings?tab=team", icon: <Users size={18} aria-hidden="true" /> },
  { label: "Danger Zone", href: "/dashboard/settings?tab=danger", icon: <TriangleAlert size={18} aria-hidden="true" /> },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="min-w-0 space-y-6">
      {/* Settings header */}
      <header className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-6 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:px-6">
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
            className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#0D0C22]">Navigation</p>
              <span
                className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
                style={{ background: BRAND.secondaryBackground, color: BRAND.mutedText, borderColor: BRAND.border }}
              >
                Dashboard
              </span>
            </div>

            <ul className="mt-4 space-y-1" role="list">
              {navItems.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 rounded-[1.25rem] px-3 py-2 text-sm font-medium text-[#6E6D7A] transition hover:bg-[#F6F8FB] hover:text-[#0D0C22] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] text-[#2563EB] transition group-hover:border-[#2563EB]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Active-route hint (no JS needed) */}
            <div className="mt-5 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Active routes</p>
              <ul className="mt-2 space-y-1 text-sm text-[#6E6D7A]">
                <li>
                  <span className="font-semibold text-[#0D0C22]">/dashboard/settings</span>
                </li>
                <li>
                  <span className="font-semibold text-[#0D0C22]">/dashboard/settingsAction</span>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-8 min-w-0">{children}</main>
      </div>

      {/* Accessible navigation: mobile note */}
      <div className="lg:hidden sr-only" aria-live="polite">
        Settings navigation is available on desktop in a sidebar.
      </div>
    </div>
  );
}

