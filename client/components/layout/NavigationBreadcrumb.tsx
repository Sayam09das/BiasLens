"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type NavigationBreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function NavigationBreadcrumb({
  items,
  className,
}: NavigationBreadcrumbProps) {
  const safeItems = (items ?? []).filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        "flex min-w-0 items-center gap-2 text-sm text-[#6E6D7A] " +
        (className ?? "")
      }
    >
      {/* Home icon */}
      <Link
        href="/"
        aria-label="Go to home"
        className="inline-flex items-center justify-center rounded-md border border-[#E7E7E9] bg-white/60 p-1 text-[#0D0C22]/80 shadow-sm transition hover:bg-white hover:text-[#0D0C22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
      >
        <Home size={14} aria-hidden="true" />
      </Link>

      {/* Chevron + items */}
      {safeItems.map((item, idx) => {
        const isLast = idx === safeItems.length - 1;

        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            <ChevronRight
              aria-hidden="true"
              size={14}
              className="text-[#6E6D7A]/80"
            />

            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="min-w-0 truncate rounded-md px-1 py-0.5 text-[#6E6D7A] transition hover:text-[#0D0C22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="min-w-0 truncate rounded-md px-1 py-0.5 text-[#0D0C22]"
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

