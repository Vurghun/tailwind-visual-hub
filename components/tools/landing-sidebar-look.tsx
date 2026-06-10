"use client";

import { ArrowCounterClockwise, Palette } from "@phosphor-icons/react";

import type { LandingConfig } from "@/lib/supabase";
import {
  SliderRow,
  ColorRow,
  SegmentedRow,
} from "@/components/controls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COLOR_SWATCHES = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
  "#10B981",
  "#0EA5E9",
  "#EF4444",
  "#14B8A6",
];

export function LandingSidebarLook({
  cfg,
  onResetTemplate,
  onSet,
}: {
  cfg: LandingConfig;
  onResetTemplate: () => void;
  onSet: <K extends keyof LandingConfig>(key: K, value: LandingConfig[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Palette weight="bold" className="size-4" />
            Site look
          </CardTitle>
          <CardDescription>
            Colors and typography for the whole site. Pick a starting layout in the{" "}
            <span className="font-medium text-foreground">Templates</span> tab.
          </CardDescription>
          <CardAction>
            <Button size="sm" variant="ghost" onClick={onResetTemplate} className="gap-1.5">
              <ArrowCounterClockwise weight="bold" className="size-3.5" />
              Reset template
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <ColorRow label="Brand color" value={cfg.brandColor} onChange={(v) => onSet("brandColor", v)} />
          <div className="flex flex-wrap gap-2">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Use ${c}`}
                onClick={() => onSet("brandColor", c)}
                className="size-6 rounded-none border border-border transition-transform hover:scale-110"
                style={{ background: c }}
              />
            ))}
          </div>
          <SegmentedRow
            label="Font"
            value={cfg.font}
            options={[
              { value: "sans", label: "Sans" },
              { value: "serif", label: "Serif" },
              { value: "mono", label: "Mono" },
            ]}
            onChange={(v) => onSet("font", v)}
          />
          <SegmentedRow
            label="Light or dark"
            value={cfg.mode}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
            onChange={(v) => onSet("mode", v)}
          />
          <SegmentedRow
            label="Shadow"
            value={cfg.shadow}
            options={[
              { value: "none", label: "None" },
              { value: "soft", label: "Soft" },
              { value: "sharp", label: "Sharp" },
              { value: "glow", label: "Glow" },
            ]}
            onChange={(v) => onSet("shadow", v)}
          />
          <SliderRow label="Round corners" value={cfg.radius} min={0} max={28} onChange={(v) => onSet("radius", v)} />
          <SegmentedRow
            label="Spacing"
            value={cfg.density}
            options={[
              { value: "compact", label: "Tight" },
              { value: "cozy", label: "Normal" },
              { value: "spacious", label: "Loose" },
            ]}
            onChange={(v) => onSet("density", v)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
