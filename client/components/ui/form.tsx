import * as React from "react";

import { cn } from "@/lib/utils";

export function Form({
  className,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form className={cn("space-y-6", className)} {...props} />;
}

export function FormField({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormSection({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-[1.5rem] border border-[color:var(--border)] bg-white/90 p-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-[color:var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export const FormInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 text-sm text-[color:var(--foreground)] shadow-sm transition placeholder:text-[color:var(--foreground-muted)] focus:border-[color:var(--primary)] focus:outline-none focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]",
        className,
      )}
      {...props}
    />
  );
});

FormInput.displayName = "FormInput";

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--foreground)] shadow-sm transition placeholder:text-[color:var(--foreground-muted)] focus:border-[color:var(--primary)] focus:outline-none focus:ring-4 focus:ring-[rgba(37,99,235,0.12)]",
        className,
      )}
      {...props}
    />
  );
});

FormTextarea.displayName = "FormTextarea";

export function FormHelper({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-[color:var(--foreground-muted)]", className)}
      {...props}
    />
  );
}

export function FormMessage({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs font-medium text-[color:var(--danger)]", className)}
      {...props}
    />
  );
}
