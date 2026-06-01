import type React from "react";

export default function ReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tabs = [
    { label: "All Reports", href: "/dashboard/reports" },
    { label: "Generated", href: "/dashboard/reports?tab=generated" },
    { label: "Drafts", href: "/dashboard/reports?tab=drafts" },
    { label: "Shared", href: "/dashboard/reports?tab=shared" },
    { label: "Archived", href: "/dashboard/reports?tab=archived" },
  ] as const;

  return (
    <div className="min-w-0">
      {/* Reports-specific header */}
      <section className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-6 shadow-[0_24px_64px_rgba(13,12,34,0.04)] sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              Reports
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22] sm:text-3xl">
              Reports
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6E6D7A]">
              View, filter, export, and manage audit-ready resume analysis reports.
            </p>
          </div>
        </div>

        {/* Optional Tabs */}
        <div className="mt-6">
          <div
            role="tablist"
            aria-label="Report filters"
            className="flex flex-wrap gap-2 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] p-2"
          >
            {tabs.map((tab) => (
              <a
                key={tab.label}
                href={tab.href}
                role="tab"
                aria-selected={false}
                className="rounded-2xl px-3 py-2 text-sm font-medium text-[#6E6D7A] transition hover:bg-[#FFFFFF] hover:text-[#0D0C22]"
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Nested pages */}
      <main className="mt-6 min-w-0">{children}</main>
    </div>
  );
}

