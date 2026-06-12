"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Browser } from "@phosphor-icons/react";

import { MarketingLayout } from "@/components/site-shell";
import { EXAMPLE_CATEGORIES, EXAMPLES } from "@/lib/examples";
import { cn } from "@/lib/utils";

export default function ExamplesClient() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("category") ?? "all";
  const [category, setCategory] = React.useState(initial);

  const filtered =
    category === "all" ? EXAMPLES : EXAMPLES.filter((e) => e.category === category);

  return (
    <MarketingLayout>
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Gallery
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Example pages
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Start from a curated template — each opens in the Website builder ready to customize.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {EXAMPLE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === c.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <li key={ex.template}>
              <Link
                href={`/?tool=landing&template=${ex.template}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60 shadow-sm ring-1 ring-foreground/[0.03] transition-colors hover:border-primary/30"
              >
                <div
                  className="aspect-[5/3] w-full border-b border-border"
                  style={{
                    background:
                      ex.mode === "dark"
                        ? `linear-gradient(160deg, #0B1020, ${ex.brandColor}66)`
                        : `linear-gradient(160deg, #fff, ${ex.brandColor}33)`,
                  }}
                />
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary">
                    {ex.name}
                  </h2>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {ex.tagline}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Browser weight="bold" className="size-3.5" />
                    Open in builder
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingLayout>
  );
}
