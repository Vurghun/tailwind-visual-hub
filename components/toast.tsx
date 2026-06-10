"use client";

import * as React from "react";
import { Check, Warning } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export type ToastState = { msg: string; ok: boolean } | null;

/** Tiny self-dismissing toast hook. */
export function useToast() {
  const [toast, setToast] = React.useState<ToastState>(null);

  const showToast = React.useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
  }, []);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return { toast, showToast };
}

export function Toast({ toast }: { toast: ToastState }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300",
        toast
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <div className="flex items-center gap-2 rounded-none border border-border bg-foreground px-3 py-2 text-xs font-medium text-background shadow-lg">
        {toast?.ok ? (
          <Check weight="bold" className="size-4 text-emerald-500" />
        ) : (
          <Warning weight="bold" className="size-4 text-amber-500" />
        )}
        {toast?.msg}
      </div>
    </div>
  );
}
