import type { Metadata } from "next";
import { Suspense } from "react";

import ExamplesClient from "./examples-client";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Examples",
  "Browse landing page templates for SaaS, restaurants, portfolios, and more — open any in the builder.",
  "/examples"
);

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-muted-foreground">Loading examples…</div>}>
      <ExamplesClient />
    </Suspense>
  );
}
