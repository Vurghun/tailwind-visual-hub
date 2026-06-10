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
import { LandingBlockPalette } from "@/components/tools/landing-block-palette";
import {
  SliderRow,
  SegmentedRow,
  TextRow,
  ToggleRow,
} from "@/components/controls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Nothing selected</CardTitle>
          <CardDescription>
            Click any block on the page, or add one above. You can also type directly on the
            canvas — no sidebar required.
          </CardDescription>
        </CardHeader>
        {onAddBlock && (
          <CardContent>
            <p className="mb-2 text-[11px] font-medium text-muted-foreground">Quick add</p>
            <LandingBlockPalette onAdd={onAddBlock} compact />
          </CardContent>
        )}
      </Card>
    );
  }

  if (selection.kind === "frame" && onPatch) {
    if (selection.frame === "nav") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Navigation</CardTitle>
            <CardDescription>Click text on the page to edit links, or use these fields.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <TextRow label="Site name" value={cfg.brandName} onChange={(v) => onPatch({ brandName: v })} />
            <TextRow label="Button label" value={cfg.ctaPrimary} onChange={(v) => onPatch({ ctaPrimary: v })} />
          </CardContent>
        </Card>
      );
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Hero banner</CardTitle>
          <CardDescription>Big intro at the top of the page — optional.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
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
        </CardContent>
      </Card>
    );
  }

  if (selection.kind === "element" && section) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {ELEMENT_LABELS[selection.elementId]} · {sectionLabel(section)}
          </CardTitle>
          <CardDescription>Or click the text on the page to edit inline.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
        </CardContent>
      </Card>
    );
  }

  if (!section) return null;

  const isFreeform = isFreeformBlock(section.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{sectionLabel(section)}</CardTitle>
        <CardDescription>
          {isFreeform
            ? "This block is yours alone — duplicates won’t share text."
            : SECTION_LABELS[section.id]}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
      </CardContent>
    </Card>
  );
}
