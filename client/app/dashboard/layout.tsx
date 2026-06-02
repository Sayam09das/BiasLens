"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Brain,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
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
  User,
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
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useAuditStore } from "@/store/audit.store";

/* ─────────────────────────────────────────────
   Nav config
───────────────────────────────────────────── */
const NAV_MAIN = [
  { label: "Dashboard",      href: "/dashboard",                icon: LayoutDashboard, badge: null },
  { label: "Audits",         href: "/dashboard/audits",         icon: FileText,        badge: 12   },
  { label: "Fairness",       href: "/dashboard/fairness",       icon: Scale,           badge: null },
  { label: "Explainability", href: "/dashboard/explainability", icon: Brain,           badge: null },
  { label: "Reports",        href: "/dashboard/reports",        icon: ShieldCheck,     badge: 3    },
];
const NAV_SYSTEM = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings,   badge: null },
  { label: "Help",     href: "/dashboard/help",     icon: HelpCircle, badge: null },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

/* Framer spring presets */
const SPRING_SNAPPY = { type: "spring", stiffness: 380, damping: 28 } as const;
const SPRING_SMOOTH = { type: "spring", stiffness: 260, damping: 26 } as const;

/* Sidebar width tokens */
const SIDEBAR_OPEN_W   = 248;
const SIDEBAR_CLOSED_W = 68;

/* ─────────────────────────────────────────────
   NavItem — shared between desktop & mobile
───────────────────────────────────────────── */
function NavItem({
  link,
  isActive,
  collapsed,
  onClick,
}: {
  link: (typeof NAV_MAIN)[number];
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = link.icon;
  return (
    <Link href={link.href} onClick={onClick} className="block outline-none">
      <motion.div
        className={[
          "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-[#1463ff] text-white"
            : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]",
        ].join(" ")}
        whileHover={{ x: isActive ? 0 : 2 }}
        whileTap={{ scale: 0.97 }}
        transition={SPRING_SNAPPY}
      >
        {/* Active left bar */}
        {isActive && (
          <motion.span
            layoutId="activeBar"
            className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white/60"
            transition={SPRING_SMOOTH}
          />
        )}

        {/* Icon */}
        <span
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
            isActive
              ? "bg-white/20"
              : "bg-[#f1f5f9] text-[#1463ff] group-hover:bg-[#dbe8ff]",
          ].join(" ")}
        >
          <Icon size={16} strokeWidth={2} />
        </span>

        {/* Label + badge */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              className="flex min-w-0 flex-1 items-center justify-between"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
            >
              <span className="truncate">{link.label}</span>
              {link.badge != null && (
                <span
                  className={[
                    "ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-[#1463ff]/10 text-[#1463ff]",
                  ].join(" ")}
                >
                  {link.badge}
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   SidebarContent
───────────────────────────────────────────── */
function SidebarContent({
  pathname,
  collapsed,
  onNavigate,
  avatarText,
  avatarImage,
  displayName,
  displayRole,
  onLogout,
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate: () => void;
  avatarText: string;
  avatarImage: string | null;
  displayName: string;
  displayRole: string;
  onLogout: () => void;
}) {
  const router = useRouter();

  const navigateMenu = (href: string) => {
    onNavigate();
    router.push(href);
  };

  return (
    <div className="flex h-full flex-col">

      {/* ── Logo ── */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 pb-6 pt-2 outline-none"
      >
        <motion.span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1463ff] text-sm font-bold text-white shadow-[0_8px_20px_rgba(20,99,255,0.35)]"
          whileHover={{ scale: 1.08, rotate: -3 }}
          whileTap={{ scale: 0.94 }}
          transition={SPRING_SNAPPY}
        >
          B
        </motion.span>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="min-w-0"
            >
              <p className="text-sm font-bold tracking-tight text-[#0f172a]">BiasLens</p>
              <p className="text-[11px] text-[#94a3b8]">AI Resume Auditing</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* ── Nav ── */}
      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3">

        {/* Section: Main */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.p
              className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              Main menu
            </motion.p>
          )}
        </AnimatePresence>

        {NAV_MAIN.map((link, i) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: 0.05 + i * 0.04, ease: "easeOut" }}
          >
            <NavItem
              link={link}
              isActive={pathname === link.href}
              collapsed={collapsed}
              onClick={onNavigate}
            />
          </motion.div>
        ))}

        {/* Section: System */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.p
              className="mb-1 mt-5 px-1 text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              System
            </motion.p>
          )}
        </AnimatePresence>
        {!collapsed && <div className="mb-1 mt-3" />}

        {NAV_SYSTEM.map((link, i) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: 0.25 + i * 0.04, ease: "easeOut" }}
          >
            <NavItem
              link={link}
              isActive={pathname === link.href}
              collapsed={collapsed}
              onClick={onNavigate}
            />
          </motion.div>
        ))}
      </nav>

      {/* ── AI status card ── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            className="mx-3 mb-4 mt-4 rounded-xl border border-[#dbe8ff] bg-gradient-to-br from-[#f0f5ff] to-[#e8f0ff] p-3"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0f172a]">
              <Sparkles size={13} className="text-[#1463ff]" />
              AI fairness status
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#475569]">
              All active hiring audits are within configured thresholds.
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold text-[#15803d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#15803d]" />
              All systems healthy
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── User profile ── */}
      <div className="border-t border-[#f1f5f9] px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <motion.button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 outline-none transition-colors hover:bg-[#f1f5f9]"
              whileHover={{ x: 1 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING_SNAPPY}
              aria-label="User menu"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#1463ff] to-[#4f46e5] text-xs font-bold text-white shadow-[0_2px_8px_rgba(20,99,255,0.3)]">
                {avatarImage ? (
                  <Image
                    src={avatarImage}
                    alt={`${displayName} avatar`}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  avatarText
                )}
              </span>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    className="flex min-w-0 flex-1 flex-col text-left"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span className="truncate text-xs font-semibold text-[#0f172a]">{displayName}</span>
                    <span className="text-[10px] text-[#94a3b8]">{displayRole}</span>
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && (
                <ChevronDown size={13} className="shrink-0 text-[#94a3b8]" />
              )}
            </motion.button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mb-1 w-52 rounded-xl">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigateMenu("/dashboard/settings?tab=profile") }>
              <User size={13} className="mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigateMenu("/dashboard/settings?tab=account") }>
              <Settings size={13} className="mr-2" /> Account settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigateMenu("/dashboard/settings/security") }>
              <ShieldCheck size={13} className="mr-2" /> Security
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={onLogout}>
              <LogOut size={13} className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Breadcrumb
