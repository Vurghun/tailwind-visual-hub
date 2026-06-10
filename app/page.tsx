"use client";

import * as React from "react";
import {
  Sparkle,
  Sun,
  Moon,
  Stack,
  GradientIcon,
  Browser,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdSlot } from "@/components/controls";
import { Toast, useToast } from "@/components/toast";
import { LandingBuilder } from "@/components/tools/landing-builder";
import { BoxShadowTool } from "@/components/tools/box-shadow-tool";
import { GradientTool } from "@/components/tools/gradient-tool";

export default function Home() {
  const { toast, showToast } = useToast();
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = React.useCallback(() => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    setIsDark(next);
  }, []);

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

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-none bg-primary text-primary-foreground">
              <Sparkle weight="fill" className="size-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-sm font-semibold tracking-tight">
                Tailwind Visual Hub
              </span>
              <span className="text-[10px] text-muted-foreground">
                Visual CSS generators for Tailwind
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-none bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground sm:inline">
              v1.1
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun weight="bold" className="size-4" />
              ) : (
                <Moon weight="bold" className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Tabs defaultValue="landing">
          <TabsList>
            <TabsTrigger value="landing">
              <Browser weight="bold" />
              Website Builder
            </TabsTrigger>
            <TabsTrigger value="box-shadow">
              <Stack weight="bold" />
              Box Shadow &amp; Glass
            </TabsTrigger>
            <TabsTrigger value="gradient">
              <GradientIcon weight="bold" />
              Gradient
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="landing">
              <LandingBuilder showToast={showToast} onCopy={handleCopy} />
            </TabsContent>
            <TabsContent value="box-shadow">
              <BoxShadowTool showToast={showToast} onCopy={handleCopy} />
            </TabsContent>
            <TabsContent value="gradient">
              <GradientTool showToast={showToast} onCopy={handleCopy} />
            </TabsContent>
          </div>
        </Tabs>

        {/* AdSense slot — bottom of page */}
        <div className="mt-8">
          <AdSlot label="AdSense Ad Slot — Footer Leaderboard (responsive)" />
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          Built with Next.js, Tailwind CSS &amp; Shadcn UI · Tailwind Visual Hub
        </div>
      </footer>

      <Toast toast={toast} />
    </div>
  );
}
