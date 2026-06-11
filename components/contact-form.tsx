"use client";

import * as React from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";

import { uiInput, uiTextarea } from "@/lib/ui";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      message.trim(),
      "",
      "---",
      `Name: ${name.trim() || "Not provided"}`,
      `Email: ${email.trim() || "Not provided"}`,
    ].join("\n");

    const mailto = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(
      subject.trim() || "Tailwind Visual Hub — contact"
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-xs font-medium text-foreground">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={uiInput}
            autoComplete="name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-xs font-medium text-foreground">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={uiInput}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className="text-xs font-medium text-foreground">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What is this about?"
          className={uiInput}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-xs font-medium text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you need help with…"
          rows={5}
          className={cn(uiTextarea, "min-h-[8rem]")}
          required
        />
      </div>

      <Button type="submit" size="lg" className="gap-2 self-start">
        <PaperPlaneTilt weight="bold" className="size-4" />
        Open in email app
      </Button>

      {sent ? (
        <p className="text-xs text-muted-foreground">
          Your email app should open with the message prefilled. If nothing happened, write to{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="font-medium text-foreground underline-offset-4 hover:underline">
            {SITE.contactEmail}
          </a>
          .
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          This opens your default mail app — we don&apos;t store messages on a server yet.
        </p>
      )}
    </form>
  );
}
