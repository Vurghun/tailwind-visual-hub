"use client";

import * as React from "react";
import { Check, Warning } from "@phosphor-icons/react";

import { uiPanel, uiSuccess, uiWarning } from "@/lib/ui";
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
      <div
        className={cn(
          uiPanel,
          "flex items-center gap-2 px-4 py-2.5 text-sm font-medium shadow-md"
        )}
      >
        {toast?.ok ? (
          <Check weight="bold" className={cn("size-4", uiSuccess)} />
        ) : (
          <Warning weight="bold" className={cn("size-4", uiWarning)} />
        )}
        {toast?.msg}
      </div>
    </div>
  );
}
