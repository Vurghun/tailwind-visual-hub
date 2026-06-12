"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PencilSimple, ShareNetwork } from "@phosphor-icons/react";

import { LandingPreview } from "@/components/tools/landing-preview";
import { decodeShareConfig } from "@/lib/landing-model";
import { Button } from "@/components/ui/button";

export default function SharePageInner() {
  const params = useSearchParams();
  const encoded = params.get("d") ?? "";
  const [cfg, setCfg] = React.useState<ReturnType<typeof decodeShareConfig>>(null);

  React.useEffect(() => {
    setCfg(decodeShareConfig(encoded));
  }, [encoded]);

  if (!encoded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm text-muted-foreground">Missing preview data. Open a share link from the Website Builder.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Open builder</Link>
        </Button>
      </div>
    );
  }

  if (!cfg) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-sm text-destructive">
        Could not load this preview. The link may be invalid or truncated.
      </div>
    );
  }

  const remixHref = `/?tool=landing&remix=${encodeURIComponent(encoded)}`;
  const title = cfg.seo?.metaTitle || cfg.brandName || "Shared page";

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground">Shared preview · Tailwind Visual Hub</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="default" className="gap-1.5">
            <Link href={remixHref}>
              <PencilSimple weight="bold" className="size-3.5" />
              Remix in builder
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href);
            }}
          >
            <ShareNetwork weight="bold" className="size-3.5" />
            Copy link
          </Button>
        </div>
      </div>
      <LandingPreview cfg={cfg} editable={false} />
    </div>
  );
}
