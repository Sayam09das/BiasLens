import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  globalLoading: boolean;
  profileAvatar: string | null;

  // actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setGlobalLoading: (loading: boolean) => void;
  setProfileAvatar: (profileAvatar: string | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        theme: "system",
        sidebarCollapsed: false,
        activeModal: null,
        globalLoading: false,
        profileAvatar: null,

        setTheme: (theme) => set({ theme }),
        toggleSidebar: () =>
          set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        openModal: (id) => set({ activeModal: id }),
        closeModal: () => set({ activeModal: null }),
        setGlobalLoading: (globalLoading) => set({ globalLoading }),
        setProfileAvatar: (profileAvatar) => set({ profileAvatar }),
      }),
      {
        name: "biaslens-ui",
        partialize: (s) => ({
          theme: s.theme,
          sidebarCollapsed: s.sidebarCollapsed,
          profileAvatar: s.profileAvatar,
        }),
      }
    ),
    { name: "ui" }
  )
);
