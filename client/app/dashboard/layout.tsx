"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  LogOut,
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
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Audit Queue", href: "/dashboard", icon: FolderKanban },
  { label: "Trust Center", href: "/dashboard", icon: ShieldCheck },
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
          <aside className="hidden w-72 shrink-0 lg:block">
            <Card className="sticky top-4 rounded-[2rem] border-[#E7E7E9] bg-white/88 p-4 shadow-[0_24px_64px_rgba(13,12,34,0.08)] backdrop-blur">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-4"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-[0_16px_36px_rgba(37,99,235,0.28)]">
                  B
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">BiasLens</p>
                  <p className="text-xs text-[#6E6D7A]">Protected Workspace</p>
                </div>
              </Link>

              <div className="mt-6 space-y-2">
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
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0D0C22]">
                  <Sparkles size={16} className="text-[#2563EB]" />
                  AI fairness status
                </div>
                <p className="mt-2 text-sm leading-6 text-[#45628F]">
                  All active hiring audits are operating within configured review thresholds.
                </p>
              </div>
            </Card>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/88 px-4 py-4 shadow-[0_24px_64px_rgba(13,12,34,0.08)] backdrop-blur sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                    BiasLens Dashboard
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
                    Secure hiring intelligence
                  </h1>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <Button variant="outline" size="icon" className="rounded-2xl">
                    <Bell size={18} />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <button
                        type="button"
                        className="inline-flex items-center gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2.5 text-left"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2563EB] text-sm font-semibold text-white">
                          SD
                        </span>
                        <span className="hidden min-w-0 sm:block">
                          <span className="block text-sm font-semibold text-[#0D0C22]">
                            Sayam Das
                          </span>
                          <span className="block text-xs text-[#6E6D7A]">
                            Workspace owner
                          </span>
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 rounded-[1.25rem]">
                      <DropdownMenuLabel>Workspace Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Profile settings</DropdownMenuItem>
                      <DropdownMenuItem>Security preferences</DropdownMenuItem>
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
                        <span className="ml-2">Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>

            <div className="min-w-0">{children}</div>
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
