import { getAdSenseClient, isAdSenseConfigured } from "@/lib/ads-config";

/**
 * Server-rendered AdSense tag in <head> so Google's verification crawler
 * can see it in the raw HTML (next/script in the body is too late).
 */
export function AdSenseHeadScript() {
  if (!isAdSenseConfigured()) return null;

  const client = getAdSenseClient();

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
