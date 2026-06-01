"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Search,
  Settings,
  Sparkles,
  User,
  KeyRound,
  CreditCard,
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
import { cn } from "@/lib/utils";

export type NavigationCrumb = {
  label: string;
  href?: string;
};

export type DashboardHeaderProps = {
  title: string;
  description: string;
  breadcrumbs?: NavigationCrumb[];
  statusBadge?: {
    label: string;
    tone?: "primary" | "danger" | "muted";
  };
};

function Breadcrumbs({ breadcrumbs }: { breadcrumbs: NavigationCrumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-2 text-sm text-[color:var(--foreground-muted)]"
    >
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={`${crumb.label}-${idx}`}>
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="truncate rounded-md px-1 py-0.5 transition hover:text-[color:var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={cn("truncate", isLast && "text-[color:var(--foreground)]")}> {crumb.label}</span>
            )}
            {!isLast && (
              <span aria-hidden="true" className="text-[color:var(--foreground-muted)]/80">
                /
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function SearchShortcut() {
  return (
    <span className="hidden items-center gap-2 text-xs text-[color:var(--foreground-muted)] sm:inline-flex">
      <span aria-hidden="true" className="rounded-md border border-[color:var(--border)] bg-white px-2 py-1 shadow-sm">
        ⌘K
      </span>
    </span>
  );
}

export default function DashboardHeader({
  title,
  description,
  breadcrumbs = [
    { label: "Dashboard", href: "/app" },
    { label: title },
  ],
  statusBadge,
}: DashboardHeaderProps) {
  const [query, setQuery] = useState("");

  const badgeTone = statusBadge?.tone ?? "primary";
  const badgeClass =
    badgeTone === "danger"
      ? "border-[#EF4444]/35 bg-[#EF4444]/10 text-[#B91C1C]"
      : badgeTone === "muted"
        ? "border-[color:var(--border)] bg-[color:var(--background-secondary)] text-[color:var(--foreground-muted)]"
        : "border-[#2563EB]/35 bg-[#2563EB]/10 text-[#1D4ED8]";

  const badgeDotClass =
    badgeTone === "danger"
      ? "bg-[#EF4444]"
      : badgeTone === "muted"
        ? "bg-[color:var(--foreground-muted)]"
        : "bg-[#2563EB]";

  const crumbs = useMemo(() => breadcrumbs.filter(Boolean), [breadcrumbs]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[color:var(--border)] bg-white/70 backdrop-blur-xl"
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          {/* Left */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-pretty text-lg font-semibold tracking-tight text-[color:var(--foreground)] sm:text-xl">
                  {title}
                </h1>
                <p className="mt-1 line-clamp-2 text-sm text-[color:var(--foreground-muted)]">
                  {description}
                </p>

                <div className="mt-2">
                  {crumbs.length > 0 ? <Breadcrumbs breadcrumbs={crumbs} /> : null}
                </div>
              </div>

              {statusBadge ? (
                <div
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                    badgeClass,
                  )}
                  role="status"
                  aria-label={statusBadge.label}
                >
                  <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", badgeDotClass)} />
                  {statusBadge.label}
                </div>
              ) : null}
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex w-full items-center justify-start lg:justify-center">
            <div className="relative w-full max-w-xl">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--foreground-muted)]/80"
                size={18}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search audits, reports, or insights…"
                aria-label="Global search"
                className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-white/75 pl-10 pr-24 text-[color:var(--foreground)] shadow-sm transition placeholder:text-[color:var(--foreground-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                    e.preventDefault();
                  }
                  if (e.key === "Enter") {
                    // Placeholder: wire to real search later.
                  }
                }}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <SearchShortcut />
                <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-[color:var(--border)] bg-white/60">
                  <Sparkles className="text-[#2563EB]" size={16} />
                </span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center justify-end gap-2 lg:gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-11 w-11 rounded-2xl border border-[color:var(--border)] bg-white/70 hover:bg-white"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="hidden h-11 w-11 rounded-2xl border border-[color:var(--border)] bg-white/70 hover:bg-white sm:flex"
              aria-label="Theme"
            >
              <Moon size={18} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 rounded-2xl border border-[color:var(--border)] bg-white/70 px-2 hover:bg-white"
                  aria-label="User menu"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB]/10 ring-1 ring-[#2563EB]/25"
                    >
                      <User size={16} className="text-[#2563EB]" />
                    </span>
                    <ChevronDown aria-hidden="true" size={16} className="text-[color:var(--foreground-muted)]" />
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="p-1">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="w-full">
                  <Link href="/account/profile" className="flex w-full items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <User size={14} aria-hidden="true" />
                      Profile
                    </span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="w-full">
                  <Link href="/account/settings" className="flex w-full items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <Settings size={14} aria-hidden="true" />
                      Settings
                    </span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="w-full">
                  <Link href="/account/api-keys" className="flex w-full items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <KeyRound size={14} aria-hidden="true" />
                      API Keys
                    </span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="w-full">
                  <Link href="/account/billing" className="flex w-full items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <CreditCard size={14} aria-hidden="true" />
                      Billing
                    </span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="w-full text-[color:var(--foreground)]"
                  onClick={() => {
                    // Placeholder: hook into auth logout.
                    // window.location.href = "/logout";
                  }}
                >
                  <span className="flex w-full items-center gap-2">
                    <LogOut size={14} aria-hidden="true" />
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile: quick shortcuts row */}
        <div className="mt-3 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2 text-xs text-[color:var(--foreground-muted)]">
            <span aria-hidden="true" className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB]/70" />
            <span>Search</span>
            <span aria-hidden="true">•</span>
            <span>Cmd/⌘ K</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-2xl border border-[color:var(--border)] bg-white/70 px-3 hover:bg-white"
              aria-label="Notifications"
            >
              <Bell size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

