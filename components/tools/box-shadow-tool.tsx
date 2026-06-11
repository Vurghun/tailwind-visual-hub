"use client";

import * as React from "react";
import {
  ArrowsOutCardinal,
  Drop,
  Stack,
  ArrowCounterClockwise,
  Palette,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { hexToRgb, nearestBlurToken } from "@/lib/css";
import type { ShadowConfig } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

const DEFAULT_SHADOW: ShadowConfig = {
  offsetX: 0,
  offsetY: 20,
  blur: 40,
  spread: -8,
  shadowOpacity: 45,
  radius: 24,
  shadowColor: "#000000",
  bgColor: "#6366F1",
  glass: false,
  backdropBlur: 12,
  bgOpacity: 20,
  inset: false,
};

const PRESETS: { name: string; config: ShadowConfig }[] = [
  {
    name: "Soft",
    config: { ...DEFAULT_SHADOW, offsetY: 18, blur: 40, spread: -10, shadowOpacity: 25, radius: 20 },
  },
  {
    name: "Material",
    config: { ...DEFAULT_SHADOW, offsetY: 6, blur: 16, spread: 0, shadowOpacity: 24, radius: 8, bgColor: "#3B82F6" },
  },
  {
    name: "Frosted",
    config: { ...DEFAULT_SHADOW, glass: true, backdropBlur: 16, bgOpacity: 25, bgColor: "#FFFFFF", offsetY: 8, blur: 32, spread: -4, shadowOpacity: 20, radius: 20 },
  },
  {
    name: "Brutal",
    config: { ...DEFAULT_SHADOW, offsetX: 8, offsetY: 8, blur: 0, spread: 0, shadowOpacity: 100, radius: 0, bgColor: "#FACC15" },
  },
  {
    name: "Glow",
    config: { ...DEFAULT_SHADOW, offsetX: 0, offsetY: 0, blur: 45, spread: 5, shadowOpacity: 70, radius: 24, shadowColor: "#8B5CF6", bgColor: "#8B5CF6" },
  },
  {
    name: "Inset",
    config: { ...DEFAULT_SHADOW, inset: true, offsetY: 4, blur: 14, spread: 0, shadowOpacity: 35, radius: 16, bgColor: "#E5E7EB" },
  },
];

function parseShadow(config: Record<string, unknown>): ShadowConfig {
  return { ...DEFAULT_SHADOW, ...(config as Partial<ShadowConfig>) };
}

export function shadowToStyle(c: ShadowConfig): React.CSSProperties {
  const s = hexToRgb(c.shadowColor);
  const bg = hexToRgb(c.bgColor);
  const shadow = `${c.inset ? "inset " : ""}${c.offsetX}px ${c.offsetY}px ${c.blur}px ${c.spread}px rgba(${s.r}, ${s.g}, ${s.b}, ${(
    c.shadowOpacity / 100
  ).toFixed(2)})`;
  return {
    boxShadow: shadow,
    borderRadius: `${c.radius}px`,
    backgroundColor: c.glass
      ? `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${(c.bgOpacity / 100).toFixed(2)})`
      : c.bgColor,
    backdropFilter: c.glass ? `blur(${c.backdropBlur}px)` : undefined,
    WebkitBackdropFilter: c.glass ? `blur(${c.backdropBlur}px)` : undefined,
    border: c.glass ? "1px solid rgba(255,255,255,0.18)" : undefined,
  };
}

export function shadowToClass(c: ShadowConfig): string {
  const s = hexToRgb(c.shadowColor);
  const shadowToken = `shadow-[${c.inset ? "inset_" : ""}${c.offsetX}px_${c.offsetY}px_${c.blur}px_${c.spread}px_rgba(${s.r},${s.g},${s.b},${(
    c.shadowOpacity / 100
  ).toFixed(2)})]`;
  const classes: string[] = [shadowToken, `rounded-[${c.radius}px]`];
  if (c.glass) {
    classes.push(`bg-[${c.bgColor.toUpperCase()}]/${c.bgOpacity}`);
    classes.push(nearestBlurToken(c.backdropBlur));
    classes.push("border", "border-white/20");
  } else {
    classes.push(`bg-[${c.bgColor.toUpperCase()}]`);
  }
  return classes.join(" ");
}

/* --------------------------------- Tool ---------------------------------- */

export function BoxShadowTool({
  showToast,
  onCopy,
}: {
  showToast: (msg: string, ok?: boolean) => void;
  onCopy: (text: string) => void;
}) {
  const [cfg, setCfg] = React.useState<ShadowConfig>(DEFAULT_SHADOW);
  const [name, setName] = React.useState("");

  const set = React.useCallback(
    <K extends keyof ShadowConfig>(key: K, value: ShadowConfig[K]) =>
      setCfg((prev) => ({ ...prev, [key]: value })),
    []
  );

  const { saving, save, reloadSignal } = useSaveDesign("box-shadow", showToast);

  const classString = React.useMemo(() => shadowToClass(cfg), [cfg]);
  const jsxSnippet = `<div className="${classString}" />`;
  const previewStyle = React.useMemo(() => shadowToStyle(cfg), [cfg]);

  const applyConfig = React.useCallback((config: Record<string, unknown>) => {
    setCfg(parseShadow(config));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Box Shadow &amp; Glassmorphism Generator
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Tweak the controls, watch the live preview, and copy production-ready
          Tailwind CSS classes in one click.
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
                  onClick={() => setCfg(DEFAULT_SHADOW)}
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
                <ArrowsOutCardinal weight="bold" className="size-4" />
                Shadow
              </CardTitle>
              <CardDescription>
                Position, blur and spread of the drop shadow.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SliderRow label="X Offset" value={cfg.offsetX} min={-100} max={100} onChange={(v) => set("offsetX", v)} />
              <SliderRow label="Y Offset" value={cfg.offsetY} min={-100} max={100} onChange={(v) => set("offsetY", v)} />
              <SliderRow label="Blur" value={cfg.blur} min={0} max={150} onChange={(v) => set("blur", v)} />
              <SliderRow label="Spread" value={cfg.spread} min={-50} max={50} onChange={(v) => set("spread", v)} />
              <SliderRow label="Opacity" value={cfg.shadowOpacity} min={0} max={100} unit="%" onChange={(v) => set("shadowOpacity", v)} />
              <SliderRow label="Border Radius" value={cfg.radius} min={0} max={100} onChange={(v) => set("radius", v)} />
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Inset shadow
                </label>
                <Switch checked={cfg.inset} onCheckedChange={(v) => set("inset", v)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Drop weight="bold" className="size-4" />
                Colors
              </CardTitle>
              <CardDescription>
                Shadow tint and the element background.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ColorRow label="Shadow color" value={cfg.shadowColor} onChange={(v) => set("shadowColor", v)} />
              <ColorRow label="Element background" value={cfg.bgColor} onChange={(v) => set("bgColor", v)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stack weight="bold" className="size-4" />
                Glassmorphism
              </CardTitle>
              <CardDescription>
                Frost the element with a backdrop blur and translucent fill.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Enable glass mode
                </label>
                <Switch checked={cfg.glass} onCheckedChange={(v) => set("glass", v)} />
              </div>
              <div
                className={cn(
                  "flex flex-col gap-5 transition-opacity",
                  !cfg.glass && "pointer-events-none opacity-40"
                )}
              >
                <SliderRow label="Backdrop blur" value={cfg.backdropBlur} min={0} max={64} onChange={(v) => set("backdropBlur", v)} />
                <SliderRow label="Background opacity" value={cfg.bgOpacity} min={0} max={100} unit="%" onChange={(v) => set("bgOpacity", v)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas + code */}
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                The box reacts to every control in real time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-xl border border-border demo-gradient-bg p-8">
                <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(45deg,rgba(255,255,255,0.18)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.18)_75%),linear-gradient(45deg,rgba(255,255,255,0.18)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.18)_75%)] [background-position:0_0,12px_12px] [background-size:24px_24px]" />
                <div className="pointer-events-none absolute -left-10 top-6 size-40 rounded-full bg-yellow-300/40 blur-2xl" />
                <div className="pointer-events-none absolute bottom-4 right-8 size-44 rounded-full bg-emerald-300/30 blur-2xl" />
                <div
                  style={previewStyle}
                  className="relative flex size-40 items-center justify-center text-center"
                >
                  {cfg.glass && (
                    <span className="px-3 text-xs font-medium text-white/90 drop-shadow">
                      Glass
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <AdSlot placement="shadow" label="In-content · responsive" />

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
        tool="box-shadow"
        reloadSignal={reloadSignal}
        onApply={applyConfig}
        onCopy={onCopy}
        showToast={showToast}
        getLabel={(item) =>
          item.name || ((item.config as Partial<ShadowConfig>).glass ? "Glass" : "Shadow")
        }
        renderPreview={(config) => {
          const c = parseShadow(config);
          return (
            <div className="relative flex h-full w-full items-center justify-center demo-gradient-bg">
              <div
                style={shadowToStyle(c)}
                className="size-12 transition-transform group-hover:scale-110"
              />
            </div>
          );
        }}
      />
    </>
  );
}
