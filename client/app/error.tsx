"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  const message = useMemo(() => {
    const msg = error?.message;
    return typeof msg === "string" && msg.trim().length > 0
      ? msg
      : "Unknown error";
  }, [error]);

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden bg-[#FFFFFF] text-[#0D0C22]"
      role="presentation"
    >
      {/* Premium backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 550px at 50% -120px, rgba(37, 99, 235, 0.16), transparent 55%), radial-gradient(850px 480px at 10% 30%, rgba(239, 68, 68, 0.08), transparent 50%), radial-gradient(900px 520px at 90% 35%, rgba(37, 99, 235, 0.08), transparent 55%)",
        }}
      />

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-4" role="main">
        <section
          className="w-full max-w-xl"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="rounded-2xl border border-[#E5E7EB] bg-white/80 p-6 shadow-[0_25px_80px_-45px_rgba(13,12,34,0.55)] backdrop-blur">
            {/* Badge */}
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EF4444]/10 ring-1 ring-[#EF4444]/25"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 9v4"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 17h.01"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Something Went Wrong</p>
                <p className="text-xs text-[#6E6D7A]">We couldn’t complete that request.</p>
              </div>
            </div>

            {/* Heading + description */}
            <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-[#0D0C22]">
              We couldn’t complete that request
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">
              An unexpected error occurred while processing your request.
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-18px_rgba(37,99,235,0.9)] ring-1 ring-[#2563EB]/30 transition hover:brightness-105 active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex w-full items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#0D0C22] shadow-sm transition hover:bg-[#F9FAFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
                Go Home
              </button>
            </div>

            {/* Developer details (collapsible) */}
            <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#0D0C22]/[0.02] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">Developer details</p>
                  <p className="text-xs text-[#6E6D7A]">Only the message is shown.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDetails((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#0D0C22] ring-1 ring-[#E5E7EB] transition hover:bg-[#F9FAFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                  aria-expanded={showDetails}
                >
                  {showDetails ? "Hide" : "Show"}
                  <span aria-hidden="true" className="text-[#2563EB]">
                    {showDetails ? "▲" : "▼"}
                  </span>
                </button>
              </div>

              <div
                className={
                  showDetails
                    ? "mt-3"
                    : "mt-3 hidden"
                }
              >
                <pre
                  className="max-h-40 overflow-auto rounded-lg bg-white p-3 text-xs text-[#0D0C22]/90 ring-1 ring-[#E5E7EB]"
                  aria-label="Error message details"
                >
                  {message}
                </pre>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-[#6E6D7A]">
              If this keeps happening, try again later.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
