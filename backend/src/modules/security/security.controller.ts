import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { successResponse } from "../../utils/api-response.js";
import { prisma } from "../../config/prisma.js";

type SecurityFinding = {
  id: string;
  severity: "low" | "moderate" | "high";
  title: string;
  evidence?: string;
  recommendation?: string;
};

// Simple in-process event stream storage.
// In a multi-instance deployment, replace with Redis pub/sub or a queue.
const scanSubscribers = new Map<string, Set<(event: SecurityFinding | any) => void>>();

function getScanKey(userId: string) {
  return `user:${userId}:active-security-scan`;
}

function publishToSubscribers(scanKey: string, payload: unknown) {
  const subs = scanSubscribers.get(scanKey);
  if (!subs) return;
  for (const cb of subs) {
    cb(payload);
  }
}

function subscribe(scanKey: string, cb: (event: unknown) => void) {
  if (!scanSubscribers.has(scanKey)) scanSubscribers.set(scanKey, new Set());
  scanSubscribers.get(scanKey)!.add(cb);
  return () => {
    scanSubscribers.get(scanKey)?.delete(cb);
    if (scanSubscribers.get(scanKey)?.size === 0) scanSubscribers.delete(scanKey);
  };
}

async function runMockSecurityScan(userId: string) {
  // TODO: Replace mock scan with real scanning logic.
  // Emit incremental events so the UI looks “real-time”.
  const scanKey = getScanKey(userId);

  publishToSubscribers(scanKey, { type: "progress", percent: 5, message: "Initializing scan" });
  await new Promise((r) => setTimeout(r, 300));

  publishToSubscribers(scanKey, {
    type: "finding",
    finding: {
      id: `f_${Date.now()}_1`,
      severity: "moderate",
      title: "Potential missing output sanitization",
      evidence: "User-controlled string passed to renderer without explicit sanitization.",
      recommendation: "Sanitize/escape untrusted output on both client and server; use safe HTML rendering.",
    },
  });
  await new Promise((r) => setTimeout(r, 450));

  publishToSubscribers(scanKey, { type: "progress", percent: 55, message: "Running heuristic checks" });
  await new Promise((r) => setTimeout(r, 450));

  publishToSubscribers(scanKey, {
    type: "finding",
    finding: {
      id: `f_${Date.now()}_2`,
      severity: "low",
      title: "Rate-limit missing on non-idempotent endpoint",
      evidence: "POST endpoint does not enforce per-user request limits.",
      recommendation: "Apply rate limiting to scan-start endpoints and other high-cost operations.",
    },
  });
  await new Promise((r) => setTimeout(r, 350));

  publishToSubscribers(scanKey, { type: "progress", percent: 100, message: "Finalizing report" });
  await new Promise((r) => setTimeout(r, 150));

  publishToSubscribers(scanKey, { type: "complete" });
}

export const securityScanController = {
  startScan: async (request: Request, response: Response) => {
    const userId = response.locals.authUser?.id as string | undefined;
    if (!userId) {
      response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Kick off scan (mock). Do not block request.
    void runMockSecurityScan(userId);

    response
      .status(StatusCodes.ACCEPTED)
      .json(successResponse({ started: true }, "Security scan started."));
  },

  scanStream: async (request: Request, response: Response) => {
    const userId = response.locals.authUser?.id as string | undefined;
    if (!userId) {
      response.status(StatusCodes.UNAUTHORIZED).end();
      return;
    }

    const scanKey = getScanKey(userId);

    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("Connection", "keep-alive");
    // Recommended for SSE: flush headers immediately.
    response.flushHeaders?.();

    // Keep-alive comment
    response.write(`: connected\n\n`);

    const unsubscribe = subscribe(scanKey, (payload) => {
      response.write(`data: ${JSON.stringify(payload)}\n\n`);

      if (payload && typeof payload === "object" && "type" in payload) {
        if ((payload as any).type === "complete") {
          response.end();
        }
      }
    });

    // If client closes connection.
    request.on("close", () => {
      unsubscribe();
    });
  },
};

