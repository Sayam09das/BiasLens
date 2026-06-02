"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";

export default function HomeRedirectGate() {
  const router = useRouter();
  const { status, bootstrap } = useAuthStore();

  useEffect(() => {
    if (status === "idle") {
      void bootstrap();
      return;
    }

    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [bootstrap, router, status]);

  return null;
}
