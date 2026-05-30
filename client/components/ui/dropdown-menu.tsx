"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownMenuContext =
  React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    throw new Error(
      "DropdownMenu components must be used within <DropdownMenu />.",
    );
  }

  return context;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
}: {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
}) {
  const { setOpen } = useDropdownMenuContext();

  return React.cloneElement(children, {
    onClick: (event: React.MouseEvent) => {
      children.props.onClick?.(event);
      setOpen((previous) => !previous);
    },
  });
}

export function DropdownMenuContent({
  align = "end",
  className,
  children,
}: {
  align?: "start" | "end";
  className?: string;
  children: React.ReactNode;
}) {
  const { open, setOpen } = useDropdownMenuContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!contentRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, setOpen]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute top-[calc(100%+0.75rem)] z-50 min-w-56 rounded-[1.25rem] border border-[color:var(--border)] bg-white p-2 shadow-[0_24px_60px_rgba(13,12,34,0.14)]",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--foreground-muted)]",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("my-2 h-px bg-[color:var(--border)]", className)}
      {...props}
    />
  );
}

export function DropdownMenuItem({
  className,
  inset,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { inset?: boolean }) {
  const { setOpen } = useDropdownMenuContext();

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm text-[color:var(--foreground)] transition hover:bg-[color:var(--background-secondary)]",
        inset && "pl-8",
        className,
      )}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
      {...props}
    />
  );
}
