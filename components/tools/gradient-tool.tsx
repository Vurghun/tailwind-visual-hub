"use client";

import * as React from "react";
import {
  Palette,
  ArrowCounterClockwise,
  GradientIcon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import type { GradientConfig } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Gradient Generator
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Blend two colors into a linear or radial gradient and grab the
          Tailwind background class instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* Controls */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette weight="bold" className="size-4" />
                Presets
              </CardTitle>
              <CardAction>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCfg(DEFAULT_GRADIENT)}
                  className="gap-1.5"
                >
                  <ArrowCounterClockwise weight="bold" className="size-3.5" />
                  Reset
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GradientIcon weight="bold" className="size-4" />
                Gradient
              </CardTitle>
              <CardDescription>Type, direction and color stops.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Type
                </label>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette weight="bold" className="size-4" />
                Colors
              </CardTitle>
              <CardDescription>The two gradient stops.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ColorRow label="Color 1" value={cfg.color1} onChange={(v) => set("color1", v)} />
              <ColorRow label="Color 2" value={cfg.color2} onChange={(v) => set("color2", v)} />
            </CardContent>
          </Card>
        </div>

        {/* Canvas + code */}
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                The gradient updates in real time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="min-h-[340px] rounded-xl border border-border shadow-sm"
                style={{ backgroundImage: css }}
              />
            </CardContent>
          </Card>

          <AdSlot label="AdSense Ad Slot — In-content (728x90 / responsive)" />

          <Card>
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>
                Copy the Tailwind classes or full JSX, name it, and save.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="classes">
                <TabsList>
                  <TabsTrigger value="classes">Tailwind Classes</TabsTrigger>
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
            </CardContent>
          </Card>
        </div>
      </div>

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
