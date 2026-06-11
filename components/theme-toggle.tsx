"use client";

import * as React from "react";
import { Moon, Sun } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

const THEME_KEY = "tvh-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = React.useCallback(() => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    setIsDark(next);
  }, []);

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={toggle}
      aria-label="Toggle theme"
      className={className}
    >
      {isDark ? <Sun weight="bold" className="size-4" /> : <Moon weight="bold" className="size-4" />}
    </Button>
  );
}
