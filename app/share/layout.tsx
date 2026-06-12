import type { Metadata } from "next";

import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shared preview",
  description: `Landing page preview shared from ${SITE.name}. Remix it in the builder.`,
  openGraph: {
    title: `Shared page — ${SITE.name}`,
    description: "Preview and remix this landing page in the browser.",
    siteName: SITE.name,
    type: "website",
  },
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
