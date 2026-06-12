import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { MarketingLayout } from "@/components/site-shell";
import { getGuide, GUIDES } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMetadata(guide.title, guide.summary, `/guides/${slug}`);
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <MarketingLayout>
      <article className="flex flex-col gap-8">
        <Link
          href="/guides"
          className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft weight="bold" className="size-3.5" />
          All guides
        </Link>

        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Guide · {guide.readMinutes} min read
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{guide.summary}</p>
        </header>

        <div className="flex flex-col gap-8">
          {guide.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="font-heading text-lg font-semibold text-foreground">{section.heading}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex h-9 w-fit items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
        >
          Open the tools
        </Link>
      </article>
    </MarketingLayout>
  );
}
