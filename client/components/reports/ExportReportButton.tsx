"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  Check,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Loader2,
  MoreHorizontal,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

export type ExportFormat = "pdf" | "csv" | "json";

export type ExportReportButtonProps = {
  reportId?: string;
  selectedReportIds?: string[];
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

type Feedback =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const SIZE = {
  sm: { h: "h-10", px: "px-3", text: "text-sm" },
  md: { h: "h-11", px: "px-4", text: "text-sm" },
  lg: { h: "h-12", px: "px-5", text: "text-base" },
} as const;

const VARIANT = {
  primary:   "border border-[#1463ff]/40 bg-[#1463ff] text-white hover:bg-[#0f4fcb]",
  secondary: "border border-[#d9e2ec] bg-white text-[#667085] hover:bg-[#f3f7fc]",
  ghost:     "border border-transparent bg-transparent text-[#667085] hover:bg-[#f3f7fc] hover:border-[#d9e2ec]",
} as const;

async function triggerDownload(url: string, fileName: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.target = "_blank";
  a.rel = "noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function ExportReportButton({
  reportId,
  selectedReportIds,
  variant = "primary",
  size = "md",
  disabled,
}: ExportReportButtonProps) {
  const { toast } = useToast();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef    = useRef<HTMLDivElement>(null);

  const [open,       setOpen]       = useState(false);
  const [busyFormat, setBusyFormat] = useState<ExportFormat | null>(null);
  const [feedback,   setFeedback]   = useState<Feedback>({ type: "idle" });

  const ids = useMemo(() => {
    const list = [reportId, ...(selectedReportIds ?? [])].filter(Boolean) as string[];
    return [...new Set(list)];
  }, [reportId, selectedReportIds]);

  const isDisabled = disabled || busyFormat !== null || ids.length === 0;

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); menuBtnRef.current?.focus(); }
    };
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !menuBtnRef.current?.contains(t)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open, close]);

  const runExport = async (format: ExportFormat) => {
    if (isDisabled) return;
    setFeedback({ type: "idle" });
    setBusyFormat(format);
    close();

    try {
      if (format === "pdf") {
        // Real backend PDF export
        const targetId = ids[0];
        const result = await apiFetch<{ downloadUrl: string; fileName: string }>(
          `/v1/reports/${targetId}/export/pdf`,
          { method: "POST" }
        );
        await triggerDownload(result.downloadUrl, result.fileName);
        setFeedback({ type: "success", message: `PDF ready — ${result.fileName}` });
        toast("PDF exported successfully", "success");

      } else if (format === "json") {
        // JSON download via existing download endpoint
        const targetId = ids[0];
        await triggerDownload(
          `${process.env.NEXT_PUBLIC_API_URL ?? "https://biaslens-9wzi.onrender.com"}/v1/reports/${targetId}/download`,
          `biaslens-report-${targetId}.json`
        );
        setFeedback({ type: "success", message: "JSON downloaded." });
        toast("JSON exported", "success");

      } else {
        // CSV — not yet implemented on backend, show informative message
        setFeedback({ type: "error", message: "CSV export coming soon." });
        toast("CSV export is not yet available", "warning");
      }

      setTimeout(() => setFeedback({ type: "idle" }), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Export failed";
      setFeedback({ type: "error", message: msg });
      toast(msg, "error");
      setTimeout(() => setFeedback({ type: "idle" }), 4000);
    } finally {
      setBusyFormat(null);
      menuBtnRef.current?.focus();
    }
  };

  const s = SIZE[size];
  const v = VARIANT[variant];

  const btnLabel =
    busyFormat       ? "Exporting…"
    : feedback.type === "success" ? "Exported"
    : feedback.type === "error"   ? "Retry"
    : "Export";

  const items: { format: ExportFormat; label: string; Icon: typeof FileText }[] = [
    { format: "pdf",  label: "Export as PDF",  Icon: FileText        },
    { format: "csv",  label: "Export as CSV",  Icon: FileSpreadsheet },
    { format: "json", label: "Export as JSON", Icon: FileJson        },
  ];

  return (
    <div className="relative">
      <button
        ref={menuBtnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isDisabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open export options"
        className={cx(
          "inline-flex items-center justify-center gap-2 rounded-[1.25rem] font-semibold transition",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1463ff]",
          s.h, s.px, s.text, v,
          isDisabled && "cursor-not-allowed opacity-60"
        )}
      >
        {busyFormat
          ? <Loader2 size={16} className="animate-spin" aria-hidden />
          : feedback.type === "success"
            ? <Check size={16} aria-hidden />
            : feedback.type === "error"
              ? <RefreshCcw size={16} aria-hidden />
              : <Download size={16} aria-hidden />
        }
        {btnLabel}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Export options"
          className="absolute right-0 z-50 mt-2 w-64 rounded-[1.5rem] border border-[#d9e2ec] bg-white p-2 shadow-[0_24px_64px_rgba(13,12,34,0.12)]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#d9e2ec] bg-[#f3f7fc]">
              <MoreHorizontal size={16} className="text-[#1463ff]" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                Export report
              </p>
              <p className="text-sm font-semibold text-[#101828]">
                {ids.length} target{ids.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-1 space-y-0.5">
            {items.map(({ format, label, Icon }) => {
              const isBusy = busyFormat === format;
              return (
                <button
                  key={format}
                  type="button"
                  role="menuitem"
                  onClick={() => runExport(format)}
                  disabled={isDisabled || isBusy}
                  aria-label={label}
                  className={cx(
                    "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-[#344054]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1463ff]",
                    !isDisabled && !isBusy ? "hover:bg-[#f3f7fc]" : "cursor-not-allowed opacity-60"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#d9e2ec] bg-white">
                      <Icon size={15} aria-hidden />
                    </span>
                    {label}
                  </span>
                  {isBusy && <Loader2 size={14} className="animate-spin text-[#1463ff]" aria-hidden />}
                </button>
              );
            })}
          </div>

          {/* Status footer */}
          <div className="mt-2 rounded-2xl border border-[#d9e2ec] bg-[#f3f7fc] px-3 py-2.5">
            {feedback.type === "idle" && (
              <div className="flex items-start gap-2">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#1463ff]" aria-hidden />
                <p className="text-xs leading-5 text-[#667085]">
                  PDF exports are signed and expire after 1 hour.
                </p>
              </div>
            )}
            {feedback.type === "success" && (
              <div className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 shrink-0 text-[#22c55e]" aria-hidden />
                <p className="text-xs font-semibold leading-5 text-[#101828]">{feedback.message}</p>
              </div>
            )}
            {feedback.type === "error" && (
              <div className="flex items-start gap-2">
                <XCircle size={15} className="mt-0.5 shrink-0 text-[#ef4444]" aria-hidden />
                <p className="text-xs font-semibold leading-5 text-[#101828]">{feedback.message}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
