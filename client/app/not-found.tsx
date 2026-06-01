import Link from "next/link";

export default function NotFound() {
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
            "radial-gradient(1200px 600px at 50% -120px, rgba(37, 99, 235, 0.14), transparent 58%), radial-gradient(900px 480px at 10% 25%, rgba(37, 99, 235, 0.08), transparent 55%), radial-gradient(900px 520px at 90% 35%, rgba(37, 99, 235, 0.08), transparent 55%)",
        }}
      />

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-4">
        <section
          className="w-full max-w-3xl"
          role="region"
          aria-label="Not found"
        >
          <div className="rounded-3xl border border-[#E5E7EB] bg-white/80 p-6 shadow-[0_25px_90px_-60px_rgba(13,12,34,0.7)] backdrop-blur sm:p-10">
            {/* Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/70 px-4 py-2 shadow-sm">
                <span
                  aria-hidden="true"
                  className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2563EB] shadow-[0_0_0_6px_rgba(37,99,235,0.15)]"
                />
                <span className="text-sm font-semibold text-[#0D0C22]">404 Error</span>
              </div>
              <p className="text-sm text-[#6E6D7A]">
                The page you’re looking for doesn’t exist or may have been moved.
              </p>
            </div>

            {/* Headings */}
            <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-[#0D0C22] sm:text-4xl">
              Page Not Found
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#6E6D7A]">
              We couldn’t find that route. If you reached this page from a link, try going back to
              your dashboard or exploring BiasLens features.
            </p>

            {/* Illustration + floating cards */}
            <div className="relative mt-8">
              <div
                aria-hidden="true"
                className="rounded-2xl border border-[#E5E7EB] bg-gradient-to-b from-white/90 to-[#F8FAFF] p-6"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB]/30" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#0D0C22]/10" />
                    </div>
                    <div className="text-xs font-semibold text-[#6E6D7A]">
                      BiasLens Router Console
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-4">
                      <p className="text-xs font-semibold text-[#6E6D7A]">Request</p>
                      <p className="mt-1 text-sm font-semibold text-[#0D0C22]">GET /…</p>
                      <p className="mt-2 text-xs text-[#6E6D7A]">Route missing</p>
                    </div>
                    <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-4">
                      <p className="text-xs font-semibold text-[#6E6D7A]">Recommendation</p>
                      <p className="mt-1 text-sm font-semibold text-[#0D0C22]">
                        Use navigation
                      </p>
                      <p className="mt-2 text-xs text-[#6E6D7A]">Back or explore</p>
                    </div>
                    <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-4">
                      <p className="text-xs font-semibold text-[#6E6D7A]">Status</p>
                      <p className="mt-1 text-sm font-semibold text-[#0D0C22]">404 Not Found</p>
                      <p className="mt-2 text-xs text-[#6E6D7A]">Try again</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="pointer-events-none absolute -left-2 -top-3 hidden sm:block">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white/90 px-4 py-3 shadow-[0_15px_45px_-20px_rgba(13,12,34,0.55)] backdrop-blur">
                  <p className="text-xs font-semibold text-[#6E6D7A]">Resume Score</p>
                  <p className="mt-1 text-lg font-semibold text-[#0D0C22]">92%</p>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-2 top-10 hidden sm:block">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white/90 px-4 py-3 shadow-[0_15px_45px_-20px_rgba(13,12,34,0.55)] backdrop-blur">
                  <p className="text-xs font-semibold text-[#6E6D7A]">Fairness Risk</p>
                  <p className="mt-1 text-lg font-semibold text-[#0D0C22]">Low</p>
                </div>
              </div>

              <div className="pointer-events-none absolute left-1/2 -bottom-4 hidden w-[240px] -translate-x-1/2 sm:block">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white/90 px-4 py-3 shadow-[0_15px_45px_-20px_rgba(13,12,34,0.55)] backdrop-blur">
                  <p className="text-xs font-semibold text-[#6E6D7A]">Audit Ready</p>
                  <p className="mt-1 text-lg font-semibold text-[#0D0C22]">Yes</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-18px_rgba(37,99,235,0.9)] ring-1 ring-[#2563EB]/30 transition hover:brightness-105 active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
                Back to Home
              </Link>

              <Link
                href="/features"
                className="inline-flex w-full items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#0D0C22] shadow-sm transition hover:bg-[#F9FAFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
                Explore Features
              </Link>
            </div>

            {/* SEO-friendly note */}
            <p className="sr-only">
              This page returned a 404 status. Use the navigation links to return to BiasLens.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

