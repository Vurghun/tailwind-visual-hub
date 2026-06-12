"use client";

import * as React from "react";
import { PaperPlaneTilt, CircleNotch, CheckCircle } from "@phosphor-icons/react";

import { uiInput, uiTextarea } from "@/lib/ui";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not send message.");
        return;
      }
      setSent(true);
      setMessage("");
    } catch {
      setError("Network error — try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-success/30 bg-success/10 p-6">
        <CheckCircle weight="fill" className="size-8 text-success" />
        <p className="text-sm font-medium text-foreground">Message sent — we&apos;ll get back to you soon.</p>
        <Button variant="outline" size="sm" className="self-start" onClick={() => setSent(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
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

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <Button type="submit" size="lg" className="gap-2 self-start" disabled={loading}>
        {loading ? (
          <CircleNotch weight="bold" className="size-4 animate-spin" />
        ) : (
          <PaperPlaneTilt weight="bold" className="size-4" />
        )}
        {loading ? "Sending…" : "Send message"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Or email{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="font-medium text-foreground underline-offset-4 hover:underline">
          {SITE.contactEmail}
        </a>{" "}
        directly.
      </p>
    </form>
  );
}
