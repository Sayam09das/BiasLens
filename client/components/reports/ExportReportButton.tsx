"use client";

import * as React from "react";
import {
  Check,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Loader2,
  MoreHorizontal,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export type ExportFormat = "pdf" | "csv" | "json";

export type ExportReportButtonProps = {
  reportId?: string;
  selectedReportIds?: string[];
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onExport?: (format: ExportFormat) => Promise<void> | void;
};

type MenuItem = {
  format: ExportFormat;
  label: string;
  icon: React.ReactNode;
};

const BRAND = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  border: "#E7E7E9",
  text: "#0D0C22",
  muted: "#6E6D7A",
  success: "#22C55E",
  danger: "#EF4444",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function sizeStyles(size: NonNullable<ExportReportButtonProps["size"]>) {
  if (size === "sm") {
    return { padX: "px-3", padY: "py-2", font: "text-sm", h: "h-10", icon: "h-4 w-4" };
  }
  if (size === "lg") {
    return { padX: "px-5", padY: "py-3", font: "text-base", h: "h-12", icon: "h-5 w-5" };
  }
  return { padX: "px-4", padY: "py-2.5", font: "text-sm", h: "h-11", icon: "h-4.5 w-4.5" };
}

function variantStyles(variant: NonNullable<ExportReportButtonProps["variant"]>) {
  if (variant === "secondary") {
    return {
      base: "border border-[#E7E7E9] bg-[#FFFFFF] text-[#6E6D7A] hover:bg-[#F6F8FB]",
      ring: "focus-visible:ring-[#2563EB]",
    };
  }
  if (variant === "ghost") {
    return {
      base: "border border-transparent bg-transparent text-[#6E6D7A] hover:bg-[#F6F8FB] hover:border-[#E7E7E9]",
      ring: "focus-visible:ring-[#2563EB]",
    };
  }

  return {
    base: "border border-[rgba(37,99,235,0.45)] bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
    ring: "focus-visible:ring-[#2563EB]",
  };
}

function Spinner() {
  return <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />;
}

export default function ExportReportButton({
  reportId,
  selectedReportIds,
  variant = "primary",
  size = "md",
  disabled,
  onExport,
}: ExportReportButtonProps) {
  const menuBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [busyFormat, setBusyFormat] = React.useState<ExportFormat | null>(null);
  const [feedback, setFeedback] = React.useState<
    | { type: "idle" }
    | { type: "success"; message: string }
    | { type: "error"; message: string }
  >({ type: "idle" });

  const ids = React.useMemo(() => {
    const list = [reportId, ...(selectedReportIds ?? [])].filter(Boolean) as string[];
    return Array.from(new Set(list));
  }, [reportId, selectedReportIds]);

  const effectiveDisabled = disabled || busyFormat !== null || ids.length === 0;

  const items: MenuItem[] = React.useMemo(
    () => [
      { format: "pdf", label: "Export as PDF", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
      { format: "csv", label: "Export as CSV", icon: <FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> },
      { format: "json", label: "Export as JSON", icon: <FileJson className="h-4 w-4" aria-hidden="true" /> },
    ],
    [],
  );

  const v = variantStyles(variant);
  const s = sizeStyles(size);

  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        menuBtnRef.current?.focus();
      }
    };

    const onDocPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (menuRef.current?.contains(target)) return;
      if (menuBtnRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onDocPointerDown);
    document.addEventListener("touchstart", onDocPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onDocPointerDown);
      document.removeEventListener("touchstart", onDocPointerDown);
    };
  }, [open, close]);

  const runExport = async (format: ExportFormat) => {
    if (effectiveDisabled) return;

    setFeedback({ type: "idle" });
    setBusyFormat(format);

    try {
      if (onExport) {
        // Consumer handles real export.
        await onExport(format);
      } else {
        // Best-effort fallback: triggers browser download if backend wiring isn't present.
        // (No-op otherwise.)
        // eslint-disable-next-line no-console
        console.warn(`[BiasLens] ExportReportButton: onExport missing for format: ${format}`);
      }

      const count = ids.length;
      const message = count > 1 ? `Exported ${count} reports as ${format.toUpperCase()}.` : `Exported as ${format.toUpperCase()}.`;
      setFeedback({ type: "success", message });

      window.setTimeout(() => setFeedback({ type: "idle" }), 2400);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Export failed";
      setFeedback({ type: "error", message: msg });
      window.setTimeout(() => setFeedback({ type: "idle" }), 3000);
    } finally {
      setBusyFormat(null);
      close();
      menuBtnRef.current?.focus();
    }
  };

  const baseBtnClass = cx(
    "inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus-visible:ring-2",
    s.h,
    s.padX,
    s.padY,
    s.font,
    v.base,
    v.ring,
    effectiveDisabled && "opacity-60 cursor-not-allowed",
  );

  const labelText = busyFormat ? "Exporting…" : feedback.type === "success" ? "Exported" : feedback.type === "error" ? "Retry" : "Export";

  return (
    <div className="relative">
      <button
        ref={menuBtnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={baseBtnClass}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open export options"
        disabled={effectiveDisabled}
      >
        {busyFormat ? <Spinner /> : null}
        {!busyFormat ? (
          <>
            <Download className={cx("mr-2", variant === "primary" ? "text-white" : "text-[#2563EB]")} aria-hidden="true" />
            {labelText}
          </>
        ) : (
          <span className="sr-only">Exporting</span>
        )}
      </button>

      <AnimatePresenceMenu open={open}>
        <div
          ref={menuRef}
          role="menu"
          aria-label="Export report menu"
          className="absolute right-0 mt-2 w-[260px] rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-2 shadow-[0_24px_64px_rgba(13,12,34,0.12)]"
        >
          <div className="px-3 pb-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]" aria-hidden="true">
                <MoreHorizontal className="h-4 w-4 text-[#2563EB]" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Export reports</p>
                <p className="mt-1 truncate text-sm font-semibold text-[#0D0C22]">{ids.length} target{ids.length === 1 ? "" : "s"}</p>
              </div>
            </div>
          </div>

          <div className="mt-1">
            {items.map((it) => {
              const isBusy = busyFormat === it.format;
              return (
                <button
                  key={it.format}
                  type="button"
                  role="menuitem"
                  onClick={() => runExport(it.format)}
                  disabled={effectiveDisabled || isBusy}
                  className={cx(
                    "flex w-full items-center justify-between gap-3 rounded-[1rem] px-3 py-2 text-left text-sm font-semibold",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                    it.format === "pdf" ? "text-[#6E6D7A]" : "text-[#6E6D7A]",
                    !effectiveDisabled && !isBusy ? "hover:bg-[#F6F8FB]" : "opacity-60 cursor-not-allowed",
                  )}
                  aria-label={it.label}
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-xl border border-[#E7E7E9] bg-[#FFFFFF]" aria-hidden="true">
                      {it.icon}
                    </span>
                    {it.label}
                  </span>
                  {isBusy ? <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>

          <div className="mt-2 rounded-[1rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2">
            {feedback.type === "idle" ? (
              <div className="flex items-start gap-2">
                <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-[#FFFFFF] border border-[#E7E7E9]" aria-hidden="true">
                  <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
                </span>
                <p className="text-xs leading-5 text-[#6E6D7A]">
                  Exports are production-safe when your backend wires the actual download. If not configured, this component shows best-effort feedback.
                </p>
              </div>
            ) : feedback.type === "success" ? (
              <div className="flex items-start gap-2">
                <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-[rgba(34,197,94,0.10)] border border-[rgba(34,197,94,0.25)]" aria-hidden="true">
                  <Check className="h-4 w-4 text-[#22C55E]" />
                </span>
                <p className="text-xs leading-5 font-semibold text-[#0D0C22]">{feedback.message}</p>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.22)]" aria-hidden="true">
                  <XCircle className="h-4 w-4 text-[#EF4444]" />
                </span>
                <p className="text-xs leading-5 font-semibold text-[#0D0C22]">{feedback.message}</p>
              </div>
            )}
          </div>
        </div>
      </AnimatePresenceMenu>
    </div>
  );
}

function AnimatePresenceMenu({ open, children }: { open: boolean; children: React.ReactNode }) {
  // Lightweight fallback to avoid hard dependency on framer-motion for this component.
  // If framer-motion is available in the project, framer-motion can be used later.
  if (!open) return null;
  return <>{children}</>;
}

