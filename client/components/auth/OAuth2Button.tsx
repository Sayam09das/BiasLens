"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OAuthProvider = "google" | "github";

export interface OAuth2ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  provider: OAuthProvider;
  isLoading?: boolean;
  onClick?: (provider: OAuthProvider) => void | Promise<void>;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.34-.17-1.98H12v3.75h5.39a4.62 4.62 0 0 1-2 3.03v2.51h3.23c1.89-1.74 2.98-4.31 2.98-7.31Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.46l-3.23-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.58-4.1H3.08v2.58A9.98 9.98 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.42 13.89A5.98 5.98 0 0 1 6.1 12c0-.66.11-1.29.32-1.89V7.53H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.47l3.34-2.58Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.01c1.47 0 2.78.5 3.81 1.5l2.86-2.86C16.95 3.04 14.7 2 12 2a9.98 9.98 0 0 0-8.92 5.53l3.34 2.58c.78-2.35 2.98-4.1 5.58-4.1Z"
      />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.54-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.08 1.84 2.82 1.31 3.5 1 .11-.79.42-1.31.76-1.61-2.66-.31-5.46-1.33-5.46-5.92 0-1.31.47-2.39 1.23-3.23-.12-.3-.53-1.55.12-3.23 0 0 1.01-.32 3.3 1.23a11.36 11.36 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.68.24 2.93.12 3.23.77.84 1.23 1.92 1.23 3.23 0 4.61-2.81 5.61-5.49 5.91.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function OAuth2Button({
  provider,
  isLoading = false,
  className,
  onClick,
  disabled,
  ...props
}: OAuth2ButtonProps) {
  const label = provider === "google" ? "Continue with Google" : "Continue with GitHub";

  const icon =
    provider === "google" ? (
      <GoogleMark />
    ) : (
      <GitHubMark />
    );

  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "h-12 w-full rounded-2xl border-[#E7E7E9] bg-white text-[#0D0C22] hover:bg-[#F6F8FB]",
          className,
        )}
        disabled={disabled || isLoading}
        onClick={() => void onClick?.(provider)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <span className="mr-2">{icon}</span>
        )}
        {label}
      </Button>
    </motion.div>
  );
}
