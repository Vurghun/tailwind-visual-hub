import type { Metadata } from "next";
import Link from "next/link";
import {
  Browser,
  Stack,
  GradientIcon,
  Code,
  FloppyDisk,
  RocketLaunch,
} from "@phosphor-icons/react/dist/ssr";

import { MarketingLayout } from "@/components/site-shell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description:
    "Learn what Tailwind Visual Hub is, who it's for, and how the website builder and CSS generators work.",
};

const FEATURES = [
  {
    icon: Browser,
    title: "Website builder",
    body: "Design landing pages visually with templates, freeform blocks, and a live canvas. Export clean HTML when you're done.",
  },
  {
    icon: Stack,
    title: "Box shadow & glass",
    body: "Dial in shadows, blur, and glassmorphism — then copy Tailwind classes ready for your components.",
  },
  {
    icon: GradientIcon,
    title: "Gradient generator",
    body: "Blend colors into linear or radial gradients and grab the background utility class in one click.",
  },
  {
    icon: FloppyDisk,
    title: "Save your work",
    body: "Store designs in the cloud (via Supabase) so you can pick up where you left off on any visit.",
  },
  {
    icon: Code,
    title: "Copy-ready output",
    body: "Every tool focuses on production-ready CSS and Tailwind — not screenshots or manual guesswork.",
  },
  {
    icon: RocketLaunch,
    title: "Built to ship",
    body: "Publish SEO metadata, export HTML, and share preview links — everything aimed at going live faster.",
  },
] as const;

export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="flex flex-col gap-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            About
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Design and generate Tailwind CSS in one place
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {SITE.name} is a free browser toolkit for makers who use Tailwind CSS. Instead of
            jumping between a design app, a code playground, and docs, you adjust visuals on a
            canvas and copy the result straight into your project.
          </p>
        </div>

        <section className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm ring-1 ring-foreground/[0.03]">
          <h2 className="font-heading text-lg font-semibold tracking-tight">What you can do</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="flex gap-3 rounded-xl border border-border/60 bg-background/50 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon weight="bold" className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Who it&apos;s for
          </h2>
          <p>
            Indie hackers, students, frontend developers, and anyone learning Tailwind who wants a
            visual starting point before refining code in their editor.
          </p>
          <p>
            The site runs on Next.js, Tailwind CSS v4, and Supabase. It&apos;s actively evolving —
            feedback and ideas are always welcome.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            Open the tools
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
          >
            Contact us
          </Link>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </MarketingLayout>
  );
}
