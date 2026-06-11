"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkle } from "@phosphor-icons/react";

import { ThemeToggle } from "@/components/theme-toggle";
import { FOOTER_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="app-shell-header">
      <div className="app-shell-inner">
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

        <span className="app-shell-divider" aria-hidden />

        <nav
          aria-label="Site"
          className="flex flex-1 flex-wrap items-center gap-1 sm:gap-2"
        >
          {FOOTER_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-muted text-foreground shadow-xs ring-1 ring-border/80"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle className="hidden shrink-0 rounded-lg lg:inline-flex" />
        <ThemeToggle className="shrink-0 rounded-lg lg:hidden" />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-background/60">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          {SITE.name} — build, preview, and copy CSS in the browser.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
