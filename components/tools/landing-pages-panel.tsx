"use client";

import * as React from "react";
import { FilePlus, Trash, Files } from "@phosphor-icons/react";

import { PanelSection } from "@/components/app-workspace";
import type { LandingConfig } from "@/lib/supabase";
import { addPage, removePage, renamePage, withActivePageId } from "@/lib/landing-model";
import { Button } from "@/components/ui/button";
import { uiInputSm } from "@/lib/ui";
import { cn } from "@/lib/utils";

export function LandingPagesPanel({
  cfg,
  onApply,
  showToast,
}: {
  cfg: LandingConfig;
  onApply: (cfg: LandingConfig) => void;
  showToast: (msg: string, ok?: boolean) => void;
}) {
  const [newName, setNewName] = React.useState("About");

  return (
    <PanelSection
      title="Pages"
      description="Multi-page sites — each page has its own sections. Theme is shared."
    >
      <ul className="flex flex-col gap-1.5">
        {cfg.pages.map((page) => {
          const active = page.id === cfg.activePageId;
          return (
            <li
              key={page.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2 py-1.5",
                active ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"
              )}
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                onClick={() => onApply(withActivePageId(cfg, page.id))}
              >
                <Files weight={active ? "fill" : "regular"} className="size-3.5 shrink-0 text-primary" />
                <input
                  value={page.name}
                  onChange={(e) => onApply(renamePage(cfg, page.id, e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(uiInputSm, "h-7 min-w-0 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-1")}
                />
              </button>
              {cfg.pages.length > 1 ? (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Delete ${page.name}`}
                  onClick={() => {
                    onApply(removePage(cfg, page.id));
                    showToast(`Removed “${page.name}”`);
                  }}
                >
                  <Trash weight="bold" className="size-3.5 text-destructive" />
                </Button>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Page name"
          className={cn(uiInputSm, "min-w-0 flex-1")}
        />
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 shrink-0"
          onClick={() => {
            const name = newName.trim() || "New page";
            onApply(addPage(cfg, name));
            setNewName("");
            showToast(`Added “${name}”`);
          }}
        >
          <FilePlus weight="bold" className="size-3.5" />
          Add
        </Button>
      </div>
    </PanelSection>
  );
}
