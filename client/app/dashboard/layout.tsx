"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sun,
  X,
} from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import SessionTimeout from "@/components/auth/SessionTimeout";
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
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useAuditStore } from "@/store/audit.store";

const sidebarLinks = [
  { label: "Dashboard",      href: "/dashboard",                icon: LayoutDashboard },
  { label: "Audits",         href: "/dashboard/audits",         icon: FileText        },
  { label: "Fairness",       href: "/dashboard/fairness",       icon: Scale           },
  { label: "Explainability", href: "/dashboard/explainability", icon: Brain           },
  { label: "Reports",        href: "/dashboard/reports",        icon: ShieldCheck     },
  { label: "Settings",       href: "/dashboard/settings",       icon: Settings        },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ── Sidebar content ─────────────────────────────────────────────────────── */
function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-4 transition hover:bg-white"
      >
        <motion.span
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1463ff] text-sm font-bold text-white shadow-[0_16px_36px_rgba(20,99,255,0.28)]"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
        >
          B
        </motion.span>
        <div>
          <p className="text-sm font-semibold text-[#101828]">BiasLens</p>
          <p className="text-xs text-[#667085]">AI Resume Auditing</p>
        </div>
      </Link>

      <nav className="mt-6 space-y-1.5">
        {sidebarLinks.map((link, i) => {
          const isActive = pathname === link.href;
          return (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.32, delay: 0.06 + i * 0.05, ease: "easeOut" }}
            >
              <Link
                href={link.href}
                onClick={onNavigate}
                className={
                  "flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium transition " +
                  (isActive
                    ? "bg-[#dbe8ff] text-[#1463ff]"
                    : "text-[#344054] hover:bg-[#F6F8FB] hover:text-[#101828]")
                }
              >
                <motion.span
                  className={
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition " +
                    (isActive
                      ? "bg-[#1463ff] text-white shadow-[0_8px_24px_rgba(20,99,255,0.22)]"
                      : "bg-[#dbe8ff] text-[#1463ff]")
                  }
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <link.icon size={18} />
                </motion.span>
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="ml-auto h-2 w-2 rounded-full bg-[#1463ff]"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.div
        className="mt-8 rounded-[1.5rem] border border-[#dbe8ff] bg-[#f0f5ff] p-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#101828]">
          <Sparkles size={16} className="text-[#1463ff]" />
          AI fairness status
        </div>
        <p className="mt-2 text-sm leading-6 text-[#344054]">
          All active hiring audits are operating within configured review thresholds.
        </p>
      </motion.div>
    </>
  );
}

