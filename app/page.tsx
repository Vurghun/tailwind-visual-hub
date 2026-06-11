"use client";

import * as React from "react";
import {
  Sparkle,
  Stack,
  GradientIcon,
  Browser,
} from "@phosphor-icons/react";

import { ToolContextBar } from "@/components/app-workspace";
import { AdSlot } from "@/components/controls";
import { SiteFooter } from "@/components/site-shell";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toast, useToast } from "@/components/toast";
import { LandingBuilder } from "@/components/tools/landing-builder";
import { BoxShadowTool } from "@/components/tools/box-shadow-tool";
import { GradientTool } from "@/components/tools/gradient-tool";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TOOLS = [
  {
    id: "landing",
    label: "Website",
    short: "Build pages visually",
    icon: Browser,
    title: "Website builder",
    description: "Drag blocks onto the canvas, pick a template, then export HTML.",
    steps: ["Choose a template or start blank", "Edit on the canvas", "Save or export HTML"],
  },
  {
    id: "box-shadow",
    label: "Shadow",
    short: "Box shadow & glass",
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
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

export default function Home() {
  const { toast, showToast } = useToast();
  const [tool, setTool] = React.useState<ToolId>("landing");

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
          <div className="app-shell-inner">
            <div className="flex min-w-0 items-center justify-between gap-4 lg:justify-start">
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

            <span className="app-shell-divider" aria-hidden />

            <TabsList
              variant="line"
              className={cn(
                "app-tool-nav h-auto w-full flex-1 justify-start gap-0 bg-transparent p-0",
                "max-lg:grid max-lg:grid-cols-3 max-lg:rounded-xl max-lg:border max-lg:border-border/80 max-lg:bg-muted/30 max-lg:p-1 max-lg:shadow-sm"
              )}
            >
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <TabsTrigger
                    key={t.id}
                    value={t.id}
                    className={cn(
                      "gap-2 px-3 py-2 data-active:after:opacity-100",
                      "max-lg:flex-1 max-lg:flex-col max-lg:gap-1 max-lg:rounded-lg max-lg:py-2.5 max-lg:text-[10px] max-lg:data-active:bg-background max-lg:data-active:shadow-xs",
                      "lg:px-4"
                    )}
                  >
                    <Icon weight="bold" className="size-4 shrink-0" />
                    <span className="font-medium">{t.label}</span>
                    <span className="hidden text-[10px] font-normal text-muted-foreground lg:inline">
                      · {t.short}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <ThemeToggle className="hidden shrink-0 rounded-lg lg:inline-flex" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 px-3 py-4 sm:px-4 lg:py-5">
          <ToolContextBar
            title={active.title}
            description={active.description}
            steps={active.steps}
          />

          <TabsContent value="landing" className="mt-0 outline-none">
            <LandingBuilder showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
          <TabsContent value="box-shadow" className="mt-0 outline-none">
            <BoxShadowTool showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
          <TabsContent value="gradient" className="mt-0 outline-none">
            <GradientTool showToast={showToast} onCopy={handleCopy} />
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
