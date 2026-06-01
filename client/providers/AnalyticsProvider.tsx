"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";

interface AnalyticsContextValue {
  track: (event: string, properties?: Record<string, unknown>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
  track: () => {},
});

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const track = useCallback((event: string, properties?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "production") {
      // Replace with your analytics SDK call (e.g. analytics.track(event, properties))
      console.info("[analytics]", event, properties);
    }
  }, []);

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export const useAnalytics = () => useContext(AnalyticsContext);
