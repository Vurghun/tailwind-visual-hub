"use client";

import * as React from "react";
import { FloppyDisk } from "@phosphor-icons/react";

import type {
  LandingConfig,
  LandingSection,
  LandingSelection,
  LandingSectionId,
  SectionBg,
  SectionBlockData,
} from "@/lib/supabase";
import {
  ELEMENT_LABELS,
  FREEFORM_BLOCKS,
  isFreeformBlock,
  SECTION_LABELS,
  sectionLabel,
  loadSavedComponents,
  saveSavedComponents,
  newId,
  defaultBlockData,
} from "@/lib/landing-model";
import { PanelSection } from "@/components/app-workspace";
import { LandingBlockPalette } from "@/components/tools/landing-block-palette";
import {
  SliderRow,
  SegmentedRow,
  TextRow,
  ToggleRow,
} from "@/components/controls";
import { Button } from "@/components/ui/button";

function InspectorShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <PanelSection title={title} description={description}>
      {children}
    </PanelSection>
  );
}

export function LandingInspectorPanel({
  cfg,
  selection,
  onPatch,
  onPatchSection,
  onSetSectionBg,
  onAddBlock,
  onSaveComponent,
  showToast,
}: {
  cfg: LandingConfig;
  selection: LandingSelection;
  onPatch?: (patch: Partial<LandingConfig>) => void;
  onPatchSection: (uid: string, data: Partial<SectionBlockData>) => void;
  onSetSectionBg?: (uid: string, bg: SectionBg) => void;
  onAddBlock?: (id: LandingSectionId) => void;
  onSaveComponent: () => void;
  showToast: (msg: string, ok?: boolean) => void;
}) {
  const section: LandingSection | undefined =
    selection.kind === "section"
      ? cfg.sections.find((s) => s.uid === selection.uid)
      : selection.kind === "element"
        ? cfg.sections.find((s) => s.uid === selection.uid)
        : undefined;

  const d = section?.data ?? {};

  if (selection.kind === "none") {
    return (
      <InspectorShell
        title="Properties"
        description="Select a block on the canvas to edit it here."
      >
        {onAddBlock ? (
          <>
            <p className="text-[11px] font-medium text-muted-foreground">Quick insert</p>
            <LandingBlockPalette onAdd={onAddBlock} compact />
          </>
        ) : null}
      </InspectorShell>
    );
  }

  if (selection.kind === "frame" && onPatch) {
    if (selection.frame === "nav") {
      return (
        <InspectorShell
          title="Navigation"
          description="Edit the top bar labels."
        >
          <div className="flex flex-col gap-3">
            <TextRow label="Site name" value={cfg.brandName} onChange={(v) => onPatch({ brandName: v })} />
            <TextRow label="Button label" value={cfg.ctaPrimary} onChange={(v) => onPatch({ ctaPrimary: v })} />
          </div>
        </InspectorShell>
      );
    }
    return (
      <InspectorShell title="Hero banner" description="Main intro at the top of the page.">
        <div className="flex flex-col gap-3">
          <TextRow label="Badge (optional)" value={cfg.heroBadge} onChange={(v) => onPatch({ heroBadge: v })} />
          <TextRow label="Headline" value={cfg.heroHeadline} multiline onChange={(v) => onPatch({ heroHeadline: v })} />
          <TextRow label="Subtitle" value={cfg.heroSubtitle} multiline onChange={(v) => onPatch({ heroSubtitle: v })} />
          <TextRow
            label="Image URL (optional)"
            value={cfg.heroImage}
            placeholder="https://…"
            onChange={(v) => onPatch({ heroImage: v.trim() })}
          />
          <TextRow label="Primary button" value={cfg.ctaPrimary} onChange={(v) => onPatch({ ctaPrimary: v })} />
          <TextRow label="Secondary button" value={cfg.ctaSecondary} onChange={(v) => onPatch({ ctaSecondary: v })} />
        </div>
      </InspectorShell>
    );
  }

  if (selection.kind === "element" && section) {
    return (
      <InspectorShell
        title={`${ELEMENT_LABELS[selection.elementId]} · ${sectionLabel(section)}`}
        description="Or click the text on the canvas to edit inline."
      >
        <div className="flex flex-col gap-4">
          {selection.elementId === "heading" && (
            <TextRow
              label="Heading"
              value={d.heading ?? ""}
              onChange={(v) => onPatchSection(section.uid, { heading: v })}
            />
          )}
          {selection.elementId === "body" && (
            <TextRow
              label="Body"
              value={d.body ?? ""}
              multiline
              onChange={(v) => onPatchSection(section.uid, { body: v })}
            />
          )}
          {selection.elementId === "image" && (
            <>
              <TextRow
                label="Image URL"
                value={d.imageUrl ?? ""}
                onChange={(v) => onPatchSection(section.uid, { imageUrl: v.trim() })}
              />
              <TextRow
                label="Alt text (for accessibility)"
                value={d.imageAlt ?? ""}
                onChange={(v) => onPatchSection(section.uid, { imageAlt: v })}
              />
            </>
          )}
          {selection.elementId === "caption" && (
            <TextRow
              label="Caption"
              value={d.caption ?? ""}
              onChange={(v) => onPatchSection(section.uid, { caption: v })}
            />
          )}
          {selection.elementId === "button-primary" && (
            <TextRow
              label="Button text"
              value={d.buttonPrimary ?? ""}
              onChange={(v) => onPatchSection(section.uid, { buttonPrimary: v })}
            />
          )}
          {selection.elementId === "button-secondary" && (
            <TextRow
              label="Button text"
              value={d.buttonSecondary ?? ""}
              onChange={(v) => onPatchSection(section.uid, { buttonSecondary: v })}
            />
          )}
        </div>
      </InspectorShell>
    );
  }

  if (!section) return null;

  const isFreeform = isFreeformBlock(section.id);

  return (
    <InspectorShell
      title={sectionLabel(section)}
      description={
        isFreeform
          ? "This block is independent — duplicates won't share text."
          : SECTION_LABELS[section.id]
      }
    >
      <div className="flex flex-col gap-4">
        {isFreeform && section.id === "content" && (
          <>
            <TextRow
              label="Heading"
              value={d.heading ?? ""}
              onChange={(v) => onPatchSection(section.uid, { heading: v })}
            />
            <TextRow
              label="Body"
              value={d.body ?? ""}
              multiline
              onChange={(v) => onPatchSection(section.uid, { body: v })}
            />
            <SegmentedRow
              label="Align"
              value={d.align ?? "left"}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
              ]}
              onChange={(v) =>
                onPatchSection(section.uid, { align: v as "left" | "center" })
              }
            />
          </>
        )}
        {isFreeform && section.id === "media" && (
          <>
            <TextRow
              label="Image URL"
              value={d.imageUrl ?? ""}
              onChange={(v) => onPatchSection(section.uid, { imageUrl: v.trim() })}
            />
            <TextRow
              label="Alt text"
              value={d.imageAlt ?? ""}
              onChange={(v) => onPatchSection(section.uid, { imageAlt: v })}
            />
            <TextRow
              label="Caption"
              value={d.caption ?? ""}
              onChange={(v) => onPatchSection(section.uid, { caption: v })}
            />
          </>
        )}
        {isFreeform && section.id === "buttons" && (
          <>
            <TextRow
              label="Primary button"
              value={d.buttonPrimary ?? ""}
              onChange={(v) => onPatchSection(section.uid, { buttonPrimary: v })}
            />
            <TextRow
              label="Secondary button (optional)"
              value={d.buttonSecondary ?? ""}
              onChange={(v) => onPatchSection(section.uid, { buttonSecondary: v })}
            />
            <SegmentedRow
              label="Align"
              value={d.align ?? "center"}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
              ]}
              onChange={(v) =>
                onPatchSection(section.uid, { align: v as "left" | "center" })
              }
            />
          </>
        )}
        {section.id === "spacer" && (
          <SliderRow
            label="Height"
            value={d.spacerHeight ?? 64}
            min={16}
            max={240}
            onChange={(v) => onPatchSection(section.uid, { spacerHeight: v })}
          />
        )}

        {onSetSectionBg && (
          <SegmentedRow
            label="Background"
            value={section.bg ?? "default"}
            options={[
              { value: "default", label: "Default" },
              { value: "surface", label: "Surface" },
              { value: "brand", label: "Brand" },
              { value: "contrast", label: "Contrast" },
            ]}
            onChange={(v) => onSetSectionBg(section.uid, v as SectionBg)}
          />
        )}

        <details className="group">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
            Spacing & responsive
          </summary>
          <div className="mt-3 flex flex-col gap-3">
            <SliderRow
              label="Padding top"
              value={d.paddingTop ?? 0}
              min={0}
              max={120}
              onChange={(v) => onPatchSection(section.uid, { paddingTop: v })}
            />
            <SliderRow
              label="Padding bottom"
              value={d.paddingBottom ?? 0}
              min={0}
              max={120}
              onChange={(v) => onPatchSection(section.uid, { paddingBottom: v })}
            />
            <ToggleRow
              label="Hide on phone"
              checked={!!d.hideOnMobile}
              onChange={(v) => onPatchSection(section.uid, { hideOnMobile: v })}
            />
            <ToggleRow
              label="Hide on tablet"
              checked={!!d.hideOnTablet}
              onChange={(v) => onPatchSection(section.uid, { hideOnTablet: v })}
            />
          </div>
        </details>

        {isFreeform && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              const list = loadSavedComponents();
              list.unshift({
                id: newId("cmp"),
                name: sectionLabel(section),
                createdAt: Date.now(),
                section: {
                  ...section,
                  uid: newId("s"),
                  data: { ...defaultBlockData(section.id), ...section.data },
                },
              });
              saveSavedComponents(list.slice(0, 30));
              onSaveComponent();
              showToast("Saved — find it under Pre-built sections → My saved");
            }}
          >
            <FloppyDisk weight="bold" className="size-3.5" />
            Save this block for reuse
          </Button>
        )}
      </div>
    </InspectorShell>
  );
}
