import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLayout } from "@/components/site-shell";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Privacy Policy",
  "How Tailwind Visual Hub handles data, cookies, advertising, and saved designs.",
  "/privacy"
);

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <article className="flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Legal
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs">Last updated: June 10, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">Overview</h2>
          <p>
            {SITE.name} ({SITE.url}) provides visual design tools in your browser. This policy
            explains what information we collect, how we use it, and your choices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">Information we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Saved designs</strong> — If you use Save, anonymous
              session data and your design JSON may be stored in Supabase to restore your work later.
            </li>
            <li>
              <strong className="text-foreground">Contact form</strong> — Name, email, subject, and
              message when you submit the{" "}
              <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">
                contact form
              </Link>
              .
            </li>
            <li>
              <strong className="text-foreground">Usage analytics</strong> — Hosting providers (e.g.
              Vercel) may log IP addresses, user agents, and request metadata for security and
              performance.
            </li>
            <li>
              <strong className="text-foreground">Local storage</strong> — Theme preference, onboarding
              state, version history, and asset library entries may be stored in your browser.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">Cookies & advertising</h2>
          <p>
            We use Google AdSense to display ads. Google and its partners may use cookies to serve
            ads based on your visits to this and other sites. You can manage ad personalization in{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Google Ads Settings
            </a>
            . See Google&apos;s{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              advertising policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">How we use data</h2>
          <p>
            We use collected information to operate the tools, respond to contact messages, improve
            the product, prevent abuse, and comply with legal obligations. We do not sell your personal
            information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">Third-party services</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Supabase — cloud storage for saved designs</li>
            <li>Google AdSense — advertising</li>
            <li>Vercel — hosting and delivery</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">Your choices</h2>
          <p>
            You can clear browser storage, disable cookies in your browser, or request deletion of
            contact messages by emailing{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {SITE.contactEmail}
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-foreground">Contact</h2>
          <p>
            Questions about this policy?{" "}
            <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">
              Contact us
            </Link>
            .
          </p>
        </section>
      </article>
    </MarketingLayout>
  );
}
