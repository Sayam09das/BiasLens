"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  makeSecurityScanSseUrl,
  startSecurityScan,
  type SecurityScanEvent,
} from "@/lib/securityScanSse";

function severityTone(sev: "low" | "moderate" | "high") {
  switch (sev) {
    case "high":
      return {
        border: "rgba(239,68,68,0.35)",
        bg: "rgba(239,68,68,0.10)",
        fg: "#EF4444",
      };
    case "moderate":
      return {
        border: "rgba(245,158,11,0.35)",
        bg: "rgba(245,158,11,0.10)",
        fg: "#F59E0B",
      };
    case "low":
    default:
      return {
        border: "rgba(34,197,94,0.35)",
        bg: "rgba(34,197,94,0.10)",
        fg: "#22C55E",
      };
  }
}

export function SecurityScanWidget() {
  const [running, setRunning] = React.useState(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [message, setMessage] = React.useState<string>("Ready");
  const [events, setEvents] = React.useState<SecurityScanEvent[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const eventSourceRef = React.useRef<EventSource | null>(null);

  const clear = React.useCallback(() => {
    setRunning(false);
    setProgress(0);
    setMessage("Ready");
    setError(null);
    setEvents([]);
  }, []);

  const start = React.useCallback(async () => {
    if (running) return;
    clear();

    setRunning(true);

    // Open SSE stream BEFORE triggering scan start so we don't miss early events.
    const url = makeSecurityScanSseUrl();
    const es = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = es;

    es.onmessage = (ev) => {
      try {
        const parsed = JSON.parse(ev.data) as SecurityScanEvent;
        setEvents((cur) => [...cur, parsed]);

        if (parsed.type === "progress") {
          setProgress(parsed.percent);
          setMessage(parsed.message);
        } else if (parsed.type === "finding") {
          setMessage("Finding discovered");
        } else if (parsed.type === "complete") {
          setRunning(false);
          setMessage("Scan complete");
          es.close();
          eventSourceRef.current = null;
        }
      } catch {
        // ignore malformed SSE payloads
      }
    };

    es.onerror = () => {
      setError("Security scan stream disconnected. Please try again.");
      setRunning(false);
      setMessage("Stream error");
      es.close();
      eventSourceRef.current = null;
    };

    try {
      await startSecurityScan();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start security scan");
      setRunning(false);
      setMessage("Start failed");
      es.close();
      eventSourceRef.current = null;
    }
  }, [clear, running]);

  React.useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, []);

  const findings = events.filter((e): e is Extract<SecurityScanEvent, { type: "finding" }> => e.type === "finding");

  return (
    <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
            <ShieldCheck size={18} className="text-[#2563EB]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#0D0C22]">Security scan</p>
            <p className="mt-1 text-sm text-[#6E6D7A]">Real-time stream of vulnerability checks.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => void start()}
            disabled={running}
            className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8] disabled:opacity-60"
          >
            {running ? "Scanning…" : "Start scan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={clear}
            disabled={running}
            className="rounded-[1.25rem] border-[#E7E7E9] text-[#6E6D7A] hover:bg-[#F6F8FB]"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Progress</p>
          <p className="mt-2 text-sm font-semibold text-[#0D0C22]">{message}</p>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#E7E7E9]">
            <div
              className="h-full bg-[#2563EB] transition-[width] duration-150"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#6E6D7A]">{progress}%</p>

          <AnimatePresence>
            {error ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 rounded-[1.25rem] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.10)] p-4"
                role="alert"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-[#EF4444]" size={18} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">Scan error</p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">{error}</p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Findings</p>
          {findings.length === 0 ? (
            <p className="mt-3 text-sm text-[#6E6D7A]">No findings yet.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {findings.map((f) => {
                const tone = severityTone(f.finding.severity);
                return (
                  <div
                    key={f.finding.id}
                    className="rounded-[1.25rem] border p-4"
                    style={{ borderColor: tone.border, background: tone.bg }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: tone.fg }}>
                          {f.finding.title}
                        </p>
                        <p className="mt-1 text-xs text-[#6E6D7A]">Severity: {f.finding.severity}</p>
                        {f.finding.evidence ? (
                          <p className="mt-2 text-xs text-[#6E6D7A]">Evidence: {f.finding.evidence}</p>
                        ) : null}
                        {f.finding.recommendation ? (
                          <p className="mt-2 text-xs text-[#6E6D7A]">Recommendation: {f.finding.recommendation}</p>
                        ) : null}
                      </div>
                      <span className="mt-0.5 inline-flex items-center rounded-2xl border px-3 py-1 text-[11px] font-semibold" style={{ background: tone.bg, borderColor: tone.border, color: tone.fg }}>
                        {f.finding.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {events.some((e) => e.type === "complete") && findings.length === 0 ? (
            <div className="mt-4 rounded-[1.25rem] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[#22C55E]" size={18} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">No issues detected</p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">Scan completed successfully.</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
