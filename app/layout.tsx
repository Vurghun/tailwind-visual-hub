import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getAdSenseClient, isAdSenseConfigured } from "@/lib/ads-config";
import { SITE } from "@/lib/site";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Website Builder & CSS Generators`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
};

const themeScript = `(function(){try{var k='tvh-theme',s=localStorage.getItem(k),d=document.documentElement;if(s==='light')d.classList.remove('dark');else d.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = isAdSenseConfigured() ? getAdSenseClient() : null;

  return (
    <html
      lang="en"
      className={cn("dark h-full", geistSans.variable, geistMono.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Script
          id="tvh-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        {adsenseClient ? (
          <Script
            id="adsense-client"
            strategy="lazyOnload"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
