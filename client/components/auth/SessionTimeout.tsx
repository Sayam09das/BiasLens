"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface SessionTimeoutProps {
  timeoutInSeconds?: number;
  warningAtSeconds?: number;
  isActive?: boolean;
  onExtendSession?: () => Promise<void> | void;
  onSessionExpired?: () => Promise<void> | void;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function SessionTimeout({
  timeoutInSeconds = 30 * 60,
  warningAtSeconds = 2 * 60,
  isActive = true,
  onExtendSession,
  onSessionExpired,
}: SessionTimeoutProps) {
  const [timeLeft, setTimeLeft] = useState(timeoutInSeconds);
  const [isExtending, setIsExtending] = useState(false);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isActive]);

  useEffect(() => {
    if (timeLeft === 0 && !expiredRef.current) {
      expiredRef.current = true;
      void onSessionExpired?.();
    }
  }, [onSessionExpired, timeLeft]);

  const isWarningVisible = useMemo(
    () => isActive && timeLeft > 0 && timeLeft <= warningAtSeconds,
    [isActive, timeLeft, warningAtSeconds],
  );

  if (!isWarningVisible) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-md rounded-[1.75rem] border-[#FDE68A] bg-white shadow-[0_24px_64px_rgba(13,12,34,0.12)]">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F59E0B]">
            {timeLeft === 0 ? (
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Clock3 className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0D0C22]">
              {timeLeft === 0 ? "Session expired" : "Session ending soon"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#6E6D7A]">
              {timeLeft === 0
                ? "Your secure session has ended. Sign in again to continue working."
                : `For security, your session will expire in ${formatTime(timeLeft)} unless you extend it.`}
            </p>
            {timeLeft > 0 ? (
              <div className="mt-4 flex items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8]"
                  disabled={isExtending}
                  onClick={async () => {
                    setIsExtending(true);
                    try {
                      await onExtendSession?.();
                      setTimeLeft(timeoutInSeconds);
                      expiredRef.current = false;
                    } finally {
                      setIsExtending(false);
                    }
                  }}
                >
                  {isExtending ? "Extending..." : "Stay signed in"}
                </Button>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#6E6D7A]">
                  {formatTime(timeLeft)} remaining
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
