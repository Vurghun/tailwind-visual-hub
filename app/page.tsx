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

import { uiBadge } from "@/lib/ui";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdSlot } from "@/components/controls";
import { Toast, useToast } from "@/components/toast";
import { LandingBuilder } from "@/components/tools/landing-builder";
import { BoxShadowTool } from "@/components/tools/box-shadow-tool";
import { GradientTool } from "@/components/tools/gradient-tool";

const THEME_KEY = "tvh-theme";

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
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
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
    <div className="relative flex min-h-screen flex-col">
      <header className="app-shell-header">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20">
              <Sparkle weight="fill" className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                Tailwind Visual Hub
              </span>
              <span className="text-xs text-muted-foreground">
                Website builder · Box shadow · Gradients
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={uiBadge}>v1.1</span>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg"
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Tabs defaultValue="landing" className="gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Build &amp; generate in one place
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Design landing pages visually, then copy Tailwind for shadows and gradients — no
                switching tools.
              </p>
            </div>
            <TabsList className="h-auto w-full shrink-0 sm:w-auto">
              <TabsTrigger value="landing" className="gap-1.5 px-3 py-2">
                <Browser weight="bold" />
                <span className="hidden sm:inline">Website</span>
              </TabsTrigger>
              <TabsTrigger value="box-shadow" className="gap-1.5 px-3 py-2">
                <Stack weight="bold" />
                <span className="hidden sm:inline">Shadow</span>
              </TabsTrigger>
              <TabsTrigger value="gradient" className="gap-1.5 px-3 py-2">
                <GradientIcon weight="bold" />
                <span className="hidden sm:inline">Gradient</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="landing" className="mt-0">
            <LandingBuilder showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
          <TabsContent value="box-shadow" className="mt-0">
            <BoxShadowTool showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
          <TabsContent value="gradient" className="mt-0">
            <GradientTool showToast={showToast} onCopy={handleCopy} />
          </TabsContent>
        </Tabs>

        <div className="mt-10">
          <AdSlot placement="footer" label="Footer leaderboard · responsive" />
        </div>
      </main>

      <footer className="mt-auto border-t border-border/80 bg-background/50 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 text-center text-xs text-muted-foreground sm:px-6">
          Built with Next.js, Tailwind CSS &amp; Shadcn UI
        </div>
      </footer>

      <Toast toast={toast} />
    </div>
  );
}
