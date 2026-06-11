"use client";

import * as React from "react";
import { CaretDown } from "@phosphor-icons/react";

import { PanelSection } from "@/components/app-workspace";
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
import { cn } from "@/lib/utils";

function CollapsiblePanel({
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
    <section className="panel-section">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="panel-section-header w-full text-left"
      >
        <div className="min-w-0 flex-1">
          <h3 className="panel-section-title normal-case tracking-normal text-foreground">
            {title}
          </h3>
          {description ? <p className="panel-section-desc">{description}</p> : null}
        </div>
        <CaretDown
          weight="bold"
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? <div className="panel-section-body">{children}</div> : null}
    </section>
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
    <div className="flex flex-col">
      <PanelSection
        title="Insert block"
        description="Choose a type, then click it on the canvas to edit."
      >
        <LandingBlockPalette onAdd={onAddBlock} />
      </PanelSection>

      <PanelSection title="Layers" description="Everything on your page, top to bottom.">
        <LandingLayersPanel
          cfg={cfg}
          selection={selection}
          onSelect={onSelect}
          onToggleSection={onToggleSection}
        />
      </PanelSection>

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

      <CollapsiblePanel title="Page header & hero" description="Optional chrome at the top">
        <div className="flex flex-col gap-3">
          <ToggleRow label="Top navigation" checked={cfg.showNav} onChange={(v) => onSet("showNav", v)} />
          <ToggleRow label="Hero banner" checked={cfg.showHero} onChange={(v) => onSet("showHero", v)} />
          {cfg.showHero ? (
            <ToggleRow
              label="Hero image area"
              checked={cfg.showHeroVisual}
              onChange={(v) => onSet("showHeroVisual", v)}
            />
          ) : null}
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="Section shortcuts" description="Pricing, FAQ, features, and more">
        <div className="flex flex-col gap-1.5">
          {TEMPLATE_SECTIONS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onAddBlock(id)}
              className="flex items-center justify-between rounded-md border border-border bg-background px-2.5 py-2 text-left text-xs transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <span>
                <span className="font-medium text-foreground">{SECTION_LABELS[id]}</span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  {SECTION_BLURBS[id]}
                </span>
              </span>
            </button>
          ))}
        </div>
      </CollapsiblePanel>
    </div>
  );
}
