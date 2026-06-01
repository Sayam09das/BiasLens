"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Brain,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import SessionTimeout from "@/components/auth/SessionTimeout";
import { getCurrentSession, logoutSession, refreshAuthSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Audits", href: "/dashboard/audits", icon: FileText },
  { label: "Fairness", href: "/dashboard/fairness", icon: Scale },
  { label: "Explainability", href: "/dashboard/explainability", icon: Brain },
  { label: "Reports", href: "/dashboard/reports", icon: ShieldCheck },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <AuthGuard
      redirectTo="/login"
      checkAuth={async () => {
        try {
          await getCurrentSession();
          return true;
        } catch {
          try {
            await refreshAuthSession();
            return true;
          } catch {
            return false;
          }
        }
      }}
    >
      <div className="min-h-screen bg-[linear-gradient(180deg,#F8FBFF_0%,#F3F7FC_100%)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_58%)]"
        />

        <div className="relative mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
          {/* Sidebar */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <Card className="sticky top-4 rounded-[2rem] border-[#E7E7E9] bg-white/88 p-4 shadow-[0_24px_64px_rgba(13,12,34,0.08)] backdrop-blur">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-4"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB] text-sm font-bold text-white shadow-[0_16px_36px_rgba(37,99,235,0.28)]">
                  B
                </span>

                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    BiasLens
                  </p>
                  <p className="text-xs text-[#6E6D7A]">
                    AI Resume Auditing
                  </p>
                </div>
              </Link>

              <nav className="mt-6 space-y-2">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium text-[#344054] transition hover:bg-[#F6F8FB] hover:text-[#0D0C22]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                      <link.icon size={18} />
                    </span>
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 rounded-[1.5rem] border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0D0C22]">
                  <Sparkles size={16} className="text-[#2563EB]" />
                  AI fairness status
                </div>

                <p className="mt-2 text-sm leading-6 text-[#45628F]">
                  All active hiring audits are operating within configured
                  review thresholds.
                </p>
              </div>
            </Card>
          </aside>

          {/* Main Area */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            {/* Navbar / Header */}
            <Card className="sticky top-4 z-30 rounded-[2rem] border-[#E7E7E9] bg-white/88 px-4 py-4 shadow-[0_24px_64px_rgba(13,12,34,0.08)] backdrop-blur sm:px-6">
              <div className="flex items-center justify-between gap-4">
                {/* Left */}
                <div className="flex min-w-0 items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-2xl lg:hidden"
                  >
                    <Menu size={18} />
                  </Button>

                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                      BiasLens Dashboard
                    </p>
                    <h1 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                      Audit & fairness dashboard
                    </h1>
                  </div>
                </div>

                {/* Search */}
                <div className="hidden min-w-[280px] flex-1 md:flex md:max-w-xl">
                  <div className="flex w-full items-center gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3">
                    <Search size={18} className="text-[#6E6D7A]" />
                    <input
                      type="text"
                      placeholder="Search audits, reports, resumes..."
                      className="w-full bg-transparent text-sm text-[#0D0C22] outline-none placeholder:text-[#8A8994]"
                    />
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-2xl"
                  >
                    <Bell size={18} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#2563EB]" />
                  </Button>

                  <Button variant="outline" size="icon" className="rounded-2xl">
                    <Moon size={18} />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <button
                        type="button"
                        className="inline-flex items-center gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2.5 text-left transition hover:bg-white"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2563EB] text-sm font-semibold text-white">
                          SD
                        </span>

                        <span className="hidden min-w-0 sm:block">
                          <span className="block text-sm font-semibold text-[#0D0C22]">
                            Sayam Das
                          </span>
                          <span className="block text-xs text-[#6E6D7A]">
                            Admin
                          </span>
                        </span>

                        <ChevronDown
                          size={16}
                          className="hidden text-[#6E6D7A] sm:block"
                        />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64 rounded-[1.25rem]">
                      <DropdownMenuLabel>Account</DropdownMenuLabel>

                      <DropdownMenuItem>My Profile</DropdownMenuItem>
                      <DropdownMenuItem>Account Settings</DropdownMenuItem>
                      <DropdownMenuItem>Security</DropdownMenuItem>
                      <DropdownMenuItem>Documentation</DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-[#B91C1C]"
                        onClick={async () => {
                          try {
                            await logoutSession();
                          } finally {
                            router.push("/login");
                          }
                        }}
                      >
                        <LogOut size={16} />
                        <span className="ml-2">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>

            <main className="min-w-0">{children}</main>
          </div>
        </div>

        <SessionTimeout
          timeoutInSeconds={30 * 60}
          warningAtSeconds={90}
          onExtendSession={async () => {
            await refreshAuthSession();
          }}
          onSessionExpired={async () => {
            try {
              await logoutSession();
            } finally {
              router.push("/login");
            }
          }}
        />
      </div>
    </AuthGuard>
  );
}
