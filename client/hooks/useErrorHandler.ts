import { useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api";

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown, fallback = "Something went wrong") => {
      if (error instanceof ApiError) {
        toast(error.message, error.status >= 500 ? "error" : "warning");
      } else if (error instanceof Error) {
        toast(error.message || fallback, "error");
      } else {
        toast(fallback, "error");
      }
    },
    [toast]
  );

  return { handleError };
}
