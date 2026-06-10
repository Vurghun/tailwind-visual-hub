"use client";

import * as React from "react";
import { CaretDown, TreeStructure } from "@phosphor-icons/react";

import type {
  LandingConfig,
  LandingSectionId,
  LandingSelection,
  SectionBg,
  SectionBlockData,
} from "@/lib/supabase";
import { TEMPLATE_SECTIONS, SECTION_LABELS, SECTION_BLURBS } from "@/lib/landing-model";
import { LandingBlockPalette } from "@/components/tools/landing-block-palette";
import { LandingLayersPanel } from "@/components/tools/landing-layers-panel";
import { LandingInspectorPanel } from "@/components/tools/landing-inspector-panel";
import { ToggleRow } from "@/components/controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Collapsible({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-2 px-4 py-3 text-left"
      >
        <span>
          <span className="block text-sm font-semibold">{title}</span>
          {description && (
            <span className="mt-0.5 block text-[11px] text-muted-foreground">{description}</span>
          )}
        </span>
        <CaretDown
          weight="bold"
          className={cn("mt-0.5 size-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <CardContent className="border-t border-border pt-4">{children}</CardContent>}
    </Card>
  );
}

export function LandingSidebarBuild({
  cfg,
  selection,
  onAddBlock,
  onSelect,
  onToggleSection,
  onPatch,
  onPatchSection,
  onSetSectionBg,
  onSet,
  onSaveComponent,
  showToast,
}: {
  cfg: LandingConfig;
  selection: LandingSelection;
  onAddBlock: (id: LandingSectionId) => void;
  onSelect: (sel: LandingSelection) => void;
  onToggleSection: (uid: string) => void;
  onPatch: (patch: Partial<LandingConfig>) => void;
  onPatchSection: (uid: string, data: Partial<SectionBlockData>) => void;
  onSetSectionBg: (uid: string, bg: SectionBg) => void;
  onSet: <K extends keyof LandingConfig>(key: K, value: LandingConfig[K]) => void;
  onSaveComponent: () => void;
  showToast: (msg: string, ok?: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border-dashed border-primary/30 bg-primary/[0.02]">
        <CardContent className="py-3 text-[11px] text-muted-foreground">
          Want a full landing page to start from? Open the{" "}
          <span className="font-semibold text-foreground">Templates</span> tab for SaaS,
          Startup, Agency, and more.
        </CardContent>
      </Card>

      <Card className="border-primary/25 bg-primary/[0.03]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Add a block</CardTitle>
          <CardDescription>
            Click a block type — then edit it on the page. Each one is independent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LandingBlockPalette onAdd={onAddBlock} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TreeStructure weight="bold" className="size-4" />
            What&apos;s on the page
          </CardTitle>
          <CardDescription>Click a row to select it on the canvas.</CardDescription>
        </CardHeader>
        <CardContent>
          <LandingLayersPanel
            cfg={cfg}
            selection={selection}
            onSelect={onSelect}
            onToggleSection={onToggleSection}
          />
        </CardContent>
      </Card>

      <LandingInspectorPanel
        cfg={cfg}
        selection={selection}
        onPatch={onPatch}
        onPatchSection={onPatchSection}
        onSetSectionBg={onSetSectionBg}
        onAddBlock={onAddBlock}
        onSaveComponent={onSaveComponent}
        showToast={showToast}
      />

      <Collapsible title="Page header & hero" description="Optional — turn off for a blank canvas">
        <div className="flex flex-col gap-3">
          <ToggleRow label="Show top navigation" checked={cfg.showNav} onChange={(v) => onSet("showNav", v)} />
          <ToggleRow label="Show hero banner" checked={cfg.showHero} onChange={(v) => onSet("showHero", v)} />
          {cfg.showHero && (
            <ToggleRow
              label="Show hero image area"
              checked={cfg.showHeroVisual}
              onChange={(v) => onSet("showHeroVisual", v)}
            />
          )}
        </div>
      </Collapsible>

      <Collapsible title="Pre-built sections" description="Pricing, FAQ, features — optional shortcuts">
        <div className="flex flex-col gap-1.5">
          {TEMPLATE_SECTIONS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onAddBlock(id)}
              className="flex items-center justify-between border border-border px-2.5 py-2 text-left text-xs hover:bg-accent"
            >
              <span>
                <span className="font-semibold">{SECTION_LABELS[id]}</span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  {SECTION_BLURBS[id]}
                </span>
              </span>
            </button>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}
