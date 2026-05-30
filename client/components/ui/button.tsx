import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[color:var(--primary)] text-white shadow-[0_14px_30px_rgba(37,99,235,0.24)] hover:bg-[color:var(--primary-hover)]",
  secondary:
    "bg-[color:var(--background-secondary)] text-[color:var(--foreground)] hover:bg-[color:var(--background-tertiary)]",
  ghost:
    "bg-transparent text-[color:var(--foreground-secondary)] hover:bg-[color:var(--background-secondary)] hover:text-[color:var(--foreground)]",
  outline:
    "border border-[color:var(--border)] bg-white text-[color:var(--foreground)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--background-secondary)]",
  danger:
    "bg-[color:var(--danger)] text-white shadow-[0_14px_30px_rgba(239,68,68,0.2)] hover:brightness-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      className,
      variant = "default",
      size = "md",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    if (asChild) {
      const child = React.Children.only(
        props.children,
      ) as React.ReactElement<{ className?: string }>;

      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
