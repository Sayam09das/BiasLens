"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-xl rounded-4xl border-[#FECACA] bg-white shadow-[0_24px_64px_rgba(13,12,34,0.08)]">
        <CardContent className="p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF2F2] text-[#EF4444]">
            <AlertTriangle size={24} />
          </span>
          <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
            Dashboard temporarily unavailable
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#6E6D7A]">
            We hit an unexpected issue while loading your protected workspace.
          </p>
          {error.message ? (
            <p className="mt-4 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3 text-left text-sm text-[#6E6D7A]">
              {error.message}
            </p>
          ) : null}
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              onClick={reset}
              className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              <RotateCcw size={16} />
              <span className="ml-2">Retry dashboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
