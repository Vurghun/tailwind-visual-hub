import Link from "next/link";
import { Envelope, GithubLogo, ChatCircle } from "@phosphor-icons/react/dist/ssr";

import { ContactForm } from "@/components/contact-form";
import { MarketingLayout } from "@/components/site-shell";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(
  "Contact",
  `Get in touch with the ${SITE.name} team — questions, feedback, or partnership ideas.`,
  "/contact"
);

export default function ContactPage() {
  return (
    <MarketingLayout>
      <div className="flex flex-col gap-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Contact
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Questions about the builder, bug reports, feature ideas, or collaboration — send a
            message and we&apos;ll get back to you when we can.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card/60 p-4 transition-colors hover:border-primary/30 hover:bg-accent/20"
          >
            <Envelope weight="bold" className="size-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Email</span>
            <span className="text-xs text-muted-foreground break-all">{SITE.contactEmail}</span>
          </a>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card/60 p-4 transition-colors hover:border-primary/30 hover:bg-accent/20"
          >
            <GithubLogo weight="bold" className="size-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">GitHub</span>
            <span className="text-xs text-muted-foreground">Issues &amp; discussions</span>
          </a>
          <Link
            href="/"
            className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card/60 p-4 transition-colors hover:border-primary/30 hover:bg-accent/20"
          >
            <ChatCircle weight="bold" className="size-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Try the tools</span>
            <span className="text-xs text-muted-foreground">Back to the app</span>
          </Link>
        </div>

        <section className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm ring-1 ring-foreground/[0.03]">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Send a message</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Fill in the form below — it opens your email app with everything prefilled.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
