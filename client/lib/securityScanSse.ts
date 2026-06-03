export type SecurityScanEvent =
  | { type: "progress"; percent: number; message: string }
  | {
      type: "finding";
      finding: {
        id: string;
        severity: "low" | "moderate" | "high";
        title: string;
        evidence?: string;
        recommendation?: string;
      };
    }
  | { type: "complete" }
  | { type: "error"; message: string };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function makeSecurityScanSseUrl(baseUrl: string = API_BASE_URL): string {
  return `${baseUrl}/v1/security/scan/stream`;
}

export function startSecurityScan(triggerUrl: string = `${API_BASE_URL}/v1/security/scan`): Promise<void> {
  return fetch(triggerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Scan start failed: ${res.status}`);
    }
  });
}
