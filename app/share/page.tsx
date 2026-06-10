"use client";

import { Suspense } from "react";
import SharePageInner from "./share-client";

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading preview…
        </div>
      }
    >
      <SharePageInner />
    </Suspense>
  );
}
