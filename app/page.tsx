"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkle,
  Stack,
  GradientIcon,
  Browser,
  Circle,
  Palette,
  TextAa,
  Rows,
} from "@phosphor-icons/react";

import { ToolContextBar } from "@/components/app-workspace";
import { AdSlot } from "@/components/controls";
import { SiteFooter } from "@/components/site-shell";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toast, useToast } from "@/components/toast";
import { LandingBuilder } from "@/components/tools/landing-builder";
import { BoxShadowTool } from "@/components/tools/box-shadow-tool";
import { GradientTool } from "@/components/tools/gradient-tool";
import { BorderRadiusTool } from "@/components/tools/border-radius-tool";
import { ColorPaletteTool } from "@/components/tools/color-palette-tool";
import { TypographyTool } from "@/components/tools/typography-tool";
import { FlexboxTool } from "@/components/tools/flexbox-tool";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TOOLS = [
  {
    id: "landing",
    label: "Website",
    short: "Build pages",
    icon: Browser,
    title: "Website builder",
    description: "Drag blocks onto the canvas, pick a template, then export HTML.",
    steps: ["Choose a template or start blank", "Edit on the canvas", "Save or export HTML"],
  },
  {
    id: "box-shadow",
    label: "Shadow",
    short: "Box shadow",
    icon: Stack,
    title: "Box shadow generator",
    description: "Adjust shadow, radius, and glass effects — copy Tailwind classes instantly.",
    steps: ["Pick a preset or tweak sliders", "Preview updates live", "Copy classes or save"],
  },
  {
    id: "gradient",
    label: "Gradient",
    short: "CSS gradients",
    icon: GradientIcon,
    title: "Gradient generator",
    description: "Blend colors into linear or radial gradients with ready-to-use Tailwind code.",
    steps: ["Set type and angle", "Pick two colors", "Copy the background class"],
  },
  {
    id: "border-radius",
    label: "Radius",
    short: "Rounded corners",
    icon: Circle,
    title: "Border radius generator",
    description: "Dial corner radius and copy rounded-* Tailwind utilities.",
    steps: ["Pick a preset", "Adjust radius", "Copy the class"],
  },
  {
    id: "palette",
    label: "Palette",
    short: "Color scales",
    icon: Palette,
    title: "Color palette generator",
    description: "Generate a 5-step palette from your brand hex.",
    steps: ["Set brand color", "Click a swatch", "Copy bg utilities"],
  },
  {
    id: "typography",
    label: "Type",
    short: "Font scale",
    icon: TextAa,
    title: "Typography generator",
    description: "Size, weight, and line height as Tailwind text utilities.",
    steps: ["Adjust scale", "Preview live", "Copy classes"],
  },
  {
    id: "flexbox",
    label: "Flex",
    short: "Flex layout",
    icon: Rows,
    title: "Flexbox generator",
    description: "Direction, alignment, and gap — copy a flex container class string.",
    steps: ["Set direction & align", "Tune gap", "Copy flex utilities"],
  },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

function HomeInner() {
  const { toast, showToast } = useToast();
  const searchParams = useSearchParams();
  const toolParam = searchParams.get("tool") as ToolId | null;
  const templateParam = searchParams.get("template");
  const remixParam = searchParams.get("remix");
  const [tool, setTool] = React.useState<ToolId>(
    TOOLS.some((t) => t.id === toolParam) ? (toolParam as ToolId) : "landing"
  );

  React.useEffect(() => {
    if (toolParam && TOOLS.some((t) => t.id === toolParam)) {
      setTool(toolParam as ToolId);
    }
  }, [toolParam]);

  const handleCopy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      showToast("Copied to clipboard!");
    },
    [showToast]
  );

  const active = TOOLS.find((t) => t.id === tool)!;

  return (
    <div className="flex min-h-screen flex-col">
      <Tabs
        value={tool}
        onValueChange={(v) => setTool(v as ToolId)}
        className="flex min-h-screen flex-col gap-0"
      >
        <header className="app-shell-header">
          <div className="app-shell-inner flex-col gap-3 lg:flex-row lg:gap-0">
            <div className="flex min-w-0 w-full items-center justify-between gap-4 lg:w-auto lg:justify-start">
              <Link href="/" className="app-shell-brand shrink-0 transition-opacity hover:opacity-90">
                <div className="app-shell-logo">
                  <Sparkle weight="fill" className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading text-sm font-semibold tracking-tight sm:text-base">
                    {SITE.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">{SITE.tagline}</p>
                </div>
              </Link>
              <ThemeToggle className="shrink-0 rounded-lg lg:hidden" />
            </div>

            <span className="app-shell-divider hidden lg:inline" aria-hidden />

            <TabsList
              variant="line"
              className={cn(
                "app-tool-nav h-auto w-full flex-1 justify-start gap-0 overflow-x-auto bg-transparent p-0",
                "max-lg:flex max-lg:rounded-xl max-lg:border max-lg:border-border/80 max-lg:bg-muted/30 max-lg:p-1 max-lg:shadow-sm"
              )}
            >
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <TabsTrigger
                    key={t.id}
                    value={t.id}
                    className={cn(
                      "shrink-0 gap-2 px-3 py-2 data-active:after:opacity-100",
                      "max-lg:flex-col max-lg:gap-1 max-lg:rounded-lg max-lg:py-2 max-lg:text-[10px] max-lg:data-active:bg-background max-lg:data-active:shadow-xs",
                      "lg:px-3"
                    )}
                  >
                    <Icon weight="bold" className="size-4 shrink-0" />
                    <span className="font-medium">{t.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <ThemeToggle className="hidden shrink-0 rounded-lg lg:inline-flex" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 px-3 py-4 sm:px-4 lg:py-5">
          <ToolContextBar title={active.title} description={active.description} steps={active.steps} />

          <TabsContent value="landing" className="mt-0 outline-none">
            <LandingBuilder
              showToast={showToast}
              onCopy={handleCopy}
              initialTemplate={templateParam}
              remixEncoded={remixParam}
            />
          </TabsContent>
          <TabsContent value="box-shadow" className="mt-0 outline-none">
            <BoxShadowTool showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
          <TabsContent value="gradient" className="mt-0 outline-none">
            <GradientTool showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
          <TabsContent value="border-radius" className="mt-0 outline-none">
            <BorderRadiusTool showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
          <TabsContent value="palette" className="mt-0 outline-none">
            <ColorPaletteTool showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
          <TabsContent value="typography" className="mt-0 outline-none">
            <TypographyTool showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
          <TabsContent value="flexbox" className="mt-0 outline-none">
            <FlexboxTool showToast={showToast} onCopy={handleCopy} />
          </TabsContent>

          <div className="mt-8">
            <AdSlot placement="footer" label="Footer leaderboard · responsive" />
          </div>
        </main>

        <SiteFooter />
      </Tabs>

      <Toast toast={toast} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading tools…</div>}>
      <HomeInner />
    </Suspense>
  );
}
