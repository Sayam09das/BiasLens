"use client";

import { useState, useEffect, useRef } from "react";
import {
  Check,
  Clock,
  Copy,
  Link2,
  Loader2,
  Mail,
  Share2,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ShareExpiry = "1h" | "24h" | "7d" | "30d";

type ShareLink = {
  id: string;
  permission: string;
  expiresAt: string;
  revoked: boolean;
  createdAt: string;
};

type ShareResult = {
  shareUrl: string;
  expiresAt: string;
};

const EXPIRY_OPTIONS: { value: ShareExpiry; label: string }[] = [
  { value: "1h",  label: "1 hour"   },
  { value: "24h", label: "24 hours" },
  { value: "7d",  label: "7 days"   },
  { value: "30d", label: "30 days"  },
];

function formatExpiry(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export type ShareReportButtonProps = {
  reportId: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

export default function ShareReportButton({
  reportId,
  variant = "secondary",
  size = "md",
  disabled,
}: ShareReportButtonProps) {
  const { toast } = useToast();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [open,        setOpen]        = useState(false);
  const [expiry,      setExpiry]      = useState<ShareExpiry>("7d");
  const [email,       setEmail]       = useState("");
  const [shareUrl,    setShareUrl]    = useState<string | null>(null);
  const [expiresAt,   setExpiresAt]   = useState<string | null>(null);
  const [shares,      setShares]      = useState<ShareLink[]>([]);
  const [copied,      setCopied]      = useState(false);
  const [isCreating,  setIsCreating]  = useState(false);
  const [isRevoking,  setIsRevoking]  = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [loadingShares,  setLoadingShares]  = useState(false);

  // Load existing shares when modal opens
  useEffect(() => {
    if (!open) return;
    setLoadingShares(true);
    apiFetch<ShareLink[]>(`/v1/reports/${reportId}/shares`)
      .then(setShares)
      .catch(() => setShares([]))
      .finally(() => setLoadingShares(false));
  }, [open, reportId]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const createLink = async () => {
    setIsCreating(true);
    try {
      const result = await apiFetch<ShareResult>(`/v1/reports/${reportId}/share`, {
        method: "POST",
        body: { expiry },
      });
      setShareUrl(result.shareUrl);
      setExpiresAt(result.expiresAt);
      // Refresh shares list
      const updated = await apiFetch<ShareLink[]>(`/v1/reports/${reportId}/shares`);
      setShares(updated);
      toast("Share link created", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create link", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast("Link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy link", "error");
    }
  };

  const revokeLink = async (shareId: string) => {
    setIsRevoking(shareId);
    try {
      await apiFetch(`/v1/reports/${reportId}/share`, { method: "DELETE" });
      setShares((prev) => prev.map((s) => s.id === shareId ? { ...s, revoked: true } : s));
      if (shareUrl) { setShareUrl(null); setExpiresAt(null); }
      toast("Share link revoked", "info");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to revoke", "error");
    } finally {
      setIsRevoking(null);
    }
  };

  const sendEmail = async () => {
    if (!shareUrl || !email.trim()) return;
    setIsSendingEmail(true);
    try {
      // Compose mailto as a lightweight email invite (no backend email endpoint yet)
      const subject = encodeURIComponent("BiasLens Report — Shared with you");
      const body    = encodeURIComponent(
        `You've been invited to view a BiasLens audit report.\n\nView report: ${shareUrl}\n\nThis link expires on ${expiresAt ? formatExpiry(expiresAt) : "—"}.`
      );
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
      toast(`Email draft opened for ${email}`, "success");
      setEmail("");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const sizeClass =
    size === "sm" ? "h-10 px-3 text-sm"
    : size === "lg" ? "h-12 px-5 text-base"
    : "h-11 px-4 text-sm";

  const variantClass =
    variant === "primary"
      ? "border border-[#1463ff]/40 bg-[#1463ff] text-white hover:bg-[#0f4fcb]"
      : variant === "ghost"
        ? "border border-transparent bg-transparent text-[#667085] hover:bg-[#f3f7fc]"
        : "border border-[#d9e2ec] bg-white text-[#667085] hover:bg-[#f3f7fc]";

  const activeShares = shares.filter((s) => !s.revoked);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        aria-label="Share report"
        className={`inline-flex items-center gap-2 rounded-[1.25rem] font-semibold transition
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1463ff]
          disabled:cursor-not-allowed disabled:opacity-60 ${sizeClass} ${variantClass}`}
      >
        <Share2 size={16} aria-hidden />
        Share
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(13,12,34,0.4)] backdrop-blur-sm"
          onClick={(e) => { if (e.target === overlayRef.current) setOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Share report"
        >
          <Card className="w-full max-w-lg rounded-[2rem] border-[#d9e2ec] bg-white p-6 shadow-[0_32px_80px_rgba(13,12,34,0.18)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dbe8ff]">
                    <Link2 size={18} className="text-[#1463ff]" aria-hidden />
                  </span>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#101828]">
                    Share report
                  </h2>
                </div>
                <p className="mt-2 text-sm text-[#667085]">
                  Create a view-only secure link or invite by email.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#d9e2ec] text-[#667085] hover:bg-[#f3f7fc] transition"
              >
                <X size={16} aria-hidden />
              </button>
            </div>

            {/* Create link section */}
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] border border-[#d9e2ec] bg-[#f3f7fc] p-4">
                <p className="text-sm font-semibold text-[#101828]">Link expiry</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {EXPIRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExpiry(opt.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition
                        ${expiry === opt.value
                          ? "bg-[#1463ff] text-white"
                          : "border border-[#d9e2ec] bg-white text-[#667085] hover:border-[#1463ff]/40"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <Button
                  className="mt-4 w-full rounded-[1.25rem] bg-[#1463ff] hover:bg-[#0f4fcb]"
                  onClick={createLink}
                  disabled={isCreating}
                >
                  {isCreating
                    ? <><Loader2 size={15} className="mr-2 animate-spin" aria-hidden /> Creating…</>
                    : <><Link2 size={15} className="mr-2" aria-hidden /> Create secure link</>
                  }
                </Button>
              </div>

              {/* Generated link */}
              {shareUrl && (
                <div className="rounded-[1.5rem] border border-[#dbe8ff] bg-[#f0f5ff] p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1463ff]">
                    <ShieldCheck size={14} aria-hidden />
                    View-only · Expires {expiresAt ? formatExpiry(expiresAt) : "—"}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      readOnly
                      value={shareUrl}
                      className="min-w-0 flex-1 rounded-[1rem] border border-[#d9e2ec] bg-white px-3 py-2 text-xs text-[#344054] outline-none"
                      aria-label="Share URL"
                    />
                    <button
                      type="button"
                      onClick={copyLink}
                      aria-label="Copy link"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem] border border-[#d9e2ec] bg-white text-[#1463ff] hover:bg-[#f0f5ff] transition"
                    >
                      {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
                    </button>
                  </div>
                </div>
              )}

              {/* Email invite */}
              <div className="rounded-[1.5rem] border border-[#d9e2ec] bg-white p-4">
                <p className="text-sm font-semibold text-[#101828]">Invite by email</p>
                <p className="mt-1 text-xs text-[#667085]">
                  Opens your email client with the share link pre-filled.
                </p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    disabled={!shareUrl}
                    className="min-w-0 flex-1 rounded-[1rem] border border-[#d9e2ec] bg-[#f3f7fc] px-3 py-2 text-sm text-[#101828] outline-none placeholder:text-[#8A8994] focus:border-[#1463ff]/40 focus:bg-white disabled:opacity-50 transition"
                    aria-label="Recipient email"
                  />
                  <Button
                    variant="outline"
                    className="shrink-0 rounded-[1rem]"
                    onClick={sendEmail}
                    disabled={!shareUrl || !email.trim() || isSendingEmail}
                  >
                    {isSendingEmail
                      ? <Loader2 size={15} className="animate-spin" aria-hidden />
                      : <Mail size={15} aria-hidden />
                    }
                  </Button>
                </div>
                {!shareUrl && (
                  <p className="mt-2 text-xs text-[#667085]">Create a link first to enable email invite.</p>
                )}
              </div>

              {/* Active shares */}
              {(loadingShares || activeShares.length > 0) && (
                <div className="rounded-[1.5rem] border border-[#d9e2ec] bg-white p-4">
                  <p className="text-sm font-semibold text-[#101828]">Active links</p>
                  {loadingShares ? (
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#667085]">
                      <Loader2 size={13} className="animate-spin" aria-hidden /> Loading…
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {activeShares.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between gap-3 rounded-[1rem] border border-[#d9e2ec] bg-[#f3f7fc] px-3 py-2.5"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Clock size={13} className="shrink-0 text-[#667085]" aria-hidden />
                            <span className="truncate text-xs text-[#344054]">
                              Expires {formatExpiry(s.expiresAt)} · {s.permission}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => revokeLink(s.id)}
                            disabled={isRevoking === s.id}
                            aria-label="Revoke link"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#ef4444] hover:bg-[#fee2e2] transition disabled:opacity-50"
                          >
                            {isRevoking === s.id
                              ? <Loader2 size={13} className="animate-spin" aria-hidden />
                              : <Trash2 size={13} aria-hidden />
                            }
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
