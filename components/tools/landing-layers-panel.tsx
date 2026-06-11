"use client";

import * as React from "react";
import {
  Eye,
  EyeSlash,
  CaretRight,
  CaretDown,
  FrameCorners,
  TextT,
  Square,
} from "@phosphor-icons/react";

import type { LandingConfig, LandingSelection } from "@/lib/supabase";
import {
  buildLayerTree,
  selectionEquals,
  selectionFromLayer,
  type LayerNode,
} from "@/lib/landing-model";
import { cn } from "@/lib/utils";

function LayerRow({
  node,
  depth,
  selection,
  onSelect,
  onToggleVisible,
}: {
  node: LayerNode;
  depth: number;
  selection: LandingSelection;
  onSelect: (sel: LandingSelection) => void;
  onToggleVisible?: (uid: string) => void;
}) {
  const [open, setOpen] = React.useState(true);
  const sel = selectionFromLayer(node);
  const selected = selectionEquals(selection, sel);
  const hasChildren = !!node.children?.length;

  return (
    <div>
      <div
        className={cn(
          "layer-row group",
          selected && "layer-row-selected"
        )}
        style={{ paddingLeft: depth * 12 + 4 }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={open ? "Collapse" : "Expand"}
            onClick={() => setOpen((o) => !o)}
            className="flex size-5 shrink-0 items-center justify-center text-muted-foreground"
          >
            {open ? (
              <CaretDown weight="bold" className="size-3" />
            ) : (
              <CaretRight weight="bold" className="size-3" />
            )}
          </button>
        ) : (
          <span className="size-5 shrink-0" />
        )}
        <button
          type="button"
          onClick={() => onSelect(sel)}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
        >
          {node.kind === "frame" ? (
            <FrameCorners weight="bold" className="size-3.5 shrink-0 opacity-60" />
          ) : node.kind === "element" ? (
            <TextT weight="bold" className="size-3.5 shrink-0 opacity-60" />
          ) : (
            <Square weight="bold" className="size-3.5 shrink-0 opacity-60" />
          )}
          <span className={cn("truncate", !node.visible && "line-through opacity-50")}>
            {node.label}
          </span>
        </button>
        {node.kind === "section" && node.uid && onToggleVisible && (
          <button
            type="button"
            aria-label={node.visible ? "Hide layer" : "Show layer"}
            onClick={() => onToggleVisible(node.uid!)}
            className="flex size-6 shrink-0 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
          >
            {node.visible ? (
              <Eye weight="bold" className="size-3.5" />
            ) : (
              <EyeSlash weight="bold" className="size-3.5" />
            )}
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div>
          {node.children!.map((child) => (
            <LayerRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selection={selection}
              onSelect={onSelect}
              onToggleVisible={onToggleVisible}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LandingLayersPanel({
  cfg,
  selection,
  onSelect,
  onToggleSection,
}: {
  cfg: LandingConfig;
  selection: LandingSelection;
  onSelect: (sel: LandingSelection) => void;
  onToggleSection: (uid: string) => void;
}) {
  const tree = React.useMemo(() => buildLayerTree(cfg), [cfg]);

  return (
    <div className="flex flex-col gap-1 py-1">
      {tree.length === 0 && (
        <div className="layer-empty">
          <p className="font-medium text-foreground/80">No blocks yet</p>
          <p className="mt-1">Use <span className="text-foreground">Insert block</span> above or pick a template.</p>
        </div>
      )}
      {tree.map((node) => (
        <LayerRow
          key={node.id}
          node={node}
          depth={0}
          selection={selection}
          onSelect={onSelect}
          onToggleVisible={onToggleSection}
        />
      ))}
    </div>
  );
}
