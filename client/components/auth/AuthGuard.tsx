"use client";

import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

export interface AuthGuardProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
  unauthorized?: React.ReactNode;
  checkAuth?: () => Promise<boolean> | boolean;
}

export default function AuthGuard({
  children,
  isAuthenticated,
  redirectTo = "/register",
  fallback,
  unauthorized,
  checkAuth,
}: AuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "allowed" | "blocked">(
    typeof isAuthenticated === "boolean" ? (isAuthenticated ? "allowed" : "blocked") : "checking",
  );

  useEffect(() => {
    let mounted = true;

    async function runCheck() {
      if (typeof isAuthenticated === "boolean") {
        setStatus(isAuthenticated ? "allowed" : "blocked");
        return;
      }

      if (!checkAuth) {
        setStatus("blocked");
        return;
      }

      try {
        const allowed = await checkAuth();

        if (!mounted) {
          return;
        }

        setStatus(allowed ? "allowed" : "blocked");
      } catch {
        if (mounted) {
          setStatus("blocked");
        }
      }
    }

    void runCheck();

    return () => {
      mounted = false;
    };
  }, [checkAuth, isAuthenticated]);

  useEffect(() => {
    if (status === "blocked") {
      router.replace(redirectTo);
    }
  }, [redirectTo, router, status]);

  if (status === "allowed") {
    return <>{children}</>;
  }

  if (status === "checking") {
    return (
      fallback ?? (
        <div className="flex min-h-[40vh] items-center justify-center px-4">
          <Card className="w-full max-w-md rounded-4xl border-[#E7E7E9] bg-white shadow-[0_24px_64px_rgba(13,12,34,0.08)]">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-semibold text-[#0D0C22]">Checking session</p>
                <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">
                  Verifying secure access to your BiasLens workspace.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  return (
    unauthorized ?? (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-4xl border-[#FECACA] bg-white shadow-[0_24px_64px_rgba(13,12,34,0.08)]">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF2F2] text-[#EF4444]">
              <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-semibold text-[#0D0C22]">Access restricted</p>
              <p className="mt-2 text-sm leading-6 text-[#6E6D7A]">
                You need an active authenticated session to open this route.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );
}
