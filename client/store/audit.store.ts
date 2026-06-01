import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiFetch } from "@/lib/api";

export type AuditStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Audit {
  id: string;
  title: string;
  status: AuditStatus;
  jobRole: string | null;
  resumeText: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
}

interface AuditState {
  active: Audit | null;
  history: Audit[];
  isLoading: boolean;
  error: string | null;

  // actions
  fetchHistory: () => Promise<void>;
  fetchAudit: (id: string) => Promise<void>;
  setActive: (audit: Audit | null) => void;
  createAudit: (payload: { title: string; resumeText?: string; jobRole?: string }) => Promise<Audit>;
  removeAudit: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useAuditStore = create<AuditState>()(
  devtools(
    (set, get) => ({
      active: null,
      history: [],
      isLoading: false,
      error: null,

      fetchHistory: async () => {
        set({ isLoading: true, error: null });
        try {
          const history = await apiFetch<Audit[]>("/v1/audits");
          set({ history, isLoading: false });
        } catch (e) {
          set({ error: errorMessage(e), isLoading: false });
        }
      },

      fetchAudit: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const audit = await apiFetch<Audit>(`/v1/audits/${id}`);
          set({ active: audit, isLoading: false });
        } catch (e) {
          set({ error: errorMessage(e), isLoading: false });
        }
      },

      setActive: (audit) => set({ active: audit }),

      createAudit: async (payload) => {
        const audit = await apiFetch<Audit>("/v1/audits", {
          method: "POST",
          body: payload,
        });
        set((s) => ({ history: [audit, ...s.history] }));
        return audit;
      },

      removeAudit: async (id) => {
        set({
          history: get().history.filter((a) => a.id !== id),
          active: get().active?.id === id ? null : get().active,
        });
      },

      clearError: () => set({ error: null }),
    }),
    { name: "audit" }
  )
);

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "An unexpected error occurred";
}
