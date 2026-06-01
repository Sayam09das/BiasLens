"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SelectValueProps = {
  placeholder?: string;
};

function SelectValueImpl({ placeholder }: SelectValueProps & { value?: string }) {
  const ctx = React.useContext(SelectContext);
  const value = ctx?.value;
  if (!value) {
    return (
      <span className="text-sm text-[color:var(--foreground-secondary)]">
        {placeholder ?? "Select"}
      </span>
    );
  }
  return <span className="text-sm text-[color:var(--foreground)]">{value}</span>;
}

type SelectContextValue = {
  value: string;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const ctx: SelectContextValue = React.useMemo(
    () => ({ value, setValue: onValueChange, open, setOpen }),
    [value, onValueChange, open],
  );

  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger must be used within <Select />");

  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      onClick={() => ctx.setOpen((v) => !v)}
      className={cn(
        "inline-flex w-full items-center justify-between gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--background-secondary)] px-4 py-2.5 text-left text-sm text-[color:var(--foreground)] outline-none transition hover:bg-white",
        className,
      )}
      {...props}
    />
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return (
    <SelectValueImpl placeholder={placeholder} />
  );
}

export function SelectContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  const ref = React.useRef<HTMLDivElement | null>(null);

  if (!ctx) throw new Error("SelectContent must be used within <Select />");

  React.useEffect(() => {
    if (!ctx.open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) ctx.setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [ctx]);

  if (!ctx.open) return null;

  return (
    <div
      ref={ref}
      role="listbox"
      className={cn(
        "absolute z-50 mt-2 w-full rounded-[1.25rem] border border-[color:var(--border)] bg-white p-2 shadow-[0_24px_60px_rgba(13,12,34,0.14)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be used within <Select />");

  const active = ctx.value === value;

  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={() => {
        ctx.setValue(value);
        ctx.setOpen(false);
      }}
      className={cn(
        "w-full rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-[color:var(--background-secondary)]",
        active && "bg-[color:var(--background-secondary)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