───────────────────────────────────────────── */
function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.replace(/^\/dashboard/, "").split("/").filter(Boolean);
  return (
    <nav className="flex items-center gap-1 text-xs text-[#94a3b8]">
      <Link href="/dashboard" className="hover:text-[#1463ff] transition-colors">
        Dashboard
      </Link>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const href = "/dashboard/" + segments.slice(0, i + 1).join("/");
        return (
          <span key={seg} className="flex items-center gap-1">
            <ChevronRight size={11} />
            {isLast ? (
              <span className="font-medium text-[#1463ff]">
                {seg.charAt(0).toUpperCase() + seg.slice(1)}
              </span>
            ) : (
              <Link href={href} className="hover:text-[#1463ff] transition-colors capitalize">
                {seg}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   Root layout
───────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const { user, status, logout, refresh } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed, theme, setTheme, profileAvatar } = useUIStore();
  const fetchHistory = useAuditStore((s) => s.fetchHistory);
  const { data: notificationSummary, refresh: refreshNotifications } = useNotifications(
    30000,
    status === "authenticated",
  );

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "authenticated") fetchHistory();
  }, [status, fetchHistory]);

  /* Keyboard shortcut: ⌘K / Ctrl+K → focus search */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const displayName = user?.fullName ?? "—";
  const displayRole = user?.role    ?? "—";
  const avatarText  = user ? initials(user.fullName) : "—";

  /* Page title from pathname */
  const pageTitle = (() => {
    const seg = pathname.replace(/^\/dashboard\/?/, "").split("/")[0];
    if (!seg) return "Overview";
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  })();

  return (
    <AuthGuard
      redirectTo="/login"
      isAuthenticated={
        status === "authenticated" ? true
        : status === "unauthenticated" ? false
        : undefined
      }
    >
      <div className={theme === "dark" ? "dark" : ""}>
        <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-[#0f172a]">

          {/* ══════════════════════════════════════
              DESKTOP SIDEBAR — always left
          ══════════════════════════════════════ */}
          <motion.aside
            className="relative hidden flex-col overflow-hidden border-r border-[#e2e8f0] bg-white lg:flex"
            animate={{ width: sidebarCollapsed ? SIDEBAR_CLOSED_W : SIDEBAR_OPEN_W }}
            transition={SPRING_SMOOTH}
          >
            <SidebarContent
              pathname={pathname}
              collapsed={sidebarCollapsed}
              onNavigate={() => {}}
              avatarText={avatarText}
              avatarImage={profileAvatar}
              displayName={displayName}
              displayRole={displayRole}
              onLogout={handleLogout}
            />

            {/* Collapse toggle pill */}
            <motion.button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-3.5 top-[72px] z-20 flex h-7 w-7 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b] shadow-sm transition-colors hover:border-[#1463ff] hover:bg-[#1463ff] hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={SPRING_SNAPPY}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <motion.span
                animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                transition={SPRING_SMOOTH}
                className="flex items-center justify-center"
              >
                <ChevronLeft size={13} strokeWidth={2.5} />
              </motion.span>
            </motion.button>
          </motion.aside>

          {/* ══════════════════════════════════════
              MOBILE DRAWER OVERLAY
          ══════════════════════════════════════ */}
          <AnimatePresence>
            {/* Backdrop */}
            {/* sidebarCollapsed doubles as mobileOpen on mobile — rename if your store supports it */}
          </AnimatePresence>

          {/* We use a separate boolean pattern for mobile.
              The mobile drawer uses sidebarCollapsed=true to mean "mobile open". */}
          <AnimatePresence>
            {sidebarCollapsed && (
              <>
                <motion.div
                  key="overlay"
                  className="fixed inset-0 z-40 bg-[#0f172a]/30 backdrop-blur-[2px] lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSidebarCollapsed(false)}
                />
                <motion.aside
                  key="drawer"
                  className="fixed left-0 top-0 z-50 flex h-full flex-col border-r border-[#e2e8f0] bg-white lg:hidden"
                  style={{ width: SIDEBAR_OPEN_W }}
                  initial={{ x: -SIDEBAR_OPEN_W }}
                  animate={{ x: 0 }}
                  exit={{ x: -SIDEBAR_OPEN_W }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Close btn */}
                  <button
                    type="button"
                    onClick={() => setSidebarCollapsed(false)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#64748b] transition-colors hover:bg-[#f1f5f9]"
                    aria-label="Close menu"
                  >
                    <X size={15} />
                  </button>
                  <SidebarContent
                    pathname={pathname}
                    collapsed={false}
                    onNavigate={() => setSidebarCollapsed(false)}
                    avatarText={avatarText}
                    avatarImage={profileAvatar}
                    displayName={displayName}
                    displayRole={displayRole}
                    onLogout={handleLogout}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════
              RIGHT SIDE: Topbar + Content
          ══════════════════════════════════════ */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

            {/* ── TOPBAR ── */}
            <motion.header
              className="flex h-14 shrink-0 items-center gap-3 border-b border-[#e2e8f0] bg-white/90 px-4 backdrop-blur-sm sm:h-16 sm:px-6"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Mobile hamburger */}
              <motion.div className="lg:hidden" whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setSidebarCollapsed(true)}
                  aria-label="Open menu"
                >
                  <Menu size={18} />
                </Button>
              </motion.div>

              {/* Page title + breadcrumb */}
              <div className="min-w-0">
                <div className="hidden sm:block">
                  <Breadcrumb pathname={pathname} />
                </div>
                <h1 className="truncate text-base font-bold tracking-tight text-[#0f172a] sm:text-lg">
                  {pageTitle}
                </h1>
              </div>

              {/* Search — center */}
              <div className="mx-auto hidden w-full max-w-xs sm:max-w-sm md:flex lg:max-w-md xl:max-w-lg">
                <motion.div
                  className="flex w-full items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 transition-colors focus-within:border-[#1463ff]/40 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(20,99,255,0.08)]"
                  whileFocus={{ scale: 1.01 }}
                >
                  <Search size={14} className="shrink-0 text-[#94a3b8]" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search audits, resumes, reports…"
                    className="w-full bg-transparent text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                  />
                  <kbd className="hidden rounded-md border border-[#e2e8f0] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#94a3b8] lg:block">
                    ⌘K
                  </kbd>
                </motion.div>
              </div>

              {/* Right actions */}
              <div className="ml-auto flex items-center gap-1.5 sm:gap-2">

                {/* Mobile search */}
                <motion.div
                  className="md:hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" aria-label="Search">
                    <Search size={16} />
                  </Button>
                </motion.div>

                {/* Bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <motion.button
                      type="button"
                      className="relative flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-[#f8fafc]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.93 }}
                      aria-label="Notifications"
                    >
                      <Bell size={16} />
                      {notificationSummary?.unreadCount ? (
                        <motion.span
                          className="absolute right-1.5 top-1.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1463ff] px-1 text-[10px] font-semibold text-white ring-2 ring-white"
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                        >
                          {notificationSummary.unreadCount > 9 ? "9+" : notificationSummary.unreadCount}
                        </motion.span>
                      ) : null}
                    </motion.button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-80 rounded-xl">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      <button
                        type="button"
                        onClick={() => void refreshNotifications()}
                        className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1463ff]"
                      >
                        Refresh
                      </button>
                    </DropdownMenuLabel>
                    <div className="max-h-80 overflow-y-auto">
                      {notificationSummary?.items?.length ? (
                        notificationSummary.items.slice(0, 5).map((item) => (
                          <div key={item.id} className="rounded-xl px-3 py-2.5 hover:bg-[#f8fafc]">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-[#0f172a]">{item.title}</p>
                              <span className="text-[11px] text-[#94a3b8]">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-1 text-xs leading-5 text-[#64748b]">{item.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-sm text-[#64748b]">
                          No recent notifications right now.
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard/settings?tab=notifications")}>
                      <Bell size={13} className="mr-2" />
                      Notification settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme toggle */}
                <motion.div
                  className="hidden sm:block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {theme === "dark" ? (
                        <motion.div
                          key="sun"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Sun size={16} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Moon size={16} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* Divider */}
                <span className="mx-0.5 hidden h-6 w-px bg-[#e2e8f0] sm:block" />

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <motion.button
                      type="button"
                      className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-1.5 pl-1.5 pr-2.5 text-left outline-none transition-colors hover:border-[#1463ff]/30 hover:bg-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    transition={SPRING_SNAPPY}
                  >
                      <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#1463ff] to-[#4f46e5] text-[11px] font-bold text-white shadow-[0_2px_6px_rgba(20,99,255,0.35)]">
                        {profileAvatar ? (
                          <Image
                            src={profileAvatar}
                            alt={`${displayName} avatar`}
                            width={28}
                            height={28}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          avatarText
                        )}
                      </span>
                      <span className="hidden min-w-0 sm:block">
                        <span className="block max-w-[100px] truncate text-[12px] font-semibold text-[#0f172a]">
                          {displayName}
                        </span>
                        <span className="block text-[10px] text-[#94a3b8]">{displayRole}</span>
                      </span>
                      <ChevronDown size={12} className="hidden shrink-0 text-[#94a3b8] sm:block" />
                    </motion.button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-52 rounded-xl">
                    <DropdownMenuLabel className="text-xs">My account</DropdownMenuLabel>
                    <DropdownMenuItem className="text-sm">
                      <Link href="/dashboard/settings?tab=profile" className="flex items-center">
                        <User size={13} className="mr-2" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">
                      <Link href="/dashboard/settings?tab=account" className="flex items-center">
                        <Settings size={13} className="mr-2" /> Account settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">
                      <Link href="/dashboard/settings/security" className="flex items-center">
                        <ShieldCheck size={13} className="mr-2" /> Security
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-sm text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut size={13} className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.header>

            {/* ── PAGE CONTENT ── */}
            <motion.main
              className="flex-1 overflow-y-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                {children}
              </div>
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
