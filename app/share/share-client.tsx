"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { LandingPreview } from "@/components/tools/landing-preview";
import { decodeShareConfig } from "@/lib/landing-model";

export default function SharePageInner() {
  const params = useSearchParams();
  const encoded = params.get("d") ?? "";
  const [cfg, setCfg] = React.useState<ReturnType<typeof decodeShareConfig>>(null);

  React.useEffect(() => {
    setCfg(decodeShareConfig(encoded));
  }, [encoded]);

  if (!encoded) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-sm text-muted-foreground">
        Missing preview data. Open a share link from the Website Builder.
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

  return (
    <div className="min-h-screen bg-background">
      <LandingPreview cfg={cfg} editable={false} />
    </div>
  );
}
