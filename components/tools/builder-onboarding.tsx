"use client";

import * as React from "react";
import { X, SquaresFour, Plus } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "tvh-onboarding-dismissed";

export function BuilderOnboarding({
  onPickTemplate,
  onDismiss,
}: {
  onPickTemplate: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl ring-1 ring-foreground/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Welcome</p>
            <h2 className="mt-1 font-heading text-lg font-semibold">Build your first page</h2>
          </div>
          <Button size="icon-sm" variant="ghost" aria-label="Dismiss" onClick={onDismiss}>
            <X weight="bold" className="size-4" />
          </Button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pick a template to get started fast, or add blocks one at a time on a blank canvas. You can
          undo anytime and export HTML when ready.
        </p>
        <ol className="mt-4 space-y-2 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">1.</span> Templates tab — SaaS, restaurant, portfolio, and more
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">2.</span> Build tab — layers, blocks, and multi-page sites
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">3.</span> Share tab — SEO, preview link, export
          </li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button className="gap-1.5" onClick={onPickTemplate}>
            <SquaresFour weight="bold" className="size-3.5" />
            Browse templates
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={onDismiss}>
            <Plus weight="bold" className="size-3.5" />
            Start blank
          </Button>
        </div>
      </div>
    </div>
  );
}

export function useBuilderOnboarding(): [boolean, () => void] {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    try {
      setShow(localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, []);

  const dismiss = React.useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }, []);

  return [show, dismiss];
}
