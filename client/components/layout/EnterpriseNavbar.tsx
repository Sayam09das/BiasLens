"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Menu,
  Search,
  Sun,
  Moon,
  ChevronDown,
  User,
  Shield,
  BookOpen,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type EnterpriseNavbarProps = {
  /** Optional hook for sidebar toggle in parent layout */
  onSidebarToggle?: () => void;
  /** Optional unread count for notifications */
  notificationsUnreadCount?: number;
  /** User display name */
  userName?: string;
  /** User initials */
  userInitials?: string;
  /** User role badge */
  userRole?: string;
};

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}

function useResolvedTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Read theme from DOM first; then update React state once.
    const root = document.documentElement;
    const existing = root.getAttribute("data-theme");

    const resolved: "light" | "dark" =
      existing === "dark" || existing === "light"
        ? existing
        : window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    // Schedule a single state update after the effect flushes.
    queueMicrotask(() => setTheme(resolved));
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  };

  return { theme, toggle };
}

export default function EnterpriseNavbar({
  onSidebarToggle,
  notificationsUnreadCount = 3,
  userName = "Sayam Das",
  userInitials,
}: EnterpriseNavbarProps) {
  const { theme, toggle } = useResolvedTheme();

  const initials = useMemo(
    () => (userInitials ? userInitials : getInitials(userName)),
    [userInitials, userName],
  );

  const isDark = theme === "dark";

  return (
    <header
      className="sticky top-0 z-50 w-full"
      role="banner"
      style={{
        // Keep explicit palette per request; allow slight dark-mode contrast.
        background: isDark ? "rgba(13,12,34,0.78)" : "rgba(255,255,255,0.78)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${isDark ? "rgba(231,234,243,0.12)" : "#E7EAF3"}`,
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Left: sidebar + logo */}
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-10 rounded-2xl border border-[rgba(231,234,243,1)]/80 bg-white/60 p-0 hover:bg-white"
            aria-label="Toggle sidebar"
            onClick={onSidebarToggle}
          >
            <Menu size={18} aria-hidden="true" />
          </Button>

          <Link
            href="/"
            className="group inline-flex items-center gap-2"
            aria-label="BiasLens home"
          >
            <span
              aria-hidden="true"
              className="relative grid h-9 w-9 place-items-center rounded-2xl border"
              style={{
                borderColor: isDark ? "rgba(37,99,235,0.35)" : "rgba(231,234,243,1)",
                background: isDark ? "rgba(37,99,235,0.14)" : "rgba(37,99,235,0.06)",
              }}
            >
              <span
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(37,99,235,0.35), transparent 55%)",
                }}
              />
              <span className="relative text-[color:#2563EB]" style={{ color: "#2563EB" }}>
                {/* Minimal inline logo mark */}
                <span className="sr-only">BiasLens</span>
                <svg width="18" height="18" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.2 28.6V15.4C10.2 13.8 11.5 12.5 13.1 12.5H30.9C32.5 12.5 33.8 13.8 33.8 15.4V28.6C33.8 30.2 32.5 31.5 30.9 31.5H13.1C11.5 31.5 10.2 30.2 10.2 28.6Z"
                    stroke="rgba(13,12,34,0.28)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M14.2 29V16.8C14.2 15.9 14.9 15.2 15.8 15.2H28.6C29.5 15.2 30.2 15.9 30.2 16.8V29"
                    stroke="#2563EB"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>

            <span className="hidden text-sm font-semibold tracking-tight text-[#0D0C22] sm:inline-flex">
              BiasLens
            </span>
          </Link>
        </div>

        {/* Center: search */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-[620px]">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: "#6E6D7A" }}
            />
            <input
              type="search"
              aria-label="Search audits, reports, resumes"
              placeholder="Search audits, reports, resumes…"
              className="h-11 w-full rounded-2xl border px-12 text-[color:#0D0C22] shadow-sm transition placeholder:text-[#6E6D7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              style={{
                borderColor: "#E7EAF3",
                background: isDark ? "rgba(13,12,34,0.5)" : "rgba(255,255,255,0.9)",
                color: isDark ? "#FFFFFF" : "#0D0C22",
              }}
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <span
                className="hidden items-center gap-2 rounded-md border bg-white/70 px-2 py-1 text-xs text-[#6E6D7A] shadow-sm sm:inline-flex"
                style={{
                  borderColor: isDark ? "rgba(231,234,243,0.14)" : "#E7EAF3",
                  background: isDark ? "rgba(13,12,34,0.35)" : "rgba(255,255,255,0.7)",
                }}
              >
                ⌘K
              </span>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Notifications */}
          <Button
            type="button"
            variant="ghost"
            className="relative h-11 w-11 rounded-2xl border bg-white/60 hover:bg-white"
            style={{ borderColor: "#E7EAF3" }}
            aria-label="Notifications"
          >
            <Bell size={18} aria-hidden="true" style={{ color: "#0D0C22" }} />
            {notificationsUnreadCount > 0 ? (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#2563EB] px-1 text-[11px] font-semibold text-white"
              >
                {notificationsUnreadCount}
              </span>
            ) : null}
          </Button>

          {/* Theme toggle */}
          <Button
            type="button"
            variant="ghost"
            className="h-11 w-11 rounded-2xl border bg-white/60 hover:bg-white"
            style={{ borderColor: "#E7EAF3" }}
            aria-label="Toggle theme"
            onClick={toggle}
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-2xl border bg-white/60 px-2 hover:bg-white"
                style={{ borderColor: "#E7EAF3" }}
                aria-label="User profile menu"
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 place-items-center rounded-full bg-[#2563EB]/10 ring-1"
                    style={{ borderColor: "rgba(37,99,235,0.25)" }}
                  >
                    <span className="text-sm font-semibold" style={{ color: "#2563EB" }}>
                      {initials}
                    </span>
                  </span>
                  <span className="hidden flex-col items-start leading-tight sm:flex">
                    <span className="text-xs font-semibold" style={{ color: "#0D0C22" }}>
                      Sayam Das
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: "#6E6D7A" }}>
                      Admin
                    </span>
                  </span>
                  <ChevronDown aria-hidden="true" size={16} style={{ color: "#6E6D7A" }} />
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="p-1">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="w-full"
                onClick={() => {
                  // Placeholder – wire to auth routes.
                }}
              >
                <span className="flex w-full items-center gap-2">
                  <User size={14} aria-hidden="true" /> My Profile
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="w-full"
                onClick={() => {
                  // Placeholder – wire to auth routes.
                }}
              >
                <span className="flex w-full items-center gap-2">
                  <SettingsIcon /> Account Settings
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="w-full"
                onClick={() => {
                  // Placeholder – wire to auth routes.
                }}
              >
                <span className="flex w-full items-center gap-2">
                  <Shield size={14} aria-hidden="true" /> Security
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="w-full"
                onClick={() => {
                  // Placeholder – wire to docs route.
                }}
              >
                <span className="flex w-full items-center gap-2">
                  <BookOpen size={14} aria-hidden="true" /> Documentation
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="w-full text-[color:var(--foreground)]"
                onClick={() => {
                  // Placeholder: integrate logout.
                  // window.location.href = "/logout";
                }}
              >
                <span className="flex w-full items-center gap-2">
                  <LogOut size={14} aria-hidden="true" /> Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15C19.6 14.5 19.8 14 19.8 13.4C19.8 12.8 19.6 12.3 19.4 11.8L20.5 10.7C20.8 10.4 20.8 9.9 20.5 9.6L18.4 7.5C18.1 7.2 17.6 7.2 17.3 7.5L16.2 8.6C15.7 8.4 15.2 8.2 14.6 8.2C14 8.2 13.5 8.4 13 8.6L11.9 7.5C11.6 7.2 11.1 7.2 10.8 7.5L8.7 9.6C8.4 9.9 8.4 10.4 8.7 10.7L9.8 11.8C9.6 12.3 9.4 12.8 9.4 13.4C9.4 14 9.6 14.5 9.8 15L8.7 16.1C8.4 16.4 8.4 16.9 8.7 17.2L10.8 19.3C11.1 19.6 11.6 19.6 11.9 19.3L13 18.2C13.5 18.4 14 18.6 14.6 18.6C15.2 18.6 15.7 18.4 16.2 18.2L17.3 19.3C17.6 19.6 18.1 19.6 18.4 19.3L20.5 17.2C20.8 16.9 20.8 16.4 20.5 16.1L19.4 15Z"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </svg>
  );
}