/* ── Layout ──────────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  // ── stores ──
  const { user, status, bootstrap, logout, refresh } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed, theme, setTheme } = useUIStore();
  const fetchHistory = useAuditStore((s) => s.fetchHistory);

  // Bootstrap auth + prefetch audit history once on mount
  useEffect(() => {
    if (status === "idle") bootstrap();
  }, [status, bootstrap]);

  useEffect(() => {
    if (status === "authenticated") fetchHistory();
  }, [status, fetchHistory]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const displayName = user?.fullName ?? "—";
  const displayRole = user?.role    ?? "—";
  const avatarText  = user ? initials(user.fullName) : "—";

  return (
    <AuthGuard
      redirectTo="/login"
      isAuthenticated={
        status === "authenticated"
          ? true
          : status === "unauthenticated"
            ? false
            : undefined
      }
    >
      <div className="min-h-screen bg-[linear-gradient(180deg,#F8FBFF_0%,#F3F7FC_100%)]">
        {/* Background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(20,99,255,0.14),transparent_58%)]"
        />

        <div className="relative mx-auto flex min-h-screen max-w-7xl gap-4 px-3 py-4 sm:gap-6 sm:px-6 lg:px-8">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden w-64 shrink-0 xl:w-72 lg:block">
            <Card className="sticky top-4 rounded-[2rem] border-[#E7E7E9] bg-white/88 p-4 shadow-[0_24px_64px_rgba(13,12,34,0.08)] backdrop-blur">
              <SidebarContent pathname={pathname} onNavigate={() => {}} />
            </Card>
          </aside>

          {/* ── Mobile overlay ── */}
          <AnimatePresence>
            {sidebarCollapsed && (
              <motion.div
                className="fixed inset-0 z-40 bg-[rgba(13,12,34,0.22)] backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={() => setSidebarCollapsed(false)}
              />
            )}
          </AnimatePresence>

          {/* ── Mobile drawer ── */}
          <AnimatePresence>
            {sidebarCollapsed && (
              <motion.aside
                className="fixed left-0 top-0 z-50 flex h-full w-[80vw] max-w-xs flex-col border-r border-[#E7E7E9] bg-white/96 p-4 shadow-[20px_0_80px_rgba(13,12,34,0.14)] backdrop-blur-2xl lg:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSidebarCollapsed(false)}
                    aria-label="Close menu"
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E7E7E9] text-[#667085] transition hover:bg-[#F6F8FB] hover:text-[#101828]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <SidebarContent
                  pathname={pathname}
                  onNavigate={() => setSidebarCollapsed(false)}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── Main area ── */}
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6">

            {/* ── Topbar ── */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="sticky top-4 z-30 rounded-[2rem] border-[#E7E7E9] bg-white/88 px-3 py-3 shadow-[0_24px_64px_rgba(13,12,34,0.08)] backdrop-blur sm:px-5 sm:py-4">
                <div className="flex items-center justify-between gap-3">

                  {/* Left — hamburger + title */}
                  <div className="flex min-w-0 items-center gap-3">
                    <motion.div whileTap={{ scale: 0.93 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-2xl lg:hidden"
                        onClick={() => setSidebarCollapsed(true)}
                        aria-label="Open menu"
                      >
                        <Menu size={18} />
                      </Button>
                    </motion.div>

                    <div className="hidden sm:block">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1463ff]">
                        BiasLens Dashboard
                      </p>
                      <h1 className="mt-0.5 text-lg font-semibold tracking-[-0.04em] text-[#101828] xl:text-xl">
                        Audit &amp; fairness dashboard
                      </h1>
                    </div>
                  </div>

                  {/* Center — search */}
                  <div className="hidden flex-1 md:flex md:max-w-sm lg:max-w-md xl:max-w-xl">
                    <div className="flex w-full items-center gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 transition focus-within:border-[#1463ff]/40 focus-within:bg-white">
                      <Search size={16} className="shrink-0 text-[#667085]" />
                      <input
                        type="text"
                        placeholder="Search audits, reports, resumes..."
                        className="w-full bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#8A8994]"
                      />
                    </div>
                  </div>

                  {/* Right — actions + user */}
                  <div className="flex items-center gap-2">
                    {/* Notification */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="icon" className="relative rounded-2xl">
                        <Bell size={17} />
                        <motion.span
                          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#1463ff]"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                      </Button>
                    </motion.div>

                    {/* Theme toggle */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden sm:block"
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-2xl"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                      >
                        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                      </Button>
                    </motion.div>

                    {/* User dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="inline-flex items-center gap-2 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-2.5 py-2 text-left transition hover:bg-white sm:gap-3 sm:px-3 sm:py-2.5"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#1463ff] text-xs font-semibold text-white sm:h-10 sm:w-10 sm:text-sm">
                            {avatarText}
                          </span>
                          <span className="hidden min-w-0 sm:block">
                            <span className="block truncate text-sm font-semibold text-[#101828]">
                              {displayName}
                            </span>
                            <span className="block text-xs text-[#667085]">
                              {displayRole}
                            </span>
                          </span>
                          <ChevronDown size={15} className="hidden shrink-0 text-[#667085] sm:block" />
                        </motion.button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-56 rounded-[1.25rem] sm:w-64">
                        <DropdownMenuLabel>Account</DropdownMenuLabel>
                        <DropdownMenuItem>My Profile</DropdownMenuItem>
                        <DropdownMenuItem>Account Settings</DropdownMenuItem>
                        <DropdownMenuItem>Security</DropdownMenuItem>
                        <DropdownMenuItem>Documentation</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-[#B91C1C]"
                          onClick={handleLogout}
                        >
                          <LogOut size={15} />
                          <span className="ml-2">Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* ── Page content ── */}
            <motion.main
              className="min-w-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.main>
          </div>
        </div>

        <SessionTimeout
          timeoutInSeconds={30 * 60}
          warningAtSeconds={90}
          onExtendSession={async () => { await refresh(); }}
          onSessionExpired={handleLogout}
        />
      </div>
    </AuthGuard>
  );
}
