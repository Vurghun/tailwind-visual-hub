import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "@phosphor-icons/react/dist/ssr";

import { MarketingLayout } from "@/components/site-shell";
import { GUIDES } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Guides",
  "Tips for exporting landing pages, shadows, gradients, and multi-page sites with Tailwind CSS.",
  "/guides"
);

export default function GuidesPage() {
  return (
    <MarketingLayout>
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Guides
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Learn the tools
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Short, practical guides for exporting pages, copying Tailwind classes, and shipping faster.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card/60 p-5 shadow-sm ring-1 ring-foreground/[0.03] transition-colors hover:border-primary/30 hover:bg-card"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen weight="bold" className="size-4" />
                </span>
                <h2 className="mt-4 font-heading text-base font-semibold text-foreground group-hover:text-primary">
                  {guide.title}
                </h2>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {guide.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  {guide.readMinutes} min read
                  <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingLayout>
  );
}
