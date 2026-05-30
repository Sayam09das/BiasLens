import Image from "next/image";

const capabilities = [
  {
    title: "Resume Audit Pipelines",
    description:
      "Run structured screening with explainable scoring, role-aware fit checks, and recruiter-friendly summaries.",
    icon: "/icons/audit-icon.svg",
  },
  {
    title: "Fairness And Explainability",
    description:
      "Surface SHAP, LIME, counterfactuals, and bias indicators so every hiring recommendation is reviewable.",
    icon: "/icons/report-icon.svg",
  },
  {
    title: "Production Review Loops",
    description:
      "Connect backend APIs, admin audit trails, and PDF-ready reporting into one operational review flow.",
    icon: "/logo.svg",
  },
];

const proofPoints = [
  "Resume parsing and PDF uploads",
  "Explainability with SHAP and LIME",
  "Fairness metrics and parity checks",
  "Secure auth and audit logging",
];

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden px-6 pb-18 pt-8 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-medium text-[color:var(--foreground-secondary)] shadow-sm backdrop-blur">
              <Image
                src="/logo.svg"
                alt="BiasLens logo"
                width={22}
                height={22}
                className="h-5 w-5"
              />
              Responsible hiring intelligence for modern teams
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)] sm:text-6xl">
              Audit resumes with clarity, explain every decision, and move hiring
              reviews from guesswork to evidence.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--foreground-secondary)] sm:text-xl">
              BiasLens combines secure backend workflows, explainable ML analysis,
              fairness insights, and recruiter-ready reporting into one production
              platform for screening and review.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#capabilities"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--primary-hover)]"
              >
                Explore Capabilities
              </a>
              <a
                href="#platform"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
              >
                Review Platform Flow
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {proofPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 py-4 text-sm text-[color:var(--foreground-secondary)] shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:w-[42%]">
            <div className="absolute inset-x-10 top-8 h-28 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/60 bg-white/85 p-5 shadow-[0_28px_80px_rgba(13,12,34,0.12)] backdrop-blur">
              <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--background-secondary)] p-4">
                <Image
                  src="/images/hero-image.svg"
                  alt="BiasLens dashboard preview"
                  width={680}
                  height={560}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-[2rem] border border-[color:var(--border)] bg-white/85 p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
              Platform
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
              End-to-end
            </p>
            <p className="mt-2 text-sm text-[color:var(--foreground-secondary)]">
              Upload, analyze, explain, and review in one flow.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
              ML Review
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
              Live
            </p>
            <p className="mt-2 text-sm text-[color:var(--foreground-secondary)]">
              SHAP, LIME, fairness, and counterfactual insight paths.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
              Security
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
              Auth-ready
            </p>
            <p className="mt-2 text-sm text-[color:var(--foreground-secondary)]">
              Verification, token rotation, and admin audit visibility.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
              Delivery
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
              Production-style
            </p>
            <p className="mt-2 text-sm text-[color:var(--foreground-secondary)]">
              Structured APIs, layered backend, and scalable UI foundations.
            </p>
          </div>
        </div>
      </section>

      <section id="capabilities" className="px-6 py-18 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--primary)]">
              Core Capabilities
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Built for teams that need speed, traceability, and trust.
            </h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--foreground-secondary)]">
              Every layer is designed to help product, hiring, and compliance teams
              understand what the model saw, why it responded that way, and how to
              act on the result.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {capabilities.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(13,12,34,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--background-secondary)]">
                  <Image
                    src={item.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--foreground-secondary)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
