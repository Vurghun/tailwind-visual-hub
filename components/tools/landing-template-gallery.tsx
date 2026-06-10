"use client";

import { Check, Sparkle } from "@phosphor-icons/react";

import type { LandingTemplate } from "@/lib/supabase";
import {
  TEMPLATE_CATALOG,
  TEMPLATE_CATEGORIES,
  templatesInCategory,
  type TemplateCatalogEntry,
} from "@/lib/landing-template-catalog";
import { hexToRgb } from "@/lib/css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function TemplatePreviewThumb({ entry }: { entry: TemplateCatalogEntry }) {
  const { r, g, b } = hexToRgb(entry.preview.brandColor);
  const dark = entry.preview.mode === "dark";

  return (
    <div
      className="relative aspect-[5/3] w-full overflow-hidden border-b border-border"
      style={{
        background: dark
          ? `linear-gradient(160deg, #0B1020, rgba(${r},${g},${b},0.4))`
          : `linear-gradient(160deg, #FFFFFF, rgba(${r},${g},${b},0.22))`,
      }}
    >
      <div className="absolute inset-0 flex flex-col gap-1.5 p-3">
        <div className="flex items-center gap-1.5">
          <div
            className="flex size-5 items-center justify-center text-[8px] font-bold text-white"
            style={{
              background: entry.preview.brandColor,
              borderRadius: Math.min(entry.preview.radius, 6),
            }}
          >
            {entry.preview.brandName.charAt(0).toUpperCase()}
          </div>
          <span
            className="text-[9px] font-semibold"
            style={{ color: dark ? "#F1F5F9" : "#0F172A" }}
          >
            {entry.preview.brandName}
          </span>
        </div>
        <div
          className="mt-1 line-clamp-2 text-[10px] font-semibold leading-tight"
          style={{ color: dark ? "#E2E8F0" : "#1E293B" }}
        >
          {entry.preview.headline}
        </div>
        {entry.id !== "scratch" && (
          <div className="mt-auto flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-3 flex-1 opacity-40"
                style={{
                  background: dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)",
                  borderRadius: Math.min(entry.preview.radius, 4),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateCard({
  entry,
  active,
  onUse,
}: {
  entry: TemplateCatalogEntry;
  active: boolean;
  onUse: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onUse}
      className={cn(
        "group flex w-full flex-col overflow-hidden border border-border bg-card text-left transition-all hover:border-primary hover:shadow-md",
        active && "border-primary ring-2 ring-primary/30"
      )}
    >
      <TemplatePreviewThumb entry={entry} />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold leading-tight">{entry.name}</span>
          {active && (
            <span className="flex shrink-0 items-center gap-0.5 rounded-none bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              <Check weight="bold" className="size-3" />
              Active
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">{entry.tagline}</p>
        <p className="text-[10px] text-muted-foreground">
          <span className="font-medium text-foreground">Best for:</span> {entry.bestFor}
        </p>
        <div className="flex flex-wrap gap-1">
          {entry.includes.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-none bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {entry.includes.length > 4 && (
            <span className="px-1 text-[9px] text-muted-foreground">
              +{entry.includes.length - 4} more
            </span>
          )}
        </div>
        <span className="mt-auto pt-1 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Use this template →
        </span>
      </div>
    </button>
  );
}

export function LandingTemplateGallery({
  activeTemplate,
  onUseTemplate,
  onReloadTemplate,
}: {
  activeTemplate: LandingTemplate;
  onUseTemplate: (template: LandingTemplate) => void;
  onReloadTemplate: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkle weight="fill" className="size-4 text-primary" />
            Pre-built templates
          </CardTitle>
          <CardDescription>
            Pick a full landing page to start from — hero, sections, copy, and styling included.
            You can change or delete anything after loading.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[11px] text-muted-foreground">
            Loading a template replaces your current page. Press{" "}
            <kbd className="rounded-none border border-border bg-muted px-1 font-mono text-[10px]">
              Ctrl+Z
            </kbd>{" "}
            to undo if you change your mind.
          </p>
        </CardContent>
      </Card>

      {TEMPLATE_CATEGORIES.map((cat) => {
        const items = templatesInCategory(cat.id);
        if (!items.length) return null;
        return (
          <section key={cat.id}>
            <div className="mb-3">
              <h3 className="text-sm font-semibold">{cat.label}</h3>
              <p className="text-[11px] text-muted-foreground">{cat.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((entry) => (
                <TemplateCard
                  key={entry.id}
                  entry={entry}
                  active={activeTemplate === entry.id}
                  onUse={() => onUseTemplate(entry.id)}
                />
              ))}
            </div>
          </section>
        );
      })}

      <Card>
        <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Current template:{" "}
            <span className="font-semibold text-foreground">
              {TEMPLATE_CATALOG.find((t) => t.id === activeTemplate)?.name ?? activeTemplate}
            </span>
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onReloadTemplate}
          >
            Reload this template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
