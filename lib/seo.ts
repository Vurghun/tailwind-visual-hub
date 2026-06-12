import type { Metadata } from "next";

import { SITE } from "@/lib/site";

export function pageMetadata(
  title: string,
  description: string,
  path = ""
): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle = `${title} — ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
