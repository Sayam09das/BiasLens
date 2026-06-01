"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";
import { AnalyticsProvider } from "./AnalyticsProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <AnalyticsProvider>
            <ToastProvider>{children}</ToastProvider>
          </AnalyticsProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
