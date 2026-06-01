import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  globalLoading: boolean;

  // actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        theme: "system",
        sidebarCollapsed: false,
        activeModal: null,
        globalLoading: false,

        setTheme: (theme) => set({ theme }),
        toggleSidebar: () =>
          set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        openModal: (id) => set({ activeModal: id }),
        closeModal: () => set({ activeModal: null }),
        setGlobalLoading: (globalLoading) => set({ globalLoading }),
      }),
      {
        name: "biaslens-ui",
        partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }),
      }
    ),
    { name: "ui" }
  )
);
