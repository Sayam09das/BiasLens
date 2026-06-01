import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
  getCurrentSession,
  loginWithEmail,
  logoutSession,
  refreshAuthSession,
  registerWithEmail,
} from "@/lib/auth";

type SessionStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: AuthUser | null;
  status: SessionStatus;
  permissions: string[];

  // actions
  bootstrap: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      status: "idle",
      permissions: [],

      bootstrap: async () => {
        set({ status: "loading" });
        try {
          const { user } = await getCurrentSession();
          set({ user, status: "authenticated", permissions: resolvePermissions(user) });
        } catch {
          set({ user: null, status: "unauthenticated", permissions: [] });
        }
      },

      login: async (payload) => {
        set({ status: "loading" });
        const { user } = await loginWithEmail(payload);
        set({ user, status: "authenticated", permissions: resolvePermissions(user) });
      },

      register: async (payload) => {
        set({ status: "loading" });
        await registerWithEmail(payload);
        set({ status: "unauthenticated" });
      },

      logout: async () => {
        await logoutSession().catch(() => null);
        set({ user: null, status: "unauthenticated", permissions: [] });
      },

      refresh: async () => {
        const { user } = await refreshAuthSession();
        set({ user, status: "authenticated", permissions: resolvePermissions(user) });
      },
    }),
    { name: "auth" }
  )
);

function resolvePermissions(user: AuthUser): string[] {
  const base = ["audit:read", "report:read"];
  if (user.role === "ADMIN") return [...base, "audit:write", "report:write", "user:manage"];
  if (user.role === "REVIEWER") return [...base, "audit:write", "report:write"];
  return base;
}
