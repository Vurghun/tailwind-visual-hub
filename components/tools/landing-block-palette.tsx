"use client";

import {
  TextT,
  Image as ImageIcon,
  CursorClick,
  ArrowsOutLineVertical,
  Plus,
} from "@phosphor-icons/react";

import { FREEFORM_BLOCKS, SECTION_LABELS, type FreeformBlockId } from "@/lib/landing-model";
import { cn } from "@/lib/utils";

const BLOCK_ICONS = {
  content: TextT,
  media: ImageIcon,
  buttons: CursorClick,
  spacer: ArrowsOutLineVertical,
} as const;

const BLOCK_HINTS = {
  content: "Title + paragraph",
  media: "Photo or graphic",
  buttons: "Call to action",
  spacer: "Empty space",
} as const;

/** Builder UI shown inside the live preview — must not inherit page theme colors. */
const BUILDER_CHROME =
  "[color:hsl(var(--foreground))] text-foreground [&_button]:text-foreground";

export function LandingBlockPalette({
  onAdd,
  compact = false,
  embedded = false,
  className,
}: {
  onAdd: (id: FreeformBlockId) => void;
  compact?: boolean;
  /** True when rendered inside the page preview (not the sidebar). */
  embedded?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", embedded && BUILDER_CHROME, className)}>
      {FREEFORM_BLOCKS.map((id) => {
        const Icon = BLOCK_ICONS[id];
        const hint = BLOCK_HINTS[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => onAdd(id)}
            className={cn(
              "group flex flex-col items-start gap-1 border text-left transition-colors",
              embedded
                ? "rounded-lg border-dashed border-border/80 bg-background text-foreground shadow-sm hover:border-primary hover:bg-accent/50"
                : "border-border bg-card text-card-foreground hover:border-primary hover:bg-primary/5",
              compact ? "px-2.5 py-2" : "px-3 py-3"
            )}
          >
            <span className="flex w-full items-center justify-between gap-1">
              <Icon weight="bold" className="size-4 text-primary" />
              <Plus
                weight="bold"
                className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              />
            </span>
            <span
              className={cn(
                "text-xs font-semibold",
                embedded ? "text-foreground" : "text-card-foreground"
              )}
            >
              {SECTION_LABELS[id]}
            </span>
            {!compact && (
              <span className="text-[10px] leading-snug text-muted-foreground">{hint}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
