"use client";

import { createContext, useCallback, useContext, useEffect, ReactNode, useMemo } from "react";

import { useAuthStore } from "@/store/auth.store";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (status === "idle") {
      void bootstrap();
    }
  }, [bootstrap, status]);

  const signOut = useCallback(() => {
    void logout();
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
          }
        : null,
      isLoading: status === "idle" || status === "loading",
      signOut,
    }),
    [signOut, status, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
