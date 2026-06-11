"use client";

import * as React from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import type { GradientConfig } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SliderRow,
  ColorRow,
  CodeBlock,
  AdSlot,
  SaveBar,
} from "@/components/controls";
import { SavedDesigns } from "@/components/saved-designs";
import { useSaveDesign } from "@/components/use-save-design";
import { PanelSection, WorkspaceLayout } from "@/components/app-workspace";

/* ------------------------------ Config logic ------------------------------ */

const DEFAULT_GRADIENT: GradientConfig = {
  type: "linear",
  angle: 135,
  color1: "#6366F1",
  color2: "#EC4899",
};

const PRESETS: { name: string; config: GradientConfig }[] = [
  { name: "Sunset", config: { type: "linear", angle: 135, color1: "#FF512F", color2: "#DD2476" } },
  { name: "Ocean", config: { type: "linear", angle: 120, color1: "#2193B0", color2: "#6DD5ED" } },
  { name: "Grape", config: { type: "linear", angle: 135, color1: "#8E2DE2", color2: "#4A00E0" } },
  { name: "Lime", config: { type: "linear", angle: 100, color1: "#A8FF78", color2: "#78FFD6" } },
  { name: "Ember", config: { type: "radial", angle: 0, color1: "#F12711", color2: "#F5AF19" } },
  { name: "Night", config: { type: "linear", angle: 160, color1: "#0F2027", color2: "#2C5364" } },
];

function parseGradient(config: Record<string, unknown>): GradientConfig {
  return { ...DEFAULT_GRADIENT, ...(config as Partial<GradientConfig>) };
}

export function gradientToCss(c: GradientConfig): string {
  if (c.type === "radial") {
    return `radial-gradient(circle, ${c.color1} 0%, ${c.color2} 100%)`;
  }
  return `linear-gradient(${c.angle}deg, ${c.color1} 0%, ${c.color2} 100%)`;
}

export function gradientToClass(c: GradientConfig): string {
  const c1 = c.color1.toUpperCase();
  const c2 = c.color2.toUpperCase();
  if (c.type === "radial") {
    return `bg-[radial-gradient(circle,${c1},${c2})]`;
  }
  return `bg-[linear-gradient(${c.angle}deg,${c1},${c2})]`;
}

/* --------------------------------- Tool ---------------------------------- */

export function GradientTool({
  showToast,
  onCopy,
}: {
  showToast: (msg: string, ok?: boolean) => void;
  onCopy: (text: string) => void;
}) {
  const [cfg, setCfg] = React.useState<GradientConfig>(DEFAULT_GRADIENT);
  const [name, setName] = React.useState("");

  const set = React.useCallback(
    <K extends keyof GradientConfig>(key: K, value: GradientConfig[K]) =>
      setCfg((prev) => ({ ...prev, [key]: value })),
    []
  );

  const { saving, save, reloadSignal } = useSaveDesign("gradient", showToast);

  const classString = React.useMemo(() => gradientToClass(cfg), [cfg]);
  const jsxSnippet = `<div className="${classString}" />`;
  const css = React.useMemo(() => gradientToCss(cfg), [cfg]);

  const applyConfig = React.useCallback((config: Record<string, unknown>) => {
    setCfg(parseGradient(config));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <WorkspaceLayout
        sidebar={
          <div className="scroll-panel flex flex-col">
            <PanelSection
              title="Presets"
              description="Popular gradient combinations."
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCfg(DEFAULT_GRADIENT)}
                  className="gap-1.5"
                >
                  <ArrowCounterClockwise weight="bold" className="size-3.5" />
                  Reset
                </Button>
              }
            >
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((p) => (
                  <Button
                    key={p.name}
                    size="sm"
                    variant="outline"
                    onClick={() => setCfg(p.config)}
                  >
                    {p.name}
                  </Button>
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Gradient" description="Type, angle, and direction.">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={cfg.type === "linear" ? "default" : "outline"}
                    onClick={() => set("type", "linear")}
                  >
                    Linear
                  </Button>
                  <Button
                    size="sm"
                    variant={cfg.type === "radial" ? "default" : "outline"}
                    onClick={() => set("type", "radial")}
                  >
                    Radial
                  </Button>
                </div>
              </div>
              <div
                className={cn(
                  "transition-opacity",
                  cfg.type === "radial" && "pointer-events-none opacity-40"
                )}
              >
                <SliderRow
                  label="Angle"
                  value={cfg.angle}
                  min={0}
                  max={360}
                  unit="°"
                  onChange={(v) => set("angle", v)}
                />
              </div>
            </PanelSection>

            <PanelSection title="Colors" description="Two stops for the blend.">
              <ColorRow label="Color 1" value={cfg.color1} onChange={(v) => set("color1", v)} />
              <ColorRow label="Color 2" value={cfg.color2} onChange={(v) => set("color2", v)} />
            </PanelSection>
          </div>
        }
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 p-3 sm:p-4">
          <div className="preview-frame overflow-hidden">
            <div
              className="min-h-[min(360px,50vh)]"
              style={{ backgroundImage: css }}
            />
          </div>

          <AdSlot placement="gradient" label="In-content · responsive" />

          <div className="code-panel rounded-xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-foreground/[0.04]">
            <p className="panel-section-title mb-1">Generated code</p>
            <p className="mb-3 text-xs text-muted-foreground">Copy the Tailwind background class or JSX.</p>
            <Tabs defaultValue="classes">
              <TabsList>
                <TabsTrigger value="classes">Tailwind</TabsTrigger>
                <TabsTrigger value="jsx">JSX</TabsTrigger>
              </TabsList>
              <TabsContent value="classes">
                <CodeBlock code={classString} onCopy={onCopy} />
              </TabsContent>
              <TabsContent value="jsx">
                <CodeBlock code={jsxSnippet} onCopy={onCopy} />
              </TabsContent>
            </Tabs>
            <SaveBar
              name={name}
              onNameChange={setName}
              saving={saving}
              onSave={() => save({ name, classString, config: cfg })}
            />
          </div>
        </div>
      </WorkspaceLayout>

      <SavedDesigns
        tool="gradient"
        reloadSignal={reloadSignal}
        onApply={applyConfig}
        onCopy={onCopy}
        showToast={showToast}
        getLabel={(item) =>
          item.name || (item.config as Partial<GradientConfig>).type || "Gradient"
        }
        renderPreview={(config) => (
          <div
            className="h-full w-full"
            style={{ backgroundImage: gradientToCss(parseGradient(config)) }}
          />
        )}
      />
    </>
  );
}
